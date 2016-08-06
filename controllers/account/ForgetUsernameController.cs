using OneCRS.BLL;
using OneCRS.Common;
using OneCRS.Common.BO;
using OneCRS.Common.Enum;
using OneCRS.MVC.Models;
using OneCRS.MVC.Models.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace OneCRS.MVC.Controllers.Account
{
    public class ForgetUsernameController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(ForgetUsernameModel M)
        {
            try
            {
                string sICNo = string.Empty;
                List<UsersBO> lstUser = new List<UsersBO>();
                UserBLL bll = new UserBLL();
                sICNo = "ICNo='" + M.ICNo + "' AND Role_ID='2' AND Department_ID='5'";
                string sURL = string.Empty;
                int iStatus = 0;
                int iUpdtForgetId = 0;
                UsersBO boUpt = new UsersBO();
                EmailNotification EmailBLL = new EmailNotification();
                string tokenID = "";

                if (M.ICNo != null)
                {
                    lstUser = bll.GetAllUserByID(sICNo);
                    if (lstUser.Count > 0)
                    {
                        if (lstUser[0].SecurityImg == M.SecurityImg)
                        {
                            if (lstUser[0].Email == M.Email)
                            {
                                tokenID = CryptUtils.Encrypt("" + lstUser[0].User_ID + "|" + lstUser[0].ActivationID + "");

                                string sUrl = Url.Action("VerifyUsernameID", "ForgetUsername", new { Token = tokenID }, Request.Url.Scheme);

                                //iStatus = EmailBLL.UsernameVerificationEmail(lstUser[0].Email, lstUser[0].UserName, sUrl);
                                EmailNotificationServiceBLL emailService = new EmailNotificationServiceBLL();
                                string TemplateName = "UserUsernameReset";
                                iStatus = emailService.RegistrationEmailNotification("", lstUser[0].Email, lstUser[0].Name, lstUser[0].UserName, sUrl, TemplateName);

                                if (iStatus == 1)
                                {
                                    string filter = "User_ID='" + lstUser[0].User_ID + "'";
                                    boUpt.ForgotUsernameID = lstUser[0].ActivationID;
                                    boUpt.Password = lstUser[0].Password;
                                    boUpt.Mid = lstUser[0].User_ID.ToString();
                                    boUpt.Mdt = DateTime.Now;
                                    iUpdtForgetId = bll.UpdateForgetUsernameID(boUpt, filter);

                                    ViewBag.Result = "Reset Username link has been sent to registered email successfully";
                                    ModelState.Clear();
                                    return View();
                                }
                                else
                                {
                                    ViewBag.Error = "Sending mail is failed, please try after some time";
                                    return View();
                                }
                            }
                            else
                            {
                                ViewBag.Error = "Invalid Email";
                                return View();
                            }
                        }
                        else
                        {
                            ViewBag.Error = "Invalid Security Image";
                            return View();
                        }
                    }
                    else
                    {
                        ViewBag.Error = "IC No not exists";
                        return View();
                    }
                }
                else
                {
                    ViewBag.Error = "Please enter IC No";
                    return View();
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.ToString());
                return View();
            }
        }

        [AllowAnonymous]
        public async Task<ActionResult> VerifyUsernameID(string Token)
        {
            if (Token != null)
            {
                try
                {
                    string sActivationID = string.Empty;
                    List<UsersBO> lstID = new List<UsersBO>();
                    UserBLL bll = new UserBLL();
                    string DeCryptedTicket = string.Empty;
                    string[] sDecrypt;
                    string UserID = "";
                    string TokenID = "";

                    DeCryptedTicket = CryptUtils.Decrypt(Token);

                    if (DeCryptedTicket.Contains("|"))
                    {
                        sDecrypt = DeCryptedTicket.Split('|');
                        UserID = sDecrypt[0];
                        TokenID = sDecrypt[1];
                    }

                    sActivationID = "ForgotUsernameID='" + TokenID + "' AND User_ID='" + UserID + "'";
                    lstID = bll.GetAllUserByID(sActivationID);
                    if (lstID.Count > 0)
                    {
                        Session["UForgetUserID"] = lstID[0].User_ID;
                        Session["UForgetUserName"] = lstID[0].UserName;
                        Session["UForgetUserdetails"] = lstID[0];
                        return View("SetResetUsername");
                    }
                    else
                    {
                        ViewBag.Result = "Email link is not valid (or) Expired. Please Reset Again!";
                        return RedirectToAction("Index", "ForgetUsername");
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", ex.ToString());
                }
            }
            ViewBag.Result = "TokenID required to perform this function";
            return RedirectToAction("Index", "ForgetUsername");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetUsername(ResetUsernameModel Re)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    UsersBO boUpt = new UsersBO();
                    UserBLL bll = new UserBLL();
                    int iUpdtForgetId = 0;
                    Common1 encrypt = new Common1();
                    string input = "";
                    if (Session["UForgetUserID"] != null)
                    {
                        List<UsersBO> lst1 = new List<UsersBO>();
                        input = "UserName='" + Re.NewUsername + "'";
                        lst1 = bll.GetUserWithFilter(input);

                        if (lst1.Count >= 1)
                        {
                            ViewBag.Error = "Username already Exist";
                            return View("SetResetUsername");
                        }
                        else
                        {
                            //update  New  username and password id
                            boUpt.User_ID = Convert.ToInt32(Session["UForgetUserID"].ToString());
                            boUpt.ForgotUsernameID = null;
                            boUpt.UserName = Re.NewUsername;
                            boUpt.Password = encrypt.PasswordEncode(Re.NewPassword + Re.NewUsername);
                            boUpt.UpdatedDate = DateTime.Now;
                            boUpt.Mid = Session["UForgetUserID"].ToString();
                            boUpt.Mdt = DateTime.Now;

                            string filter = "User_ID='" + Session["UForgetUserID"].ToString() + "'";
                            iUpdtForgetId = bll.UpdateResetUsernameID(boUpt, filter);
                            if (iUpdtForgetId == 1)
                            {
                                Session["UForgetUserID"] = null;
                                Session["UForgetUserName"] = null;
                                Session["UForgetUserdetails"] = null;
                                ViewBag.Reset = "New Username and Password successfully updated";
                            }
                            return View("SetResetUsername");
                        }
                    }
                    else
                    {
                        ViewBag.Result = "No session exists. Please click the link again";
                        return RedirectToAction("Index", "ForgetUsername");
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", ex.ToString());
                }
                return View("SetResetUsername");
            }

            ViewBag.Error = "Please enter all required fields";
            return View("SetResetUsername");
        }

    }
}
