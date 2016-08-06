using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCRS.MVC.Models;
using OneCRS.BLL;
using OneCRS.Common.BO;
using OneCRS.Common;
using Newtonsoft.Json;
using hessiancsharp.client;
using hessiancsharp.io;
using OneCRS.BLL.AuditTrail;
using System.Web.Security;
using System.Collections.Specialized;
using System.Web.Configuration;
using OneCRS.Common.Enum;
using OneCRS.MVC.Filters;
using WebMatrix.WebData;
using OneCRS.MVC;
using System.Web.SessionState;
using OneCRS.MVC.Models.HessianTestModel;
//using OneCRS.MVC.Models.Certificate;

namespace OneCRS.MVC.Controllers
{

    public class HomeController : Controller
    {
        private NameValueCollection appURL = WebConfigurationManager.GetWebApplicationSection("appSettings") as System.Collections.Specialized.NameValueCollection;
        private bool ValidateAllCertificates(object sender, System.Security.Cryptography.X509Certificates.X509Certificate certificate,
                                            System.Security.Cryptography.X509Certificates.X509Chain chain,
                                            System.Net.Security.SslPolicyErrors sslPolicyErrors) { return true; }
        WebPageExceptionDetailsBLL bllEx = new WebPageExceptionDetailsBLL();

        #region User Login
        [AllowAnonymous]
        public ActionResult Index(string returnUrl)
        {
            //SchedulerDeleteCertBLL sceBll = new SchedulerDeleteCertBLL();
            //sceBll.UpdateCertPFX();

            if (returnUrl != null)
            {
                LoginModel login = new LoginModel();
                login.OpenModal = "OPEN";
                return View(login);
            }

            //For account activated
            if (TempData["LoginStatus"] != null)
            {
                TempData["Result"] = TempData["LoginStatus"].ToString();
                LoginModel login = new LoginModel();
                login.OpenModal = "OPEN";
                return View(login);
            }
            return View();
        }

        public ActionResult UserLogin()
        {
            Session["OpenModal"] = "OPEN";
            return RedirectToAction("Index", "Home");
        }

        public void ResetField(LoginModel m)
        {
            ModelState.Clear();

        }

        [AllowAnonymous]
        [HttpGet]
        public JsonResult CheckUsername(string input)
        {
            try
            {

                string filter = "";
                string img = "";
                string security = "";
                List<UsersBO> lst1 = new List<UsersBO>();
                UserBLL bll = new UserBLL();
                filter = "UserName='" + input + "'";

                #region //Added for benchmark time calculation by abu on 29 mar 2016
                // Benchmark.Start();
                lst1 = bll.GetUserWithFilter(filter);

                //Benchmark.End();
                //Later uncommet in server
                //AppEntLogger.WritePerfLog("Time taken for Login : " + filter + " " + Benchmark.GetDuration(), "INFO");
                //Console.WriteLine("Time taken for Login : " + Benchmark.GetDuration());
                #endregion
                if (lst1.Count > 0)
                {
                    img = "<img src=../Images/security/" + lst1[0].SecurityImg + " style=" + "" + "width:70px;height:70px" + "" + "><br>";
                    security = lst1[0].SecurityPhrase;
                }

                var users = new
                {
                    img,
                    security
                };
                return Json(users, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        public ActionResult GetImage()
        {
            string path = Server.MapPath("~/Images/earth.png");
            byte[] imageByteData = System.IO.File.ReadAllBytes(path);
            return File(imageByteData, "image/png");
        }

        public JsonResult GetUsersData()
        {
            var users = GetUsers();
            return Json(users, JsonRequestBehavior.AllowGet);
        }

        private List<LoginModel> GetUsers()
        {
            var usersList = new List<LoginModel>  
            {  
                new LoginModel  
                {  
                    SecurityImg = Server.MapPath("~/Images/earth.png"),
                    SecurityPhrase = "Ram"  
                },     
            };

            return usersList;
        }

        public ContentResult KeepAlive()
        {
            return Content("OK");
        }

        [HttpPost]
        public JsonResult Index(LoginModel m)
        {
            if (ModelState.IsValid)
            {

                List<UsersBO> lstID = new List<UsersBO>();
                UserBLL bll = new UserBLL();
                Common1 encrypt = new Common1();

                string userName = "UserName='" + m.UserName + "'";
                lstID = bll.GetLoginID(userName);

                //if (lstID[0].UserName == m.UserName)
                if (lstID.Count > 0)
                {
                    string aPass = encrypt.PasswordEncode(m.Password + lstID[0].UserName);
                    if (lstID[0].Password == encrypt.PasswordEncode(m.Password + lstID[0].UserName))
                    {
                        if (lstID[0].ActiveDate == null)
                        {
                            return Json(new { Result = "confirmation" }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            Session["UserID"] = lstID[0].User_ID;
                            Session["RoleID"] = lstID[0].Role_ID;
                            Session["DepartmentID"] = lstID[0].Department_ID;
                            Session["Username"] = lstID[0].UserName;
                            Session["Name"] = lstID[0].Name;
                            Session["ICNo"] = lstID[0].ICNo;
                            Session["Email"] = lstID[0].Email;
                            Session["TelNo"] = lstID[0].Mobile_No;
                            Session["UserStatus"] = lstID[0].User_Status;

                            if (lstID[0].UserImg == null && lstID[0].Sex == "M")
                            {
                                Session["UserImage"] = "../assets/global/images/avatars/user.png";
                            }
                            else if (lstID[0].UserImg == null && lstID[0].Sex == "F")
                            {
                                Session["UserImage"] = "../assets/global/images/avatars/user.png";
                            }
                            else
                            {
                                string imguser = "../UploadFiles/UserImage/" + lstID[0].UserImg;
                                Session["UserImage"] = "../UploadFiles/UserImage/" + lstID[0].UserImg;
                            }

                            Session["APHeader"] = "../Images/logo.png";
                            Session["RazorTheme"] = "sidebar-condensed fixed-topbar fixed-sidebar theme-sdtl color-primary dashboard";

                            #region Audit Added on 10 dec 2015

                            Session["AuditLogID"] = GetAppsysAuditTrail();
                            // AppAuditLogger.LogInOut(Session["UserID"].ToString(), "Success", "LogIn");
                            #endregion

                            string decodedUrl = "";
                            if (!string.IsNullOrEmpty(m.ReturnUrl))
                                decodedUrl = Server.UrlDecode(m.ReturnUrl);

                            string k = decodedUrl.TrimStart('/');

                            if (Url.IsLocalUrl(decodedUrl))
                            {
                                return Json(new { Result = "returnURL", newUrl = m.ReturnUrl }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                return Json(new { Result = "successful", newUrl = "../Dashboard/Index" });
                            }
                        }
                    }
                    else
                    {
                        return Json(new { Result = "Invalid Username or Password" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { Result = "Invalid Username or Password" }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { Result = "error" }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region AuditLog
        public void LogUserInfo(string primaryKey, UsersBO newData, UsersBO oldData, string userID, string action, string description)
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

        #region About

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        #endregion

        #region AP Login
        [AllowAnonymous]
        public ActionResult AP(string returnUrl)
        {
            if (Session["UserID"] != null)
            {
                if (returnUrl == null)
                {
                    if (Session["RoleID"].ToString() == "2")
                    {
                        return RedirectToAction("Index", "Dashboard");
                    }
                    else if (Session["RoleID"].ToString() == "3")
                    {
                        return RedirectToAction("AP", "Dashboard");
                    }
                    else
                    {
                        return RedirectToAction("Admin", "Dashboard");
                    }
                }
                else
                {
                    return Redirect(returnUrl);
                }
            }
            return View("AP");
        }

        [HttpPost]
        public JsonResult PostSubmitAP(InternalLogin m)
        {
            System.Net.ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(ValidateAllCertificates);
            CHessianProxyFactory factory = new CHessianProxyFactory();
            HessianIPService hessianIP = new HessianIPService();

            string urlRoam2 = hessianIP.getRoamingIP();
            RoamingService objR = (RoamingService)factory.Create(typeof(RoamingService), urlRoam2);

            int VerifyPIN = objR.VerifyPIN(m.InternalUserID, m.InternalPin);

            if (VerifyPIN == 1)
            {
                List<View_CertificateRegistrationBO> vLogin = new List<View_CertificateRegistrationBO>();
                CertVerificationBLL certbll = new CertVerificationBLL();

                string salesfilter = "Role_ID=3 AND ICNo='" + m.InternalUserID + "'";
                vLogin = certbll.GetAdminLogin(salesfilter);

                if (vLogin.Count > 0)
                {
                    //List<UsersBO> lstID = new List<UsersBO>();
                    List<User_OrganizationBO> lstOrg = new List<User_OrganizationBO>();
                    UserBLL bll = new UserBLL();
                    CertRequestBLL orgbll = new CertRequestBLL();
                    Common1 encrypt = new Common1();
                    string filterOrg = "";

                    filterOrg = "User_ID='" + vLogin[vLogin.Count - 1].User_ID + "'";
                    lstOrg = orgbll.GetCompanyByUserID(filterOrg);
                    string lstOfPro = "";
                    int i = 0;

                    if (lstOrg.Count > 1)
                    {
                        //If more than 1 Project, List down all the project for selection
                        List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
                        ProjectBLL proBll = new ProjectBLL();

                        for (i = 0; i < lstOrg.Count; i++)
                        {
                            lstOfPro += lstOrg[i].ProjectId + ",";
                        }

                        lstOfPro = lstOfPro.TrimEnd(',');

                        string filterPros = "ProjectId IN (" + lstOfPro + ")";
                        lstProject = proBll.GetProjectByID(filterPros);

                        return Json(new { Result = "OK", Message = "LIST", ProjectList = lstProject });
                    }
                    else
                    {
                        //Only have 1 project (check the latest certificate)
                        if (vLogin[vLogin.Count - 1].Cert_Status == 1)
                        {
                            Session["UserID"] = vLogin[vLogin.Count - 1].User_ID;
                            Session["RoleID"] = vLogin[vLogin.Count - 1].Role_ID;
                            Session["DepartmentID"] = vLogin[vLogin.Count - 1].Department_ID;
                            Session["Username"] = vLogin[vLogin.Count - 1].UserName;
                            Session["Name"] = vLogin[vLogin.Count - 1].Name;
                            Session["ICNo"] = vLogin[vLogin.Count - 1].ICNo;
                            Session["Email"] = vLogin[vLogin.Count - 1].Email;
                            Session["TelNo"] = vLogin[vLogin.Count - 1].Mobile_No;
                            Session["ProjectID"] = vLogin[vLogin.Count - 1].Project_Id;
                            Session["RegistrationNo"] = vLogin[vLogin.Count - 1].RegistrationNo;
                            Session["CompanyName"] = vLogin[vLogin.Count - 1].CompanyName;

                            if (vLogin[vLogin.Count - 1].UserImg == null)
                            {
                                Session["UserImage"] = "../assets/global/images/avatars/user.png";
                            }
                            else
                            {
                                string imguser = "../UploadFiles/UserImage/" + vLogin[vLogin.Count - 1].UserImg;
                                Session["UserImage"] = "../UploadFiles/UserImage/" + vLogin[vLogin.Count - 1].UserImg;
                            }

                            if (Session["ProjectID"].ToString() == "2")
                            {
                                Session["APHeader"] = "../Images/Project/MidaLogo.png";
                            }
                            else
                            {
                                Session["APHeader"] = "../Images/logo.png";
                            }

                            Session["AuditLogID"] = GetAppsysAuditTrail();

                            return Json(new { Result = "OK", Message = "REDIRECT" });
                        }
                        else if (vLogin[vLogin.Count - 1].Cert_Status == 2)
                        {
                            return Json(new { Result = "INVALID", Message = "Certificate Revoked" });
                        }
                        else if (vLogin[vLogin.Count - 1].Cert_Status == 3)
                        {
                            return Json(new { Result = "INVALID", Message = "Certificate Expired" });
                        }
                        else
                        {
                            return Json(new { Result = "INVALID", Message = "Invalid Certificate Status" });
                        }
                    }
                }
                else
                {
                    return Json(new { Result = "INVALID", Message = "1CRS Certificate not found" });
                }
            }
            else if (VerifyPIN == 2)
            {
                return Json(new { Result = "ERROR", Message = "Certificate Blocked" });
            }
            else if (VerifyPIN == 4)
            {
                return Json(new { Result = "ERROR", Message = "Wrong PIN" });
            }
            else if (VerifyPIN == 5)
            {
                return Json(new { Result = "ERROR", Message = "User not exist" });
            }
            else if (VerifyPIN == 6)
            {
                return Json(new { Result = "ERROR", Message = "Certificate Revoked" });
            }
            else
            {
                return Json(new { Result = "ERROR", Message = "User not found" });
            }
        }

        [HttpPost]
        public JsonResult SubmitAP(InternalLogin m)
        {
            try
            {
                List<UsersBO> lstID = new List<UsersBO>();
                List<User_OrganizationBO> lstOrg = new List<User_OrganizationBO>();
                UserBLL bll = new UserBLL();
                CertRequestBLL orgbll = new CertRequestBLL();
                Common1 encrypt = new Common1();
                string filterOrg = "";

                string filter = "ICNo='" + m.InternalUserID + "' AND Role_ID='3'";
                lstID = bll.GetAllUserByID(filter);

                filterOrg = "User_ID='" + lstID[0].User_ID + "'";
                lstOrg = orgbll.GetCompanyByUserID(filterOrg);

                Session["UserID"] = lstID[0].User_ID;
                Session["RoleID"] = lstID[0].Role_ID;
                Session["DepartmentID"] = lstID[0].Department_ID;
                Session["Username"] = lstID[0].UserName;
                Session["Name"] = lstID[0].Name;
                Session["ICNo"] = lstID[0].ICNo;
                Session["Email"] = lstID[0].Email;
                Session["TelNo"] = lstID[0].Mobile_No;
                Session["ProjectID"] = m.ProjectID;
                Session["RegistrationNo"] = lstOrg[0].RegistrationNo;
                Session["CompanyName"] = lstOrg[0].CompanyName;

                if (lstID[0].UserImg == null && lstID[0].Sex == "M")
                {
                    Session["UserImage"] = "../assets/global/images/avatars/user.png";
                }
                else if (lstID[0].UserImg == null && lstID[0].Sex == "F")
                {
                    Session["UserImage"] = "../assets/global/images/avatars/user.png";
                }
                else
                {
                    string imguser = "../UploadFiles/UserImage/" + lstID[0].UserImg;
                    Session["UserImage"] = "../UploadFiles/UserImage/" + lstID[0].UserImg;
                }

                if (Session["ProjectID"].ToString() == "2")
                {
                    Session["APHeader"] = "../Images/Project/MidaLogo.png";
                }
                else
                {
                    Session["APHeader"] = "../Images/logo.png";
                }

                #region Audit Added on 10 dec 2015
                Session["AuditLogID"] = GetAppsysAuditTrail();
                // AppAuditLogger.LogInOut(Session["UserID"].ToString(), "Success", "LogIn");
                #endregion

                return Json(new { Result = "OK" });
            }
            catch (Exception ex)
            {
                return Json(new { Result = ex.Message });
            }
        }
        #endregion

        #region Agent Login
        [AllowAnonymous]
        public ActionResult Agent(string returnUrl)
        {
            if (Session["UserID"] != null)
            {
                if (returnUrl == null)
                {
                    if (Session["RoleID"].ToString() == "2")
                    {
                        return RedirectToAction("Index", "Dashboard");
                    }
                    else if (Session["RoleID"].ToString() == "3")
                    {
                        return RedirectToAction("AP", "Dashboard");
                    }
                    else
                    {
                        return RedirectToAction("Admin", "Dashboard");
                    }
                }
                else
                {
                    return Redirect(returnUrl);
                }
            }
            return View();
        }

        [HttpPost]
        public JsonResult PostSubmitAgent(InternalLogin m)
        {
            List<User_OrganizationBO> lstOrg = new List<User_OrganizationBO>();
            List<UsersBO> lstUser = new List<UsersBO>();
            UserBLL bll = new UserBLL();
            CertRequestBLL orgbll = new CertRequestBLL();
            Common1 encrypt = new Common1();
            string filterUser = "";
            string filterOrg = "";

            filterUser = "UserName='" + m.InternalUserID + "' AND Role_ID NOT LIKE '2' AND Role_ID NOT LIKE '3'";
            lstUser = bll.GetAllUserByID(filterUser);

            string lstOfPro = "";
            int i = 0;

            if (lstUser.Count > 0)
            {
                List<RolesBO> lstRole = new List<RolesBO>();
                UserRoleAccessBLL roleBll = new UserRoleAccessBLL();

                string sRoleFilter = "RoleID='" + lstUser[lstUser.Count - 1].Role_ID + "'";
                lstRole = roleBll.GetAllUserswithRoleName(sRoleFilter);

                if (lstRole.Count > 0)
                {
                    if (lstRole[lstRole.Count - 1].RoleType.ToUpper() == "AGENT")
                    {
                        string aPass = encrypt.PasswordEncode(m.InternalPin + lstUser[lstUser.Count - 1].UserName);
                        if (lstUser[lstUser.Count - 1].Password == aPass)
                        {
                            filterOrg = "User_ID='" + lstUser[lstUser.Count - 1].User_ID + "'";
                            lstOrg = orgbll.GetCompanyByUserID(filterOrg);

                            if (lstOrg.Count > 0)
                            {
                                if (lstOrg.Count > 1)
                                {
                                    //If more than 1 Project, List down all the project for selection
                                    List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
                                    ProjectBLL proBll = new ProjectBLL();

                                    for (i = 0; i < lstOrg.Count; i++)
                                    {
                                        lstOfPro += lstOrg[i].ProjectId + ",";
                                    }

                                    lstOfPro = lstOfPro.TrimEnd(',');

                                    string filterPros = "ProjectId IN (" + lstOfPro + ")";
                                    lstProject = proBll.GetProjectByID(filterPros);

                                    return Json(new { Result = "LIST", ProjectList = lstProject });
                                }
                                else
                                {
                                    int MAXUser = lstUser.Count - 1;
                                    int MAXOrg = lstOrg.Count - 1;

                                    Session["UserID"] = lstUser[MAXUser].User_ID;
                                    Session["RoleID"] = lstUser[MAXUser].Role_ID;
                                    Session["DepartmentID"] = lstUser[MAXUser].Department_ID;
                                    Session["Username"] = lstUser[MAXUser].UserName;
                                    Session["Name"] = lstUser[MAXUser].Name;
                                    Session["ICNo"] = lstUser[MAXUser].ICNo;
                                    Session["Email"] = lstUser[MAXUser].Email;
                                    Session["TelNo"] = lstUser[MAXUser].Mobile_No;
                                    Session["UserStatus"] = lstUser[MAXUser].User_Status;
                                    Session["ProjectID"] = lstOrg[MAXOrg].ProjectId;
                                    Session["RegistrationNo"] = lstOrg[MAXOrg].RegistrationNo;
                                    Session["CompanyName"] = lstOrg[MAXOrg].CompanyName;

                                    if (lstUser[MAXUser].UserImg == null)
                                    {
                                        Session["UserImage"] = "../assets/global/images/avatars/user.png";
                                    }
                                    else
                                    {
                                        Session["UserImage"] = "../UploadFiles/UserImage/" + lstUser[MAXUser].UserImg;
                                    }

                                    Session["APHeader"] = "../Images/logo.png";
                                    Session["RazorTheme"] = "sidebar-condensed fixed-topbar fixed-sidebar theme-sdtl color-primary dashboard";

                                    Session["AuditLogID"] = GetAppsysAuditTrail();

                                    string decodedUrl = "";
                                    if (!string.IsNullOrEmpty(m.ReturnUrl))
                                        decodedUrl = Server.UrlDecode(m.ReturnUrl);

                                    if (Url.IsLocalUrl(decodedUrl))
                                    {
                                        return Json(new { Result = "OK", newUrl = m.ReturnUrl }, JsonRequestBehavior.AllowGet);
                                    }
                                    else
                                    {
                                        return Json(new { Result = "OK", newUrl = "../Dashboard/Agent" });
                                    }
                                }
                            }
                            else
                            {
                                return Json(new { Result = "ERROR", Message = "Organisation not found" });
                            }
                        }
                        else
                        {
                            return Json(new { Result = "ERROR", Message = "Wrong Password Entered" });
                        }
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Your Role is not authorised to login here" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Role not found" });
                }
            }
            else
            {
                return Json(new { Result = "ERROR", Message = "User Not Found or Unauthorised Role" });
            }
        }

        [HttpPost]
        public JsonResult SubmitAgent(InternalLogin m)
        {
            try
            {
                List<User_OrganizationBO> lstOrg = new List<User_OrganizationBO>();
                List<UsersBO> lstUser = new List<UsersBO>();
                UserBLL bll = new UserBLL();
                CertRequestBLL orgbll = new CertRequestBLL();
                Common1 encrypt = new Common1();
                string filterUser = "";
                string filterOrg = "";

                int MAXUser = 0;
                int MAXOrg = 0;

                filterUser = "ICNo='" + m.InternalUserID + "' AND Role_ID not like '2' and Role_ID not like '3'";
                lstUser = bll.GetAllUserByID(filterUser);

                filterOrg = "User_ID='" + lstUser[lstUser.Count - 1].User_ID + "' AND ProjectId='" + m.ProjectID + "'";
                lstOrg = orgbll.GetCompanyByUserID(filterOrg);

                MAXUser = lstUser.Count - 1;
                MAXOrg = lstOrg.Count - 1;

                Session["UserID"] = lstUser[MAXUser].User_ID;
                Session["RoleID"] = lstUser[MAXUser].Role_ID;
                Session["DepartmentID"] = lstUser[MAXUser].Department_ID;
                Session["Username"] = lstUser[MAXUser].UserName;
                Session["Name"] = lstUser[MAXUser].Name;
                Session["ICNo"] = lstUser[MAXUser].ICNo;
                Session["Email"] = lstUser[MAXUser].Email;
                Session["TelNo"] = lstUser[MAXUser].Mobile_No;
                Session["UserStatus"] = lstUser[MAXUser].User_Status;
                Session["ProjectID"] = lstOrg[MAXOrg].ProjectId;
                Session["RegistrationNo"] = lstOrg[MAXOrg].RegistrationNo;
                Session["CompanyName"] = lstOrg[MAXOrg].CompanyName;

                if (lstUser[MAXUser].UserImg == null)
                {
                    Session["UserImage"] = "../assets/global/images/avatars/user.png";
                }
                else
                {
                    Session["UserImage"] = "../UploadFiles/UserImage/" + lstUser[MAXUser].UserImg;
                }

                Session["APHeader"] = "../Images/logo.png";
                Session["RazorTheme"] = "sidebar-condensed fixed-topbar fixed-sidebar theme-sdtl color-primary dashboard";

                Session["AuditLogID"] = GetAppsysAuditTrail();

                string decodedUrl = "";
                if (!string.IsNullOrEmpty(m.ReturnUrl))
                    decodedUrl = Server.UrlDecode(m.ReturnUrl);

                if (Url.IsLocalUrl(decodedUrl))
                {
                    return Json(new { Result = "OK", newUrl = m.ReturnUrl }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Result = "OK", newUrl = "../Dashboard/Agent" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        #endregion

        #region Admin Login
        [AllowAnonymous]
        public ActionResult Admin(string returnUrl)
        {
            if (Session["UserID"] != null)
            {
                if (returnUrl == null)
                {
                    if (Session["RoleID"].ToString() == "2")
                    {
                        return RedirectToAction("Index", "Dashboard");
                    }
                    else if (Session["RoleID"].ToString() == "3")
                    {
                        return RedirectToAction("AP", "Dashboard");
                    }
                    else
                    {
                        return RedirectToAction("Admin", "Dashboard");
                    }
                }
                else
                {
                    return Redirect(returnUrl);
                }
            }
            return View();
        }

        [HttpPost]
        public JsonResult AdminLogins(AdminLoginModel m)
        {
            try
            {
                if (m.adminuserid == null || m.adminuserid == "")
                {
                    return Json(new { Result = "INVALID", Message = "Invalid ID or Password" });
                }
                if (m.adminpassword == null || m.adminpassword == "")
                {
                    return Json(new { Result = "INVALID", Message = "Invalid ID or Password" });
                }

                System.Net.ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(ValidateAllCertificates);
                CHessianProxyFactory factory = new CHessianProxyFactory();
                HessianIPService hessianIP = new HessianIPService();

                string urlRoam2 = hessianIP.getRoamingIP();
                RoamingService objR = (RoamingService)factory.Create(typeof(RoamingService), urlRoam2);

                int VerifyPIN = objR.VerifyPIN(m.adminuserid, m.adminpassword);

                if (VerifyPIN == 1)
                {
                    List<View_CertificateRegistrationBO> vLogin = new List<View_CertificateRegistrationBO>();
                    CertVerificationBLL certbll = new CertVerificationBLL();

                    string salesfilter = "(Role_ID!=2 AND Role_ID!=3) AND ICNo='" + m.adminuserid + "'";
                    vLogin = certbll.GetAdminLogin(salesfilter);

                    if (vLogin.Count > 0)
                    {
                        int MAX = vLogin.Count - 1;

                        if (vLogin[MAX].Cert_Status == 1)
                        {
                            Session["UserID"] = vLogin[MAX].User_ID;
                            Session["RoleID"] = vLogin[MAX].Role_ID;
                            Session["DepartmentID"] = vLogin[MAX].Department_ID;
                            Session["Username"] = vLogin[MAX].UserName;
                            Session["Name"] = vLogin[MAX].Name;
                            Session["ICNo"] = vLogin[MAX].ICNo;
                            Session["Email"] = vLogin[MAX].Email;
                            Session["TelNo"] = vLogin[MAX].Mobile_No;
                            Session["ProjectID"] = vLogin[MAX].Project_Id;
                            Session["RegistrationNo"] = vLogin[MAX].RegistrationNo;
                            Session["CompanyName"] = vLogin[MAX].CompanyName;
                            Session["ActiveRequestID"] = vLogin[MAX].CertificateRequestID;

                            if (vLogin[MAX].UserImg == null)
                            {
                                Session["UserImage"] = "../assets/global/images/avatars/user.png";
                            }
                            else
                            {
                                string imguser = "../UploadFiles/UserImage/" + vLogin[MAX].UserImg;
                                Session["UserImage"] = "../UploadFiles/UserImage/" + vLogin[MAX].UserImg;
                            }

                            //Get The Theme and Logo Design
                            List<M_ProjectBO> lstPro = new List<M_ProjectBO>();
                            ProjectBLL proBll = new ProjectBLL();
                            string sFilter = "ProjectId='" + vLogin[MAX].Project_Id + "'";
                            lstPro = proBll.GetProjectTheme(sFilter);
                            if (lstPro.Count > 0)
                            {
                                if (lstPro[lstPro.Count - 1].ThemeClass != null)
                                {
                                    //Using Theme created
                                    Session["RazorTheme"] = lstPro[lstPro.Count - 1].ThemeClass;
                                }
                                else
                                {
                                    //Default Theme
                                    Session["RazorTheme"] = "fixed-topbar fixed-sidebar theme-sdtl color-purple dashboard";
                                }
                            }
                            else
                            {
                                //Default Theme
                                Session["RazorTheme"] = "fixed-topbar fixed-sidebar theme-sdtl color-purple dashboard";
                            }

                            Session["APHeader"] = "../Images/logo.png";
                            Session["AuditLogID"] = GetAppsysAuditTrail();

                            return Json(new { Result = "OK" });
                        }
                        else if (vLogin[MAX].Cert_Status == 2)
                        {
                            return Json(new { Result = "INVALID", Message = "Certificate Revoked" });
                        }
                        else if (vLogin[MAX].Cert_Status == 3)
                        {
                            return Json(new { Result = "INVALID", Message = "Certificate Expired" });
                        }
                        else
                        {
                            return Json(new { Result = "INVALID", Message = "Invalid Certificate Status" });
                        }
                    }
                    else
                    {
                        return Json(new { Result = "INVALID", Message = "1CRS Certificate not found" });
                    }
                }
                else if (VerifyPIN == 2)
                {
                    return Json(new { Result = "ERROR", Message = "Certificate Blocked" });
                }
                else if (VerifyPIN == 5)
                {
                    return Json(new { Result = "ERROR", Message = "User not exist" });
                }
                else if (VerifyPIN == 6)
                {
                    return Json(new { Result = "ERROR", Message = "Certificate Revoked" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Wrong PIN Entered" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = "ERROR Exception" });
            }
        }
        #endregion

        [HttpPost]
        public JsonResult ResetAdminPIN(string adminIcNo, string adminEmail)
        {
            try
            {
                System.Net.ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(ValidateAllCertificates);
                NameValueCollection HessURL = WebConfigurationManager.GetWebApplicationSection("appSettings") as System.Collections.Specialized.NameValueCollection;
                CHessianProxyFactory factory = new CHessianProxyFactory();
                HessianIPService hessianIP = new HessianIPService();

                string urlRoam2 = hessianIP.getRoamingIP();

                RoamingService objR = (RoamingService)factory.Create(typeof(RoamingService), urlRoam2);
                int newStatus = 0;

                newStatus = objR.RequestResetPIN(adminIcNo, adminEmail);

                if (newStatus == 1)
                {
                    List<t_CertificateResetTraxBO> lstReset = new List<t_CertificateResetTraxBO>();
                    t_CertificateResetTraxBO bo = new t_CertificateResetTraxBO();
                    CertResetPINBLL rbll = new CertResetPINBLL();
                   // RandomString random = new RandomString();
                    int flagstatus = 0;

                    string sFilterFlag = "IDNo='" + adminIcNo + "'";
                    lstReset = rbll.GetStatusFlag(sFilterFlag);

                    if (lstReset.Count == 0)
                    {
                        bo.ActivationCode = "";// random.CreateRandom(12);
                        bo.IDNo = adminIcNo;
                        bo.Status = 0;
                        bo.Cid = "1";
                        bo.Cdt = DateTime.Now;
                        flagstatus = rbll.InsertStatus(bo);
                    }
                    else
                    {
                        bo.Status = 0;
                        string sFilter = "IDNo='" + adminIcNo + "'";
                        flagstatus = rbll.UpdateStatus(bo, sFilter);
                    }

                    return Json(new { Status = "OK", Message = "Reset Email successfully sent" });
                }
                else
                {
                    return Json(new { Status = "ERROR", Message = "Email address mismatch with your account" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = "ERROR", Message = "Exception Error" });
            }
        }

        public ActionResult LogOut(string returnUrl)
        {
            int roleID = 0;
            string OpenModal = "";
            if (Session["UserID"] != null)
            {
                roleID = Convert.ToInt32(Session["RoleID"]);
            }
            if (Session["OpenModal"] != null)
            {
                OpenModal = Session["OpenModal"].ToString();
            }

            #region Audit Added
            Guid sGuid = System.Guid.NewGuid();
            if (Session["AuditLogID"] != null)
            {
                sGuid = (Guid)Session["AuditLogID"];
            }

            AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
            bo.AuditLogID = sGuid;
            bo.LoginOutTimestamp = DateTime.Now;
            bo.ActionType = "Logout";
            AppAuditLogger.UpdateUserLogDetails(bo);
            #endregion

            FormsAuthentication.SignOut();
            Session.Clear();
            Session.RemoveAll();

            Response.Cookies.Remove("AuthCookie");
            HttpCookie c = new HttpCookie("AuthCookie");
            c.Expires = DateTime.Now.AddYears(-1);
            Response.Cookies.Add(c);

            Session.Clear();
            Response.ExpiresAbsolute = DateTime.Now;
            Response.Expires = 0;
            Response.CacheControl = "no-cache";
            Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            Response.AppendHeader("Pragma", "no-cache"); // HTTP 1.0.
            Response.AppendHeader("Expires", "0"); // Proxies.
            Session.Abandon(); // clear the session at the end of request
            //Added by abu on 29 dec 2015
            // Below line forces ASP.Net to create a new session identifier by clearing
            // the value of the cookie entry for ASP.Net session id
            // to prevent accepting externally created session identifiers (SSAT finding)
            Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
            //return Json(new { roleID = roleID });
            if (roleID == 2 || roleID == 0)
            {
                if (returnUrl != null || returnUrl != "")
                {
                    return RedirectToAction("Index", "Home", new { returnUrl = returnUrl });
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            else if (roleID == 3)
            {
                if (returnUrl != null || returnUrl != "")
                {
                    return RedirectToAction("AP", "Home", new { returnUrl = returnUrl });
                }
                else
                {
                    return RedirectToAction("AP", "Home");
                }
            }
            else
            {
                if (returnUrl != null || returnUrl != "")
                {
                    return RedirectToAction("Admin", "Home", new { returnUrl = returnUrl });
                }
                else
                {
                    return RedirectToAction("Admin", "Home");
                }
            }
        }

        public ActionResult LogOutAdmin(string returnUrl)
        {
            string OpenModal = "";
            if (Session["OpenModal"] != null)
            {
                OpenModal = Session["OpenModal"].ToString();
            }

            #region Audit Added
            Guid sGuid = System.Guid.NewGuid();
            if (Session["AuditLogID"] != null)
            {
                sGuid = (Guid)Session["AuditLogID"];
            }

            AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
            bo.AuditLogID = sGuid;
            bo.LoginOutTimestamp = DateTime.Now;
            bo.ActionType = "Logout";
            AppAuditLogger.UpdateUserLogDetails(bo);
            #endregion

            FormsAuthentication.SignOut();
            Session.Clear();
            Session.RemoveAll();

            Response.Cookies.Remove("AuthCookie");
            HttpCookie c = new HttpCookie("AuthCookie");
            c.Expires = DateTime.Now.AddYears(-1);
            Response.Cookies.Add(c);

            Session.Clear();
            Response.ExpiresAbsolute = DateTime.Now;
            Response.Expires = 0;
            Response.CacheControl = "no-cache";
            Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            Response.AppendHeader("Pragma", "no-cache"); // HTTP 1.0.
            Response.AppendHeader("Expires", "0"); // Proxies.
            Session.Abandon();
            Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));

            if (returnUrl != null || returnUrl != "")
            {
                return RedirectToAction("Admin", "Home", new { returnUrl = returnUrl });
            }
            else
            {
                return RedirectToAction("Admin", "Home");
            }
        }

        //Added by on 29 dec 2015 (updated on 12 Feb 2016)
        private Guid GetAppsysAuditTrail()
        {
            AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
            try
            {
                HttpBrowserCapabilitiesBase bc = Request.Browser;
                string BrowserType = bc.Browser + " (" + bc.Version + ")";

                int ret = 0;
                bo.AuditLogID = System.Guid.NewGuid();
                bo.LoginTimestamp = DateTime.Now;
                bo.UserID = Convert.ToInt32(Session["UserID"].ToString());
                if (Session["ProjectID"] != null)
                {
                    bo.ProjectID = Convert.ToInt32(Session["ProjectID"].ToString());
                }
                bo.ActionType = "Login";
                bo.SessionID = Session.SessionID;
                bo.BrowserType = BrowserType;
                bo.Module = "Login";
                bo.Description = "Logged in";
                ret = AppAuditLogger.AddUserLogDetails(bo);
            }
            catch (Exception ex)
            {
                AppEntLogger.WritePerfLog(ex.ToString(), "ERROR");
            }
            return bo.AuditLogID;
        }

    }
}
