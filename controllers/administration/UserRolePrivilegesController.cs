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
    public class UserRolePrivilegesController : Controller
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
        public JsonResult UsersRolePrivilegesList(int iDepartmentID = 0,int iRoleGrpID = 0, int iMenuID = 0, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                List<RolePrivilegesBO> lstUsers = new List<RolePrivilegesBO>();
                UserRolePrivilegesBLL bllUser = new UserRolePrivilegesBLL();
                int lstCount = 0;
                int iRowEnd = 0;
                iRowEnd = jtPageSize + jtStartIndex;
                string sFilter = "";

                if (iDepartmentID != 0 && iMenuID != 0 && iRoleGrpID != 0)
                {
                    sFilter = "and DepartmentID='" + iDepartmentID + "' and menu_id='" + iMenuID + "' and RoleGrpID='" + iRoleGrpID + "'";
                }
                else if (iDepartmentID != 0)
                {
                    sFilter = "and DepartmentID='" + iDepartmentID + "'";
                    if (iMenuID != 0)
                    {
                        sFilter = sFilter + "and menu_id='" + iMenuID + "'";
                    }
                    if (iRoleGrpID != 0)
                    {
                        sFilter = sFilter + "and RoleGrpID='" + iRoleGrpID + "'";
                    }
                }
                else if (iMenuID != 0)
                {
                    sFilter = "and menu_id='" + iMenuID + "'";
                    if (iRoleGrpID != 0)
                    {
                        sFilter = sFilter + "and RoleGrpID='" + iRoleGrpID + "'";
                    }
                    if (iDepartmentID != 0)
                    {
                        sFilter = sFilter + "and DepartmentID='" + iDepartmentID + "'";
                    }
                }

                else if (iRoleGrpID != 0)
                {
                    sFilter = "and RoleGrpID='" + iRoleGrpID + "'";
                    if (iDepartmentID != 0)
                    {
                        sFilter = sFilter + "and DepartmentID='" + iDepartmentID + "'";
                    }
                    if (iMenuID != 0)
                    {
                        sFilter = sFilter + "and menu_id='" + iMenuID + "'";
                    }
                }

                lstUsers = bllUser.GetAllRolePrivilegesPagination(sFilter, jtSorting, "", jtStartIndex + 1, iRowEnd, ref lstCount);

                // lstUsers = bllUser.GetAllRolePrivileges();

                return Json(new { Result = "OK", Records = lstUsers, TotalRecordCount = lstCount });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult CreateRolePrivileges(UserRolePrivileges RoleAccess)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                RolePrivilegesBO boRoles = new RolePrivilegesBO();
                UserRolePrivilegesBLL bll = new UserRolePrivilegesBLL();

                boRoles.DepartmentID = RoleAccess.DepartmentID;
                boRoles.RoleGrpID = RoleAccess.RoleGrpID;
                boRoles.menu_id = RoleAccess.menu_id;
                boRoles.Visible = RoleAccess.Visible;
                boRoles.RAdd = RoleAccess.RAdd;
                boRoles.RModify = RoleAccess.RModify;
                boRoles.Cid = Session["UserID"].ToString();
                boRoles.Cdt = DateTime.Now;
                boRoles.Mid = Session["UserID"].ToString();
                boRoles.Mdt = DateTime.Now;

                //Added on 15 dec for validation
                List<RolePrivilegesBO> lstBo = new List<RolePrivilegesBO>();
                string sFilter = "RoleGrpID='" + RoleAccess.RoleGrpID + "' and menu_id='" + RoleAccess.menu_id + "'";
                lstBo = bll.GetAllRolePrivilegesWithFilter(sFilter);
                if (lstBo.Count == 0)
                {
                    status = bll.InsertRolePriviledges(boRoles);

                    if (status > 0)
                    {
                        #region Audit Added on 18 Jan 2016

                        Log_UserPrivileges("UserRolePri", boRoles, null, Session["UserID"].ToString(), DBAction.ADD.ToString(), "AddPri");


                        #endregion
                        var addedPackage = boRoles;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Role Privildges Added Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Menu already exist for this Role Group" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult UpdateRolePrivileges(UserRolePrivileges RoleAccess)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                RolePrivilegesBO boRoles = new RolePrivilegesBO();
                UserRolePrivilegesBLL bll = new UserRolePrivilegesBLL();
                boRoles.RolePrivilegesID = RoleAccess.RolePrivilegesID;
                boRoles.DepartmentID = RoleAccess.DepartmentID;
                boRoles.RoleGrpID = RoleAccess.RoleGrpID;
                boRoles.menu_id = RoleAccess.menu_id;
                boRoles.Visible = RoleAccess.Visible;
                boRoles.RAdd = RoleAccess.RAdd;
                boRoles.RModify = RoleAccess.RModify;
                boRoles.Cid = Session["UserID"].ToString();
                boRoles.Cdt = DateTime.Now;
                boRoles.Mid = Session["UserID"].ToString();
                boRoles.Mdt = DateTime.Now;

                List<RolePrivilegesBO> lstBo = new List<RolePrivilegesBO>();
                string sFilter = "RoleGrpID='" + RoleAccess.RoleGrpID + "' and menu_id='" + RoleAccess.menu_id + "'";
                lstBo = bll.GetAllRolePrivilegesWithFilter(sFilter);

                List<RolePrivilegesBO> lstoldBo = new List<RolePrivilegesBO>();
                sFilter = "RolePrivilegesID='" + RoleAccess.RolePrivilegesID + "'";
                lstoldBo = bll.GetAllRolePrivilegesWithFilter(sFilter);

                if (lstBo.Count > 0)
                {
                    status = bll.UpdateRolePriviledges(boRoles);

                    if (status > 0)
                    {
                        #region Audit Added on 18 Jan 2016

                        Log_UserPrivileges("UserRolePri", boRoles, lstoldBo[0], Session["UserID"].ToString(), DBAction.UPDATE.ToString(), "UpdatePri");


                        #endregion

                        List<RolePrivilegesBO> lstRole = new List<RolePrivilegesBO>();
                        lstRole = bll.GetAllRolePrivileges();

                        var addedPackage = lstRole;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Role Priviledges Updated Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Menu not exist for this Role Group" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult DeleteRolePrivileges(UserRolePrivileges RoleAccess)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                RolePrivilegesBO boRoles = new RolePrivilegesBO();
                UserRolePrivilegesBLL bll = new UserRolePrivilegesBLL();
                boRoles.RolePrivilegesID = RoleAccess.RolePrivilegesID;
                //boRoles.Visible = 0;
                //boRoles.Mid = Session["UserID"].ToString();
                //boRoles.Mdt = DateTime.Now;
                //status = bll.UpdateRolePriviledges(boRoles);
                
                List<RolePrivilegesBO> lstoldBo = new List<RolePrivilegesBO>();
                string sFilter = "RolePrivilegesID='" + RoleAccess.RolePrivilegesID + "'";
                lstoldBo = bll.GetAllRolePrivilegesWithFilter(sFilter);

                string deleteRoleID = RoleAccess.RolePrivilegesID;
                status = bll.Delete(deleteRoleID);

                if (status > 0)
                {
                    List<RolePrivilegesBO> lstRole = new List<RolePrivilegesBO>();
                    lstRole = bll.GetAllRolePrivileges();

                    #region Audit Added on 18 Jan 2016
                    Log_UserPrivileges("UserRolePri", boRoles, lstoldBo[0], Session["UserID"].ToString(), DBAction.UPDATE.ToString(), "DeletePri");
                    #endregion
                    var addedPackage = lstRole;
                    return Json(new { Result = "OK", Record = addedPackage, Message = "Role Priviledges deleted Successfully" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Error connect to the database" });
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
        [HttpPost]
        public JsonResult GetUserMenu(int DepartmentID)
        {
            try
            {
                List<MenuBO> lstMenu = new List<MenuBO>();
                MenuBLL bll = new MenuBLL();
                String sFilter = string.Empty;
                if (DepartmentID == 0)
                {
                    sFilter = "(MenuparentID is not null or MenuparentID is null)"; // "MenuparentID='" + DepartmentID + "'";
                }
                else
                {
                    sFilter = "(Menu_ID='" + DepartmentID + "' or MenuparentID='" + DepartmentID + "')";
                }

                lstMenu = bll.GetMenuALL(sFilter);
                var allDepartment = lstMenu.Select(c => new { DisplayText = c.Menuname, Value = c.Menu_ID });

                return Json(new { Result = "OK", Options = allDepartment });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        //Added on 14 apr 2016 for filter
        [HttpPost]
        public JsonResult GetListData()
        {
         
            UserAdmin bll = new UserAdmin();
            UserRoleAccessBLL bllGrp = new UserRoleAccessBLL();
            MenuBLL Menubll = new MenuBLL();

            //get the country and state ID and VALUE 
            List<RolesGroupBO> lstRoleGroup = new List<RolesGroupBO>();
            lstRoleGroup = bllGrp.GetAllGroup();

            List<M_DepartmentBO> lstDepartment = new List<M_DepartmentBO>();
            lstDepartment = bll.GetAllDepartment();
            List<MenuBO> lstMenu = new List<MenuBO>();
            //lstMenu = Menubll.GetMenuALL();


            if (Request.IsAjaxRequest())
            {
                return Json(new { RoleGrp = lstRoleGroup, Department = lstDepartment, Menu = lstMenu});
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

        #region AuditLog Added on 18 Jan 2016 by abu
        public void Log_UserPrivileges(string primaryKey, RolePrivilegesBO newData, RolePrivilegesBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.RolePrivileges, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.RolePrivileges, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.RolePrivileges, guid);

            }

        }
        #endregion

    }
}
