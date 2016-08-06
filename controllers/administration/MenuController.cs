using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCRS.Common;
using OneCRS.Common.BO;
using OneCRS.BLL;
using OneCRS.BLL.AuditTrail;
using OneCRS.Common.Enum;
using OneCRS.MVC.Models.Administration;

namespace OneCRS.MVC.Controllers.Administration
{
    public class MenuController : Controller
    {
        //
        // GET: /Menu/

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
        public JsonResult MenuList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                List<MenuBO> lstMenus = new List<MenuBO>();
                int lstCount = 0;
                int iRowEnd = 0;
                iRowEnd = jtPageSize + jtStartIndex;
                MenuBLL bllMenu = new MenuBLL();

                lstMenus = bllMenu.SearchMenuGroupWithPaging("", jtSorting, "", jtStartIndex + 1, iRowEnd, ref lstCount);

                return Json(new { Result = "OK", Records = lstMenus, TotalRecordCount = lstCount });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult CreateNewMenu(Menu Menus)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    //return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                MenuBO boMenu = new MenuBO();
                MenuBLL bll = new MenuBLL();

                boMenu.Menuname = Menus.Menuname;
                boMenu.Menu_URL = Menus.Menu_URL;
                boMenu.MenuparentID = Menus.MenuparentID;
                if (Menus.SubMenuParentID != 0)
                {
                    boMenu.SubMenuParentID = Menus.SubMenuParentID;
                }
                if (Menus.ModuleSeqNo != 0)
                {
                    boMenu.ModuleSeqNo = Menus.ModuleSeqNo;
                }
                boMenu.Active = 'Y';

                List<MenuBO> lstBo = new List<MenuBO>();
                string sFilter = "Menuname='" + Menus.Menuname + "'";
                lstBo = bll.GetMenuList(sFilter);
                if (lstBo.Count == 0)
                {
                    status = bll.InsertMenu(boMenu);
                    if (status > 0)
                    {
                        #region Audit Added on 18 Jan 2016

                        Log_Menu("Menu", boMenu, null, Session["UserID"].ToString(), DBAction.ADD.ToString(), "InsertMenu");

                        #endregion
                        var addedPackage = boMenu;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Menu Added Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Menu Name is already exists. please check!" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult UpdateMenu(Menu Menus)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    // return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                MenuBO boMenu = new MenuBO();
                MenuBLL bll = new MenuBLL();

                boMenu.Menu_ID = Menus.Menu_ID;
                boMenu.Menuname = Menus.Menuname;
                boMenu.Menu_URL = Menus.Menu_URL;
                boMenu.MenuparentID = Menus.MenuparentID;
                if (Menus.SubMenuParentID != 0)
                {
                    boMenu.SubMenuParentID = Menus.SubMenuParentID;
                }
                if (Menus.ModuleSeqNo != 0)
                {
                    boMenu.ModuleSeqNo = Menus.ModuleSeqNo;
                }
                boMenu.Active = 'Y';

                List<MenuBO> lstBo = new List<MenuBO>();
                string sFilter = "Menuname='" + Menus.Menuname + "'";
                lstBo = bll.GetMenuList(sFilter);
                List<MenuBO> lstoldBo = new List<MenuBO>();
                sFilter = "Menu_ID='" + Menus.Menu_ID + "'";
                lstoldBo = bll.GetMenuList(sFilter);

                status = bll.UpdateMenu(boMenu);

                if (status > 0)
                {
                    #region Audit Added on 18 Jan 2016

                    Log_Menu("Menu", boMenu, lstoldBo[0], Session["UserID"].ToString(), DBAction.UPDATE.ToString(), "UpdateMenu");

                    #endregion
                    var addedPackage = boMenu;
                    return Json(new { Result = "OK", Record = addedPackage, Message = "Menu Updated Successfully" });
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
        [HttpPost]
        public JsonResult DeleteMenu(int Menu_ID)
        {
            try
            {
                int status = 0;
                MenuBLL bll = new MenuBLL();
                List<MenuBO> lstBo = new List<MenuBO>();
                string sFilter = "Menu_ID='" + Menu_ID + "'";
                lstBo = bll.GetMenuList(sFilter);

                status = bll.Delete(Menu_ID);
                #region Audit Added on 18 Jan 2016
                if (status == 1)
                {
                    Log_Menu("Menu", null, lstBo[0], Session["UserID"].ToString(), DBAction.DELETE.ToString(), "DeleteMenu");
                }

                #endregion
                return Json(new { Result = "OK", Message = "Menu Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        #region AuditLog Added on 18 Jan 2016 by abu
        public void Log_Menu(string primaryKey, MenuBO newData, MenuBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.Menu, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.Menu, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.Menu, guid);

            }

        }
        #endregion
    }
}
