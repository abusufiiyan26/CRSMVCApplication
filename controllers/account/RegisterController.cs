using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using OneCRS.MVC.Models;
using OneCRS.BLL;
using OneCRS.Common.BO;
using OneCRS.Common;
using OneCRS.BLL.AuditTrail;
using OneCRS.Common.Enum;
using OneCRS.MVC.Models.Service;

namespace SimpleWizardForm.Controllers
{
    public class RegisterController : Controller
    {
        // GET: /Register/
        public ActionResult Index()
        {
            //define a method
            List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            UserBLL bll = new UserBLL();
            //Lookup_CountryBO countList = new Lookup_CountryBO();

            //get the country and state ID and VALUE 
            lstCon = bll.GetAllCountry();
            //lstState = bll.GetAllState();

            //assign it to viewbag 
            ViewBag.CountryID = new SelectList(lstCon, "CountryID", "CountryName");
            ViewBag.StateID = new SelectList(lstState, "StateID", "StateName");

            return View();
        }

        //Get the State value based on Country selected
        [HttpGet]
        public JsonResult GetStates(string CountryID)
        {
            List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            UserBLL bll = new UserBLL();

            lstCon = bll.GetAllCountry();
            //lstState = bll.GetAllState();
            CountryID = "CountryID=" + CountryID;
            lstState = bll.GetStateByCountryID(CountryID);

            ViewBag.CountryID = new SelectList(lstCon, "CountryID", "CountryName");
            ViewBag.StateID = new SelectList(lstState, "StateID", "StateName");

            if (Request.IsAjaxRequest())
            {
                return new JsonResult
                {
                    Data = lstState,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            else
            {
                return new JsonResult
                {
                    Data = "Not valid request",
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(RegisterModel m)
        {
            try
            {
                List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
                List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
                UserBLL bll = new UserBLL();

                lstCon = bll.GetAllCountry();
                lstState = bll.GetAllState();

                ViewBag.CountryID = new SelectList(lstCon, "CountryID", "CountryName", m.Country);
                ViewBag.StateID = new SelectList(lstState, "StateID", "StateName");


                List<UsersBO> lst = new List<UsersBO>();
                EmailNotification emailreg = new EmailNotification();
                UsersBO newUser = new UsersBO();
                Common1 encrypt = new Common1();
                int retvalue = 0;
                int status = 0;
                newUser.UserName = m.UserName;
                newUser.Password = encrypt.PasswordEncode(m.Password + m.UserName);
                newUser.Name = m.Name;
                newUser.IDType = m.IDType;
                if (m.IDType == "IC")
                {
                    newUser.ICNo = m.ICNo;
                }
                else
                {
                    newUser.ICNo = m.Passport;
                }
                newUser.DOB = Convert.ToDateTime(m.DOB);
                newUser.Sex = m.Sex;
                newUser.Address = m.Address;
                newUser.City = m.City;
                newUser.State = m.State;
                newUser.Postcode = m.Postcode;
                newUser.Country = m.Country;
                newUser.Email = m.Email;
                newUser.Mobile_No = m.Mobile_No;
                newUser.SecurityImg = m.SecurityImg;
                newUser.SecurityPhrase = m.SecurityPhrase;
                newUser.Role_ID = 2;
                newUser.Department_ID = 5;
                newUser.Cid = m.UserName;
                newUser.Cdt = DateTime.Now;
                newUser.Mid = m.UserName;
                newUser.Mdt = DateTime.Now;

                newUser.ActivationID = System.Guid.NewGuid();// encrypt.PasswordEncode(m.Password);
                string sUrl = Url.Action("ConfirmEmail", "Register", new { Token = newUser.ActivationID, Email = newUser.Email }, Request.Url.Scheme);
                retvalue = bll.InsertUser(newUser);

                if (retvalue >= 1)
                {
                    #region Audit Added on 10 dec 2015
                    LogRegisterUserInfo("Register", newUser, null, Convert.ToString(retvalue), DBAction.ADD.ToString(), "RegisterUser");
                    #endregion

                    #region Audit Log Transaction on 14 Feb 2016
                    AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
                    try
                    {
                        HttpBrowserCapabilitiesBase bc = Request.Browser;
                        string BrowserType = bc.Browser + " (" + bc.Version + ")";

                        int ret = 0;
                        bo.AuditLogID = System.Guid.NewGuid();
                        bo.LoginTimestamp = DateTime.Now;
                        bo.UserID = retvalue;
                        bo.ProjectID = 0;
                        bo.ActionType = "User Registration";
                        bo.SessionID = Session.SessionID;
                        bo.BrowserType = BrowserType;
                        bo.Module = "Account";
                        bo.Description = newUser.Name + " (" + newUser.ICNo + ") Created New 1CRS Account";

                        ret = AppAuditLogger.AddUserLogDetails(bo);
                    }
                    catch (Exception ex)
                    {
                        AppEntLogger.WritePerfLog(ex.ToString(), "ERROR");
                    }
                    #endregion

                    //status = emailreg.RegistrationEmail(encrypt.PasswordEncode(m.Password), m.Email, m.Name, m.UserName, sUrl);
                    EmailNotificationServiceBLL emailService = new EmailNotificationServiceBLL();
                    string TemplateName = "UserAccountActivation";
                    status = emailService.RegistrationEmailNotification(encrypt.PasswordEncode(m.Password), m.Email, m.Name, m.UserName, sUrl, TemplateName);

                    if (status == 1)
                    {
                        TempData["Result"] = "Email Verification Link Successfully Sent";
                        return RedirectToAction("Status", "Register");
                    }
                    else
                    {
                        TempData["Result"] = "Error while sent an email";
                        return RedirectToAction("Status", "Register");
                    }
                }
                else
                {
                    TempData["Result"] = "Error Creating an User";
                    return RedirectToAction("Status", "Register");
                }
            }
            catch (Exception ex)
            {
                TempData["Result"] = ex.Message;
                return RedirectToAction("Status", "Register");
            }

        }

        // Check IC NO Availability
        [AllowAnonymous]
        public string CheckICNo(string input)
        {
            List<UsersBO> lst1 = new List<UsersBO>();
            UserBLL bll = new UserBLL();
            input = "ICNo='" + input + "' AND Role_ID='2' AND Department_ID='5'";
            lst1 = bll.GetUserWithFilter(input);
            if (lst1.Count > 0)
            {
                return "NotAvailable";
            }
            return "Available";

        }

        // Check Username Availability
        [AllowAnonymous]
        public string CheckUserName(string input)
        {
            List<UsersBO> lst1 = new List<UsersBO>();
            UserBLL bll = new UserBLL();
            input = "UserName='" + input + "' AND Role_ID='2' AND Department_ID='5'";
            lst1 = bll.GetActivationID(input);
            if (lst1.Count > 0)
            {
                return "NotAvailable";
            }
            return "Available";

        }

        [HttpGet]
        public string CheckUserNamePost(string ukname)
        {
            List<UsersBO> lst1 = new List<UsersBO>();
            UserBLL bll = new UserBLL();
            ukname = "UserName='" + ukname + "' AND Role_ID='2' AND Department_ID='5'";
            lst1 = bll.GetActivationID(ukname);
            if (lst1.Count > 0)
            {
                return "NotAvailable";
            }
            return "Available";
        }

        // GET: /Register/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string Token, string Email)
        {
            try
            {
                int i = 0;
                string user_email = "";
                string active_date = "";
                string display_name = "";
                List<UsersBO> lstID = new List<UsersBO>();
                UserBLL bll = new UserBLL();
                UsersBO newUser = new UsersBO();
                UsersBO oldUser = new UsersBO();

                string tokenID = "ActivationID='" + Token + "'";
                lstID = bll.GetActivationID(tokenID);

                for (i = 0; i < lstID.Count; i++)
                {
                    user_email = lstID[i].Email;
                    display_name = lstID[i].UserName;
                    oldUser.ActiveDate = lstID[i].ActiveDate;
                    oldUser.UpdatedDate = lstID[i].UpdatedDate;
                    oldUser.Cid = lstID[i].Cid;
                    oldUser.Mdt = lstID[i].Mdt;
                    oldUser.Mid = lstID[i].Mid;

                    if (lstID[i].ActiveDate == null)
                    {
                        active_date = "no";
                    }
                    else
                    {
                        active_date = "yes";
                    }
                }
                if (lstID.Count > 0)
                {
                    if (user_email == Email)
                    {
                        if (active_date == "no")
                        {
                            newUser.ActiveDate = DateTime.Now;
                            newUser.UpdatedDate = DateTime.Now;
                            newUser.Cid = lstID[0].User_ID.ToString();
                            newUser.Mdt = DateTime.Now;
                            newUser.Mid = lstID[0].User_ID.ToString();
                            int ret = 0;
                            ret = bll.UpdateUser(newUser, tokenID);
                            #region Audit Added on 10 dec 2015
                            if (ret >= 1)
                            {
                                LogRegisterUserInfo("Register", newUser, oldUser, lstID[0].User_ID.ToString(), DBAction.UPDATE.ToString(), "ConfirmationEmail");
                            }

                            #endregion

                            string sUrl = Url.Action("UserLogin", "Home", new { Token = "" }, Request.Url.Scheme);
                            //TempData["Status"] = "OK";
                            TempData["LoginStatus"] = "Your account is activated";
                            Session["OpenModal"] = "OPEN";
                            return RedirectToAction("Index", "Home");
                        }
                        else
                        {
                            TempData["Result"] = "Please Login to enter into 1CRS System";
                            return RedirectToAction("Status", "Register");
                        }
                    }
                    else
                    {
                        TempData["Result"] = "Verification Link is different with your email";
                        return RedirectToAction("Status", "Register");
                    }
                }
                else
                {
                    TempData["Result"] = "User not found";
                    return RedirectToAction("Status", "Register");
                }
            }
            catch (Exception ex)
            {
            }
            return RedirectToAction("Index", "Home");
        }

        public ActionResult Status()
        {
            return View();
        }

        //Get the State value based on Country selected
        [HttpPost]
        public JsonResult GetStateName(string State, string Country)
        {
            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            List<Lookup_CountryBO> lstCountry = new List<Lookup_CountryBO>();
            UserBLL bll = new UserBLL();
            string filter = "", filtercountry = "";

            filter = "StateID=" + State;
            lstState = bll.GetAllStateByID(filter);

            filtercountry = "CountryID=" + Country;
            lstCountry = bll.GetAllCountrybyID(filtercountry);

            if (Request.IsAjaxRequest())
            {
                return Json(new { StateName = lstState[0].StateName, CountryName = lstCountry[0].CountryName });
            }
            else
            {
                return new JsonResult
                {
                    Data = "Not valid request",
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }

        //Create user account based on email from AP
        public ActionResult NewAccount(string TokenID)
        {
            try
            {
                List<UsersBO> lstUser = new List<UsersBO>();
                UserBLL userbll = new UserBLL();

                string DeCryptedTicket = "";
                string userID = "";

                DeCryptedTicket = string.Empty;
                DeCryptedTicket = CryptUtils.Decrypt(TokenID);

                userID = DeCryptedTicket; // userID

                string filtering = "User_ID='" + userID + "'";
                lstUser = userbll.GetAllUserByID(filtering);

                if (lstUser[0].UserName == "1" && lstUser[0].Password == "1")
                {
                    Session["CreateUserID"] = userID;
                    return View();
                }
                else
                {
                    TempData["Result"] = "Please login using your Username and Password";
                    return RedirectToAction("Status", "Register");
                }
            }
            catch (Exception ex)
            {
                TempData["Result"] = ex.Message;
                return RedirectToAction("Status", "Register");
            }

            //return View();
        }

        [HttpPost]
        public JsonResult saveNewAccount(RegisterModel m)
        {
            try
            {
                string userID = Session["CreateUserID"].ToString();
                Session.Remove("CreateUserID");

                List<UsersBO> lstUser = new List<UsersBO>();
                List<UsersBO> lstCheck = new List<UsersBO>();
                UsersBO uBo = new UsersBO();
                UserBLL userbll = new UserBLL();
                Common1 encrypt = new Common1();

                string sUserFilter = "UserName='" + m.UserName + "'";
                lstCheck = userbll.GetAllUserByID(sUserFilter);

                if (lstCheck.Count > 0)
                {
                    return Json(new { Result = "ERROR", Message = "This username already exists" }, JsonRequestBehavior.AllowGet);
                }

                uBo.UserName = m.UserName;
                uBo.Password = encrypt.PasswordEncode(m.Password + m.UserName);
                uBo.SecurityImg = m.SecurityImg;
                uBo.SecurityPhrase = m.SecurityPhrase;
                uBo.ActivationID = System.Guid.NewGuid();
                uBo.ActiveDate = DateTime.Now;
                uBo.Mid = userID;
                uBo.Mdt = DateTime.Now;

                string filter = "User_ID='" + userID + "'";
                int status = userbll.UpdateUserNewAccount(uBo, filter);

                UserBLL usrbll = new UserBLL();
                lstUser = usrbll.GetAllUserByID(filter);

                if (status > 0)
                {
                    #region Audit Log Transaction on 14 Feb 2016
                    AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
                    try
                    {
                        HttpBrowserCapabilitiesBase bc = Request.Browser;
                        string BrowserType = bc.Browser + " (" + bc.Version + ")";

                        int ret = 0;
                        bo.AuditLogID = System.Guid.NewGuid();
                        bo.LoginTimestamp = DateTime.Now;
                        bo.UserID = Convert.ToInt32(userID);
                        bo.ProjectID = 0;
                        bo.ActionType = "User Registration";
                        bo.SessionID = Session.SessionID;
                        bo.BrowserType = BrowserType;
                        bo.Module = "Account";
                        bo.Description = lstUser[0].Name + " (" + lstUser[0].ICNo + ") Created New 1CRS Account";

                        ret = AppAuditLogger.AddUserLogDetails(bo);
                    }
                    catch (Exception ex)
                    {
                        AppEntLogger.WritePerfLog(ex.ToString(), "ERROR");
                    }
                    #endregion

                    return Json(new { Result = "OK" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Error Connected to Database" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = "Error Exception" }, JsonRequestBehavior.AllowGet);
            }
        }

        #region AuditLog Added on 29 Dec 2015 by abu
        public void LogRegisterUserInfo(string primaryKey, UsersBO newData, UsersBO oldData, string userID, string action, string description)
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
