using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCRS.Common.BO;
using OneCRS.BLL;
using OneCRS.MVC.Models.Admin;
using OneCRS.Common;
//using OneCRS.WCFServices;
using OneCRS.Common.Enum;
using OneCRS.BLL.AuditTrail;
using System.Text;
//using OneCRS.MVC.Models.Certificate;

namespace OneCRS.MVC.Controllers.Administration
{
    public class UserAdminController : Controller
    {
        public ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOutAdmin", "Home", new { returnUrl = path });
            }
            return View();
        }

        [HttpPost]
        public JsonResult UsersList(string ValueToFind = "", string ValueSearch = "", int roleID = 0, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                jtPageSize += jtStartIndex;

                List<View_UserDetailsBO> lstUsers = new List<View_UserDetailsBO>();
                List<View_UserDetailsBO> lstCount = new List<View_UserDetailsBO>();
                UserBLL bllUser = new UserBLL();

                string filterRole = "";

                if (roleID == 0)
                {
                    if (ValueToFind == null || ValueToFind == "")
                    {
                        filterRole = "Role_ID!='0'";
                    }
                    else
                    {
                        filterRole = "" + ValueSearch + " LIKE '%" + ValueToFind + "%'";
                    }
                }
                else if (roleID != 0 && (ValueToFind == null || ValueToFind == ""))
                {
                    filterRole = "Role_ID='" + roleID + "'";
                }
                else
                {
                    filterRole = "Role_ID='" + roleID + "' AND " + ValueSearch + " LIKE '%" + ValueToFind + "%'";
                }

                lstCount = bllUser.GetViewUsers(filterRole);
                lstUsers = bllUser.GetViewUserswPagination(filterRole, jtStartIndex, jtPageSize, jtSorting);

                return Json(new { Result = "OK", Records = lstUsers, TotalRecordCount = lstCount.Count() });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateUsersList(string UserID)
        {
            List<UsersBO> lstUsers = new List<UsersBO>();
            UserBLL bllUser = new UserBLL();
            string filterID = "User_ID='" + UserID + "'";
            lstUsers = bllUser.GetAllUserByID(filterID);

            List<User_OrganizationBO> lstOrg = new List<User_OrganizationBO>();
            CertRequestBLL certbll = new CertRequestBLL();
            lstOrg = certbll.GetCompanyByUserID(filterID);

            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            UserBLL bll = new UserBLL();
            lstState = bll.GetAllState();

            var list = lstUsers;

            return Json(new { vList = list[0], OList = lstOrg, sState = lstState });
        }

        [HttpPost]
        public JsonResult ViewUsersList(string UserID)
        {
            List<View_UserDetailsBO> lstUsers = new List<View_UserDetailsBO>();
            UserBLL bllUser = new UserBLL();

            string filterID = "User_ID='" + UserID + "'";
            lstUsers = bllUser.GetViewUsers(filterID);

            var list = lstUsers;

            return Json(new { BO = list[0] });
        }

        public ActionResult ManageUser()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOutAdmin", "Home", new { returnUrl = path });
            }
            if (Session["lstofPro"] != null)
            {
                Session["lstofPro"] = null;
            }
            List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            UserBLL bll = new UserBLL();

            lstCon = bll.GetAllCountry();

            ViewBag.CountryID = new SelectList(lstCon, "CountryID", "CountryName");
            ViewBag.StateID = new SelectList(lstState, "StateID", "StateName");

            return View();
        }

        [HttpPost]
        public JsonResult CheckICExist(string ICNo, string RoleID)
        {
            List<UsersBO> lstUser = new List<UsersBO>();
            UserBLL usrbll = new UserBLL();
            string sFilter = string.Empty;

            if (RoleID == "2")
            {
                sFilter = "ICNo='" + ICNo + "' AND Role_ID='2'";
                lstUser = usrbll.GetAllUserByID(sFilter);
            }
            else
            {
                sFilter = "ICNo='" + ICNo + "' AND Role_ID!='2'";
                lstUser = usrbll.GetAllUserByID(sFilter);
            }
            if (lstUser.Count > 0)
            {
                return Json(new { Result = "OK", Found = "Y" });
            }
            else
            {
                return Json(new { Result = "OK", Found = "N" });
            }
        }

        //Get the country list
        [HttpPost]
        public JsonResult GetCountry()
        {
            try
            {
                List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
                UserBLL bll = new UserBLL();

                //get the country and state ID and VALUE 
                lstCon = bll.GetAllCountry();

                var allproj = lstCon.Select(c => new { DisplayText = c.CountryName, Value = c.CountryID });

                //var allproj = new SelectList(lstproject, "ProjectId", "ProjectName");

                return Json(new { Result = "OK", Options = allproj });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        //Get the state list
        [HttpPost]
        public JsonResult GetState(int CountryID = 135)
        {
            try
            {
                List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
                UserBLL bll = new UserBLL();
                string filter = "";

                //get the country and state ID and VALUE 
                filter = "CountryID='" + CountryID.ToString() + "'";
                lstState = bll.GetStateByCountryID(filter);

                var allstates = lstState.Select(c => new { DisplayText = c.StateName, Value = c.StateID });

                //var allproj = new SelectList(lstproject, "ProjectId", "ProjectName");

                return Json(new { Result = "OK", Options = allstates });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        //Get the role list
        [HttpPost]
        public JsonResult GetRole()
        {
            try
            {
                List<RolesBO> lstRole = new List<RolesBO>();
                UserAdmin bll = new UserAdmin();

                lstRole = bll.GetAllRoles();

                var allRole = lstRole.Select(c => new { DisplayText = c.RoleName, Value = c.RoleID });

                //var allproj = new SelectList(lstproject, "ProjectId", "ProjectName");

                return Json(new { Result = "OK", Options = allRole });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        //Get the department list
        [HttpPost]
        public JsonResult GetDepartment()
        {
            try
            {
                List<M_DepartmentBO> lstRole = new List<M_DepartmentBO>();
                UserAdmin bll = new UserAdmin();

                //get the country and state ID and VALUE 
                lstRole = bll.GetAllDepartment();

                var allDepartment = lstRole.Select(c => new { DisplayText = c.DepartName, Value = c.Department_ID });

                //var allproj = new SelectList(lstproject, "ProjectId", "ProjectName");

                return Json(new { Result = "OK", Options = allDepartment });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        //Get the State value based on Country selected
        [HttpPost]
        public JsonResult GetCreateStates(string CountryID)
        {
            List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            UserBLL bll = new UserBLL();

            lstCon = bll.GetAllCountry();
            CountryID = "CountryID=" + CountryID;
            lstState = bll.GetStateByCountryID(CountryID);

            ViewBag.CountryID = new SelectList(lstCon, "CountryID", "CountryName");
            ViewBag.StateID = new SelectList(lstState, "StateID", "StateName");

            if (Request.IsAjaxRequest())
            {
                return Json(new { State = lstState });
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

        //Get the Country value
        [HttpPost]
        public JsonResult GetCreateCountry()
        {
            if (Session["lstofPro"] != null)
            {
                Session["lstofPro"] = null;
            }

            List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
            UserBLL bll = new UserBLL();

            lstCon = bll.GetAllCountry();

            ViewBag.CountryID = new SelectList(lstCon, "CountryID", "CountryName");

            if (Request.IsAjaxRequest())
            {
                return Json(new { Country = lstCon });
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
        public JsonResult GetCreateRole()
        {
            List<RolesBO> lstRole = new List<RolesBO>();
            UserAdmin bll = new UserAdmin();
            lstRole = bll.GetAllRoles();

            List<M_DepartmentBO> lstDepartment = new List<M_DepartmentBO>();
            lstDepartment = bll.GetAllDepartment();

            List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
            lstProject = bll.GetAllProject();

            List<Lookup_CountryBO> lstCountry = new List<Lookup_CountryBO>();
            lstCountry = bll.GetAllCountry();

            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            lstState = bll.GetAllState();

            if (Request.IsAjaxRequest())
            {
                return Json(new { Role = lstRole, Department = lstDepartment, Project = lstProject, State = lstState, Country = lstCountry });
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
        public JsonResult GetRoleID(string DepartmentID)
        {
            List<RolesBO> lstRole = new List<RolesBO>();
            UserAdmin bll = new UserAdmin();

            string filter = "DepartmentID='" + DepartmentID + "'";
            lstRole = bll.GetRolesbyID(filter);

            if (Request.IsAjaxRequest())
            {
                return Json(new { Role = lstRole });
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
        public JsonResult GetListData()
        {
            List<Lookup_CountryBO> lstCon = new List<Lookup_CountryBO>();
            UserAdmin bll = new UserAdmin();

            List<RolesBO> lstRole = new List<RolesBO>();
            lstRole = bll.GetAllRoles();

            List<M_DepartmentBO> lstDepartment = new List<M_DepartmentBO>();
            lstDepartment = bll.GetAllDepartment();

            List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
            lstProject = bll.GetAllProject();

            List<Lookup_CountryBO> lstCountry = new List<Lookup_CountryBO>();
            lstCountry = bll.GetAllCountry();

            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            lstState = bll.GetAllState();

            List<M_CustomerTypeBO> lstIndustry = new List<M_CustomerTypeBO>();
            lstIndustry = bll.GetAllIndustry();

            if (Request.IsAjaxRequest())
            {
                return Json(new { Role = lstRole, Department = lstDepartment, Project = lstProject, State = lstState, Country = lstCountry, Industry = lstIndustry });
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

        //Get Company Based on selection during update
        [HttpPost]
        public JsonResult GetUpdateOrg(string OrgID)
        {
            List<User_OrganizationBO> lstOrg = new List<User_OrganizationBO>();
            CertRequestBLL bll = new CertRequestBLL();
            string sFilter = "CompanyID='" + OrgID + "'";
            lstOrg = bll.GetCompanyByUserID(sFilter);

            List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
            List<Lookup_CountryBO> lstCountry = new List<Lookup_CountryBO>();
            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            UserBLL usrbll = new UserBLL();
            ProjectBLL probll = new ProjectBLL();
            lstState = usrbll.GetAllState();
            lstCountry = usrbll.GetAllCountry();
            lstProject = probll.GetAllProject();

            if (Request.IsAjaxRequest())
            {
                return Json(new { CList = lstOrg[0], uState = lstState, uCountry = lstCountry, uProject = lstProject });
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
        public JsonResult GetUpdateOrgNew()
        {
            List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
            List<Lookup_CountryBO> lstCountry = new List<Lookup_CountryBO>();
            List<Lookup_StateBO> lstState = new List<Lookup_StateBO>();
            UserBLL usrbll = new UserBLL();
            ProjectBLL probll = new ProjectBLL();
            lstState = usrbll.GetAllState();
            lstCountry = usrbll.GetAllCountry();
            lstProject = probll.GetAllProject();

            if (Request.IsAjaxRequest())
            {
                return Json(new { uState = lstState, uCountry = lstCountry, uProject = lstProject });
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
        public JsonResult UpdateUser(UpdateUser cU)
        {
            try
            {
                List<UsersBO> lst = new List<UsersBO>();
                UsersBO newUser = new UsersBO();
                User_OrganizationBO orgBo = new User_OrganizationBO();
                UserBLL bll = new UserBLL();
                int retUser = 0;

                newUser.Name = cU.UpdateName;
                //newUser.IDType = cU.UpdateIDType;
                newUser.ICNo = cU.UpdateICNo;
                //newUser.DOB = cU.DOB;
                //newUser.Sex = cU.Gender;
                newUser.Address = cU.UpdateAddress;
                newUser.Postcode = cU.UpdatePostcode;
                newUser.City = cU.UpdateCity;
                newUser.Country = cU.UpdateCountryID;
                newUser.State = cU.UpdateStateID;
                newUser.Mobile_No = cU.UpdateMobile_No;
                newUser.Email = cU.UpdateEmail;
                newUser.Mid = Session["UserID"].ToString();
                newUser.Mdt = DateTime.Now;
                string sFilter = "User_ID='" + cU.UpdateUserIDs + "'";
                retUser = bll.UpdateUserInfo(newUser, sFilter);

                if (retUser > 0)
                {
                    return Json(new { Result = "OK", Message = "1CRS Account for user " + cU.UpdateName + " successfully Updated" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Error Inserted user " + cU.UpdateName + " into Database" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateOrgUser(UpdateUser cU)
        {
            try
            {
                User_OrganizationBO orgBo = new User_OrganizationBO();
                UserBLL bll = new UserBLL();
                int retOrg = 0;

                //orgBo.User_ID = retUser;
                //orgBo.CompanyName = cU.OrgName;
                orgBo.RegistrationNo = cU.UpdateOrgRegNo;
                orgBo.Address = cU.UpdateOrgAddress;
                orgBo.City = cU.UpdateOrgCity;
                orgBo.Postcode = cU.UpdateOrgPostcode;
                orgBo.State = cU.UpdateOrgStateID;
                orgBo.Country = cU.UpdateOrgCountryID;
                orgBo.Fax_No = cU.UpdateOrgFaxNo;
                orgBo.Mobile_No = cU.UpdateOrgTelNo;
                orgBo.ProjectId = cU.UpdateOrgProjectID; // 
                string sFilter = "CompanyID='" + cU.UpdateOrgName + "'";
                retOrg = bll.UpdatePublicUserCompany(orgBo, sFilter);

                if (retOrg > 0)
                {
                    return Json(new { Result = "OK", Message = "Registration " + cU.UpdateOrgRegNo + " successfully Updated" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Database is not connected" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult AddNewOrgUser(NewUserOrg cU)
        {
            try
            {
                User_OrganizationBO orgBo = new User_OrganizationBO();
                UserBLL bll = new UserBLL();
                int retOrg = 0;

                orgBo.User_ID = cU.NewAddUserID;
                orgBo.CompanyName = cU.NewAddOrgName;
                orgBo.RegistrationNo = cU.NewAddOrgRegNo;
                orgBo.Address = cU.NewAddOrgAddress;
                orgBo.City = cU.NewAddOrgCity;
                orgBo.Postcode = cU.NewAddOrgPostcode;
                orgBo.State = cU.NewAddOrgStateID;
                orgBo.Country = cU.NewAddOrgCountryID;
                orgBo.Fax_No = cU.NewAddOrgFaxNo;
                orgBo.Mobile_No = cU.NewAddOrgTelNo;
                orgBo.ProjectId = cU.NewAddOrgProject;
                retOrg = bll.InsertAdminOrg(orgBo);

                if (retOrg > 0)
                {
                    return Json(new { Result = "OK", Message = "Registration " + cU.NewAddOrgRegNo + " successfully created" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Database is not connected" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteUser(int User_ID)
        {
            try
            {
                int status = 0;
                UsersBO newUser = new UsersBO();
                List<UsersBO> lstUser = new List<UsersBO>();
                UserBLL bll = new UserBLL();

                string sFilter = "User_ID='" + User_ID + "'";
                status = bll.DeleteUser(sFilter);

                lstUser = bll.GetAllUserByID(sFilter);

                if (status >= 1)
                {
                    #region Audit Log Transaction

                    AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
                    try
                    {
                        HttpBrowserCapabilitiesBase bc = Request.Browser;
                        string BrowserType = bc.Browser + " (" + bc.Version + ")";

                        int ret = 0;
                        bo.AuditLogID = System.Guid.NewGuid();
                        bo.LoginTimestamp = DateTime.Now;
                        if (Session["UserID"] != null)
                        {
                            bo.UserID = Convert.ToInt32(Session["UserID"].ToString());
                        }
                        bo.ProjectID = 1;
                        bo.ActionType = "Delete User";
                        bo.SessionID = Session.SessionID;
                        bo.BrowserType = BrowserType;
                        bo.Module = "Admin";
                        bo.Description = Session["ICNo"].ToString() + " Successfully Delete User of " + lstUser[0].ICNo;
                        ret = AppAuditLogger.AddUserLogDetails(bo);
                    }
                    catch (Exception ex)
                    {
                        AppEntLogger.WritePerfLog(ex.ToString(), "ERROR");
                    }
                    #endregion

                    return Json(new { Result = "OK", Message = "User of ICNo " + lstUser[0].ICNo + " Successfully Deleted" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Failed to be deleted. DB Connection Error" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        public string RandomNumber(int Size)
        {
            string input = "0123456789";
            StringBuilder builder = new StringBuilder();
            Random rnd = new Random();
            char ch;

            for (int i = 0; i < Size; i++)
            {
                ch = input[rnd.Next(0, input.Length)];
                builder.Append(ch);
            }
            return builder.ToString();
        }

        #region AuditLog Added on 18 Jan 2016 by abu
        public void Log_Users(string primaryKey, UsersBO newData, UsersBO oldData, string userID, string action, string description)
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
        public void Log_UsersOrganization(string primaryKey, User_OrganizationBO newData, User_OrganizationBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.User_Organization, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.User_Organization, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.User_Organization, guid);

            }

        }
        #endregion

        [HttpPost]
        public JsonResult AddNewProject(string ProjectID)
        {
            List<ProjectModel> ProjectList = new List<ProjectModel>();
            ProjectModel pro = new ProjectModel();

            List<M_ProjectBO> lstPro = new List<M_ProjectBO>();
            ProjectBLL probll = new ProjectBLL();

            string filter = "ProjectId='" + ProjectID + "'";
            lstPro = probll.GetProjectByID(filter);

            pro.ProjectID = ProjectID;
            pro.ProjectName = lstPro[0].ProjectName;

            if (Session["lstofPro"] != null)
            {
                ProjectList = Session["lstofPro"] as List<ProjectModel>;
            }

            ProjectList.Add(pro);
            Session["lstofPro"] = ProjectList;

            return Json(ProjectList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult delProject(string id)
        {
            List<ProjectModel> xProject = new List<ProjectModel>();
            List<ProjectModel> newxProject = new List<ProjectModel>();

            if (Session["lstofPro"] != null)
            {
                xProject = Session["lstofPro"] as List<ProjectModel>;

                foreach (ProjectModel attach in xProject)
                {
                    if (attach.ProjectID != id)
                    {
                        newxProject.Add(attach);
                    }
                    //else
                    //{
                    //    status = bll.Delete(attach.sNO);
                    //}
                }
                Session["lstofPro"] = newxProject;
            }
            return Json(new { Result = "OK", Message = "OK" });
        }
    }

    public class ProjectModel
    {
        public string ProjectID { get; set; }
        public string ProjectName { get; set; }
    }
}

