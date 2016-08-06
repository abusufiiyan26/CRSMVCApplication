using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCRS.Common.BO;
using OneCRS.BLL;
using OneCRS.MVC.Models;
using System.Threading.Tasks;
using OneCRS.Common;
using OneCRS.Common.Enum;
using OneCRS.BLL.AuditTrail;
using OneCRS.MVC.Models.Service;

namespace OneCRS.MVC.Controllers
{

    public class ForgetPasswordController : Controller
    {
        public ActionResult Index()
        {

            return View();
        }

        [HttpPost]
        public JsonResult SavePassword(ForgetPasswordModel M)
        {
            try
            {
                string sUsername = string.Empty;
                List<UsersBO> lstUser = new List<UsersBO>();
                UserBLL bll = new UserBLL();
                sUsername = "UserName='" + M.UserName + "'";
                string sURL = string.Empty;
                int iStatus = 0;
                int iUpdtForgetId = 0;
                UsersBO boUpt = new UsersBO();
                EmailNotification EmailBLL = new EmailNotification();

                if (M.UserName != null)
                {
                    lstUser = bll.GetActivationID(sUsername);
                    if (lstUser.Count > 0)
                    {
                        string sUrl = Url.Action("VerifyEmailActivationID", "ForgetPassword", new { Token = lstUser[0].ActivationID }, Request.Url.Scheme); //, Email = lstUser[0].Email

                        EmailNotificationServiceBLL emailService = new EmailNotificationServiceBLL();
                        string TemplateName = "UserPasswordReset";
                        iStatus = emailService.RegistrationEmailNotification("", lstUser[0].Email, lstUser[0].Name, lstUser[0].UserName, sUrl, TemplateName);

                        if (iStatus == 1)
                        {
                            //update forget password id
                            boUpt.User_ID = lstUser[0].User_ID;
                            boUpt.ForgotPasswordID = lstUser[0].ActivationID;
                            boUpt.Password = lstUser[0].Password;
                            iUpdtForgetId = bll.UpdateForgetPasswordID(boUpt, "");
                            #region Audit Added on 10 dec 2015
                            if (iUpdtForgetId == 1)
                            {
                                LogForgetUserInfo("ForgetPassword", boUpt, lstUser[0], lstUser[0].User_ID.ToString(), DBAction.UPDATE.ToString(), "ForgetPassword");
                            }

                            #endregion

                            string Msg = "Reset Password link has been sent to registered email successfully. Please check!.";
                            return Json(new { Result = "OK", Message = Msg, UrlRedirect = "Home/Index" });
                        }
                        else
                        {
                            return Json(new { Result = "ERROR", Message = "Sending mail is failed, please try after some time" });
                        }
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "UserName not exist" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "UserName is required" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetPassword(ResetPasswordModel Re)
        {
            if (ModelState.IsValid)
            {
                try
                {

                    UsersBO boUpt = new UsersBO();
                    UserBLL bll = new UserBLL();
                    int iUpdtForgetId = 0;
                    Common1 encrypt = new Common1();
                    if (Session["ForgetUserID"] != null)
                    {
                        //update  New  password id
                        boUpt.User_ID = Convert.ToInt32(Session["ForgetUserID"].ToString());
                        boUpt.ForgotPasswordID = null;
                        boUpt.Password = encrypt.PasswordEncode(Re.NewPassword + Session["ForgetUserName"].ToString());
                        iUpdtForgetId = bll.UpdateForgetPasswordID(boUpt, "");
                        if (iUpdtForgetId == 1)
                        {
                            Session["ForgetUserID"] = null;
                            #region Audit Added on 10 dec 2015
                            if (iUpdtForgetId == 1)
                            {
                                UsersBO boOld = new UsersBO();
                                boOld = (UsersBO)Session["ForgetUserdetails"];
                                LogForgetUserInfo("ResetPassword", boUpt, boOld, boUpt.User_ID.ToString(), DBAction.UPDATE.ToString(), "ResetPassword");
                            }

                            #endregion
                            ViewBag.Reset = "Password successfully is updated.";
                        }
                        // return RedirectToAction("Index", "Home");
                        return View("SetResetPassword");
                    }
                    else
                    {
                        ViewBag.Result = "Please Retry again forget Password.";
                        return View("Index", "ForgetPassword");
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", ex.ToString());
                }
                return View("SetResetPassword");
            }
            return View("SetResetPassword");
        }

        [AllowAnonymous]
        public async Task<ActionResult> VerifyEmailActivationID(string Token) //, string Email
        {
            if (Token != null)
            {
                try
                {
                    string sActivationID = string.Empty;
                    List<UsersBO> lstID = new List<UsersBO>();
                    UserBLL bll = new UserBLL();
                    sActivationID = "ForgotPasswordID='" + Token + "'";
                    lstID = bll.GetAllUserByID(sActivationID);
                    if (lstID.Count > 0)
                    {
                        Session["ForgetUserID"] = lstID[0].User_ID;
                        Session["ForgetUserName"] = lstID[0].UserName;
                        Session["ForgetUserdetails"] = lstID[0];
                        // ViewBag.Reset = "UserName is verified.";
                        return View("SetResetPassword");
                    }
                    else
                    {
                        ViewBag.Result = "Email link is not valid (or) Expired. Please Reset Again!.";
                        return RedirectToAction("Index", "ForgetPassword");
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", ex.ToString());
                }

            }
            return RedirectToAction("Index", "ForgetPassword");

            // return RedirectToAction("Index", "ForgetPassword");
        }

        #region AuditLog Added on 29 Dec 2015 by abu
        public void LogForgetUserInfo(string primaryKey, UsersBO newData, UsersBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.Users, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.Users, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.Users, guid);

            }

        }
        #endregion
    }
}
