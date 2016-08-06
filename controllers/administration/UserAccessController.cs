using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCRS.Common.BO;
using OneCRS.BLL;
using OneCRS.MVC.Models.Administration;
using OneCRS.BLL.AuditTrail;
using OneCRS.Common.Enum;

namespace OneCRS.MVC.Controllers.Administration
{
    public class UserAccessController : Controller
    {
        //
        // GET: /UserAccess/

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
        public JsonResult UsersRoleAccess(int iDepartmentID = 0, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                List<RolesBO> lstUsers = new List<RolesBO>();
                UserRoleAccessBLL bllUser = new UserRoleAccessBLL();
                int lstCount = 0;
                int iRowEnd = 0;
                iRowEnd = jtPageSize + jtStartIndex;
                string sFilter = "";

                if (iDepartmentID != 0)
                {

                    sFilter = "and DepartmentID='" + iDepartmentID + "'";
                }

                lstUsers = bllUser.GetAllRoleAccessPagination(sFilter, jtSorting, "", jtStartIndex + 1, iRowEnd, ref lstCount);
                //lstUsers = bllUser.GetAllUsersRoleAccess();

                return Json(new { Result = "OK", Records = lstUsers, TotalRecordCount = lstCount });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult CreateRoleAccess(UserRoleAccess RoleAccess)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                RolesBO boRoles = new RolesBO();
                UserRoleAccessBLL bll = new UserRoleAccessBLL();

                boRoles.RoleName = RoleAccess.RoleName;
                boRoles.RoleType = RoleAccess.RoleType;
                boRoles.DepartmentID = RoleAccess.DepartmentID;
                boRoles.RoleGrpID = RoleAccess.RoleGrpID;
                boRoles.Cid = Session["UserID"].ToString();
                boRoles.Cdt = DateTime.Now;
                boRoles.Mid = Session["UserID"].ToString();
                boRoles.Mdt = DateTime.Now;
                //Added on 15 dec for validation
                List<RolesBO> lstBo = new List<RolesBO>();
                string sFilter = "RoleName='" + RoleAccess.RoleName + "' and RoleGrpID='" + RoleAccess.RoleGrpID + "' and DepartmentID='" + RoleAccess.DepartmentID + "' and RoleType='"+RoleAccess.RoleType+ "'";
                lstBo = bll.GetAllUserswithRoleName(sFilter);
                if (lstBo.Count == 0)
                {
                    status = bll.InsertRoleAccess(boRoles);

                    if (status > 0)
                    {
                        #region Audit Added on 18 Jan 2016
                        Log_RoleAccess("RoleAccess", boRoles, null, Session["UserID"].ToString(), DBAction.ADD.ToString(), "AddRole");
                        #endregion
                        var addedPackage = boRoles;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Role Added Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Role already is exist for this Role Group. Please Check!." });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult UpdateRoleAccess(UserRoleAccess RoleAccess)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                RolesBO boRoles = new RolesBO();
                UserRoleAccessBLL bll = new UserRoleAccessBLL();
                boRoles.RoleID = RoleAccess.RoleID;
                boRoles.RoleName = RoleAccess.RoleName;
                boRoles.RoleType = RoleAccess.RoleType;
                boRoles.DepartmentID = RoleAccess.DepartmentID;
                boRoles.RoleGrpID = RoleAccess.RoleGrpID;
                boRoles.Mid = Session["UserID"].ToString();
                boRoles.Mdt = DateTime.Now;
                //Added on 15 dec for validation
                List<RolesBO> lstBo = new List<RolesBO>();
                string sFilter = "RoleName='" + RoleAccess.RoleName + "' and RoleGrpID='" + RoleAccess.RoleGrpID + "' and DepartmentID='" + RoleAccess.DepartmentID + "' and RoleType='" + RoleAccess.RoleType + "'";
                lstBo = bll.GetAllUserswithRoleName(sFilter);
                List<RolesBO> lstoldBo = new List<RolesBO>();
                sFilter = "RoleID='" + RoleAccess.RoleID + "'";
                lstoldBo = bll.GetAllUserswithRoleName(sFilter);

                if (lstBo.Count == 0)
                {
                    if (RoleAccess.RoleID > 16)
                    {
                        status = bll.UpdateRoleAccess(boRoles);

                        if (status > 0)
                        {
                            #region Audit Added on 18 Jan 2016

                            Log_RoleAccess("RoleAccess", boRoles, lstoldBo[0], Session["UserID"].ToString(), DBAction.UPDATE.ToString(), "UpdateRole");


                            #endregion
                            var addedPackage = boRoles;
                            return Json(new { Result = "OK", Record = addedPackage, Message = "Role Updated Successfully" });
                        }
                        else
                        {
                            return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                        }
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "This Role can't update. Please Check administrator!." });
                    }
                   
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Role already is exist for this Role Group. Please Check!." });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult DeleteRoleAccess(int RoleID)
        {
            try
            {
                int status = 0;
                UserRoleAccessBLL bll = new UserRoleAccessBLL();
                List<RolesBO> lstoldBo = new List<RolesBO>();
                string sFilter = "RoleID='" + RoleID + "'";
                lstoldBo = bll.GetAllUserswithRoleName(sFilter);
                if (RoleID > 16)
                {
                    status = bll.Delete(RoleID);
                    #region Audit Added on 18 Jan 2016
                    if (status == 1)
                    {
                        Log_RoleAccess("RoleAccess", null, lstoldBo[0], Session["UserID"].ToString(), DBAction.DELETE.ToString(), "DeleteRole");
                    }

                    #endregion
                    return Json(new { Result = "OK", Message = "Role Deleted Successfully" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "This Role can't Delete. Please Check Administrator!." });
                }
                
               
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
        [HttpPost]
        public JsonResult GetUserGroup()
        {
            try
            {
                List<RolesGroupBO> lstRole = new List<RolesGroupBO>();
                UserRoleAccessBLL bll = new UserRoleAccessBLL();

                //get the country and state ID and VALUE 
                lstRole = bll.GetAllGroup();

                var allDepartment = lstRole.Select(c => new { DisplayText = c.RoleGrpName, Value = c.RoleGrpID });

                return Json(new { Result = "OK", Options = allDepartment });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        #region AuditLog Added on 18 Jan 2016 by abu
        public void Log_RoleAccess(string primaryKey, RolesBO newData, RolesBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.Roles, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.Roles, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.Roles, guid);

            }

        }
        #endregion
    }
}
