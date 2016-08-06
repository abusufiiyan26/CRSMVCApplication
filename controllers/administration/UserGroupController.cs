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
    public class UserGroupController : Controller
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
        public JsonResult UsersGroupList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {

                List<RolesGroupBO> lstUsers = new List<RolesGroupBO>();
                int lstCount = 0;
                int iRowEnd = 0;
                iRowEnd = jtPageSize + jtStartIndex;
                UserRoleGroupBLL bllUser = new UserRoleGroupBLL();

                lstUsers = bllUser.GetAllRoleGroupPagination("", jtSorting, "", jtStartIndex + 1, iRowEnd, ref lstCount);// bllUser.GetAllRoleGroup();

                return Json(new { Result = "OK", Records = lstUsers, TotalRecordCount = lstCount });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult CreateRoleGroup(UserRoleGroup RoleGroup)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                RolesGroupBO boRolesGrp = new RolesGroupBO();
                UserRoleGroupBLL bll = new UserRoleGroupBLL();

                boRolesGrp.RoleGrpName = RoleGroup.RoleGrpName;
                boRolesGrp.Cid = Session["UserID"].ToString();
                boRolesGrp.Cdt = DateTime.Now;
                boRolesGrp.Mid = Session["UserID"].ToString();
                boRolesGrp.Mdt = DateTime.Now;
                List<RolesGroupBO> lstBo = new List<RolesGroupBO>();
                string sFilter = "RoleGrpName='" + RoleGroup.RoleGrpName + "'";
                lstBo = bll.GetGroupWithGroupName(sFilter);
                if (lstBo.Count == 0)
                {
                    status = bll.InsertRoleGroup(boRolesGrp);
                    if (status > 0)
                    {
                        #region Audit Added on 18 Jan 2016

                        Log_UserGroup("UserGrp", boRolesGrp, null, Session["UserID"].ToString(), DBAction.ADD.ToString(), "AddGroup");


                        #endregion
                        var addedPackage = boRolesGrp;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Role Group Added Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Group Name is already exists. please check!" });
                }
              
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult UpdateRoleGroup(UserRoleGroup RoleGroup)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                RolesGroupBO boRolesGrp = new RolesGroupBO();
                UserRoleGroupBLL bll = new UserRoleGroupBLL();
                boRolesGrp.RoleGrpID = RoleGroup.RoleGrpID;
                boRolesGrp.RoleGrpName = RoleGroup.RoleGrpName;
                boRolesGrp.Mid = Session["UserID"].ToString();
                boRolesGrp.Mdt = DateTime.Now;

                List<RolesGroupBO> lstBo = new List<RolesGroupBO>();
                string sFilter = "RoleGrpName='" + RoleGroup.RoleGrpName + "'";
                lstBo = bll.GetGroupWithGroupName(sFilter);
                List<RolesGroupBO> lstoldBo = new List<RolesGroupBO>();

                sFilter = "RoleGrpID='" + RoleGroup.RoleGrpID + "'";
                lstoldBo = bll.GetGroupWithGroupName(sFilter);

                if (lstBo.Count == 0)
                {
                    if (RoleGroup.RoleGrpID > 16)
                    {
                        status = bll.UpdateRoleGroup(boRolesGrp);

                        if (status > 0)
                        {
                            #region Audit Added on 18 Jan 2016

                            Log_UserGroup("UserGrp", boRolesGrp, lstoldBo[0], Session["UserID"].ToString(), DBAction.UPDATE.ToString(), "UpdateGroup");


                            #endregion
                            var addedPackage = boRolesGrp;
                            return Json(new { Result = "OK", Record = addedPackage, Message = "Role Group Updated Successfully" });
                        }
                        else
                        {
                            return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                        }
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "This Role Group can't Update. Please Check Administrator!." });
                    }
                    
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Group Name already is exists. Please check!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult DeleteRoleGroup(int RoleGrpID)
        {
            try
            {
                int status = 0;
                UserRoleGroupBLL bll = new UserRoleGroupBLL();
                List<RolesGroupBO> lstoldBo = new List<RolesGroupBO>();

                string sFilter = "RoleGrpID='" + RoleGrpID + "'";
                lstoldBo = bll.GetGroupWithGroupName(sFilter);
                if (RoleGrpID > 16)
                {
                    status = bll.Delete(RoleGrpID);
                    #region Audit Added on 18 Jan 2016
                    if (status == 1)
                    {
                        Log_UserGroup("UserGrp", null, lstoldBo[0], Session["UserID"].ToString(), DBAction.DELETE.ToString(), "DeleteGroup");
                    }

                    #endregion

                    return Json(new { Result = "OK", Message = "Role Group Deleted Successfully" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "This Role Group can't Update. Please Check Administrator!." });
                }
              
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        #region AuditLog Added on 18 Jan 2016 by abu
        public void Log_UserGroup(string primaryKey, RolesGroupBO newData, RolesGroupBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.RolesGroup, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.RolesGroup, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.RolesGroup, guid);

            }

        }
        #endregion
    }
}
