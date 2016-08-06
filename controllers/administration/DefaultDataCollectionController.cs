using OneCRS.BLL;
using OneCRS.Common.BO;
using OneCRS.MVC.Models.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OneCRS.MVC.Controllers.Administration
{
    public class DefaultDataCollectionController : Controller
    {
        public ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }

        public ActionResult ManageDDC()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }

        [HttpPost]
        public JsonResult DDCList(string ValueToFind = "", string ValueSearch = "", int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                jtPageSize += jtStartIndex;

                List<DefaultDataCollectionBO> lstDDC = new List<DefaultDataCollectionBO>();
                List<DefaultDataCollectionBO> lstCount = new List<DefaultDataCollectionBO>();
                DefaultDataCollectionBLL bll = new DefaultDataCollectionBLL();

                string sFilter = "";

                if (ValueToFind != "" && ValueSearch != "")
                {
                    sFilter = ValueSearch + " LIKE '%" + ValueToFind + "%'";
                }
                else
                {
                    sFilter = "Module is not null";
                }
                //for authentication added by abu
                if (Session["RoleID"] != null)
                {
                    List<RolesBO> lstRole = new List<RolesBO>();
                    UserRoleAccessBLL rolebll = new UserRoleAccessBLL();
                    string sVFilter = "RoleID='" + Session["RoleID"].ToString() + "'";
                    lstRole = rolebll.GetAllUserswithRoleName(sVFilter);

                    if (lstRole.Count > 0)
                    {
                        if (lstRole[0].RoleName.Contains("Production") || lstRole[0].RoleName.Contains("Registration Officer")) //Prod admin
                        {
                            sFilter = sFilter + " and Module <>'Sales' and Module <>'Finance'";
                        }
                        else if (lstRole[0].RoleName.Contains("Finance")) //Finance admin
                        {
                            sFilter = sFilter + " and Module ='Finance'";
                        }
                        else if (lstRole[0].RoleName.Contains("Sales")) //sales admin
                        {
                            sFilter = sFilter + " and Module ='Sales'";
                        }
                    }
                }
                lstCount = bll.GetDDCListFilter(sFilter);
                lstDDC = bll.GetDDCListFilterPagination(sFilter, jtStartIndex, jtPageSize, jtSorting);

                return Json(new { Result = "OK", Records = lstDDC, TotalRecordCount = lstCount.Count() });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        public JsonResult DDCGetAction(string RNO)
        {
            try
            {
                List<DefaultDataCollectionBO> lst = new List<DefaultDataCollectionBO>();
                DefaultDataCollectionBO bo = new DefaultDataCollectionBO();
                DefaultDataCollectionBLL bll = new DefaultDataCollectionBLL();

                string sFilter = "RNO='" + RNO + "'";
                lst = bll.GetDDCListFilter(sFilter);

                if (lst.Count > 0)
                {
                    return Json(new { Status = "OK", List = lst[0] });
                }
                else
                {
                    return Json(new { Status = "ERROR", Message = "Error connect to the database" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = "ERROR", Message = ex.Message });
            }
        }

        public JsonResult DDCCreateAction(ManageDDCModel m)
        {
            try
            {

                List<DefaultDataCollectionBO> lst = new List<DefaultDataCollectionBO>();
                DefaultDataCollectionBO bo = new DefaultDataCollectionBO();
                DefaultDataCollectionBLL bll = new DefaultDataCollectionBLL();
                int INSERT_STATUS = 0;

                bo.Module = m.Module;
                bo.KeyData = m.KeyData;
                bo.Value = m.Value;
                bo.KeyValue = m.KeyValue;
                bo.Cid = Session["UserID"].ToString();
                bo.Cdt = DateTime.Now;
                bo.Mid = Session["UserID"].ToString();
                bo.Mdt = DateTime.Now;
                INSERT_STATUS = bll.InsertIntoDDC(bo);

                if (INSERT_STATUS >= 1)
                {
                    return Json(new { Status = "OK", Message = "New Data Successfully Saved" });
                }
                else
                {
                    return Json(new { Status = "ERROR", Message = "Error connect to the database" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = "ERROR", Message = ex.Message });
            }
        }

        public JsonResult DDUpdateAction(ManageDDCModel m)
        {
            try
            {
                List<DefaultDataCollectionBO> lst = new List<DefaultDataCollectionBO>();
                DefaultDataCollectionBO bo = new DefaultDataCollectionBO();
                DefaultDataCollectionBLL bll = new DefaultDataCollectionBLL();
                string sFilter = string.Empty;
                int UPDATE_STATUS = 0;

                bo.Module = m.Module;
                bo.KeyData = m.KeyData;
                bo.Value = m.Value;
                bo.KeyValue = m.KeyValue;
                bo.Mid = Session["UserID"].ToString();
                bo.Mdt = DateTime.Now;
                sFilter = "RNO='" + m.RNO + "'";
                UPDATE_STATUS = bll.UpdateIntoDDC(bo, sFilter);

                if (UPDATE_STATUS >= 1)
                {
                    return Json(new { Status = "OK", Message = "Data Successfully Updated" });
                }
                else
                {
                    return Json(new { Status = "ERROR", Message = "Error connect to the database" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = "ERROR", Message = ex.Message });
            }
        }

        public JsonResult DDCDeleteAction(ManageDDCModel m)
        {


            return Json(new { Status = "ERROR", Message = "Default collection only can edit, for delete please contact 1CRS Admin." });


        }
    }
}
