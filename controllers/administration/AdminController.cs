using OneCRS.BLL;
using OneCRS.BLL.AuditTrail;
using OneCRS.Common.BO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OneCRS.MVC.Controllers.Administration
{
    public class AdminController : Controller
    {
        #region AUDIT TRAIL
        public ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }

        public ActionResult AuditTrail()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }

        [HttpPost]
        public JsonResult AuditList(string ActionType = "", string ValueToFind = "", string ValueSearch = "", int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                jtPageSize += jtStartIndex;

                List<View_AuditTrailBO> lstAudit = new List<View_AuditTrailBO>();
                List<View_AuditTrailBO> lstCount = new List<View_AuditTrailBO>();
                AuditTrailBLL bll = new AuditTrailBLL();

                string filterRole = "";
                string sFiterLoginLogout = "AND ActionType != 'Login' AND ActionType != 'Logout'";

                if (ActionType == null || ActionType == "")
                {
                    if (ValueToFind == null || ValueToFind == "")
                    {
                        filterRole = "ActionType is not null " + sFiterLoginLogout + "";
                    }
                    else
                    {
                        filterRole = "" + ValueSearch + " LIKE '%" + ValueToFind + "%' " + sFiterLoginLogout + "";
                    }
                }
                else if (ActionType != null && (ValueToFind == null || ValueToFind == ""))
                {
                    filterRole = "ActionType='" + ActionType + "' " + sFiterLoginLogout + "";
                }
                else
                {
                    filterRole = "ActionType='" + ActionType + "' AND " + ValueSearch + " LIKE '%" + ValueToFind + "%' " + sFiterLoginLogout + "";
                }

                lstCount = bll.GetUserLogDetailsFilter(filterRole);
                lstAudit = bll.GetUserLogDetailsPagination(filterRole, jtStartIndex, jtPageSize, jtSorting);

                return Json(new { Result = "OK", Records = lstAudit, TotalRecordCount = lstCount.Count() });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult AuditLoginList(string ActionType = "", string ValueToFind = "", string ValueSearch = "", int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                jtPageSize += jtStartIndex;

                List<View_AuditTrailBO> lstAudit = new List<View_AuditTrailBO>();
                List<View_AuditTrailBO> lstCount = new List<View_AuditTrailBO>();
                AuditTrailBLL bll = new AuditTrailBLL();

                string filterRole = "";
                string sFiterLoginLogout = "AND ActionType = 'Login' OR ActionType = 'Logout'";

                if (ActionType == null || ActionType == "")
                {
                    if (ValueToFind == null || ValueToFind == "")
                    {
                        filterRole = "ActionType is not null " + sFiterLoginLogout + "";
                    }
                    else
                    {
                        filterRole = "" + ValueSearch + " LIKE '%" + ValueToFind + "%' " + sFiterLoginLogout + "";
                    }
                }
                else if (ActionType != null && (ValueToFind == null || ValueToFind == ""))
                {
                    filterRole = "ActionType='" + ActionType + "' " + sFiterLoginLogout + "";
                }
                else
                {
                    filterRole = "ActionType='" + ActionType + "' AND " + ValueSearch + " LIKE '%" + ValueToFind + "%' " + sFiterLoginLogout + "";
                }

                lstCount = bll.GetUserLogDetailsFilter(filterRole);
                lstAudit = bll.GetUserLogDetailsPagination(filterRole, jtStartIndex, jtPageSize, jtSorting);

                return Json(new { Result = "OK", Records = lstAudit, TotalRecordCount = lstCount.Count() });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult GetActionType()
        {
            List<AppSysAuditTrailBO> lst = new List<AppSysAuditTrailBO>();
            AppAuditLogger bll = new AppAuditLogger();

            lst = bll.GetUserLogDistinct();

            return Json(new { ActionTypeDB = lst }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region PACKAGE PROCEDURE

        public ActionResult PackageProcedure()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }

        [HttpPost]
        public JsonResult PackageProcedureList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                jtPageSize += jtStartIndex;

                List<View_PackageProjectDetailsBO> lstAll = new List<View_PackageProjectDetailsBO>();
                List<View_PackageProjectDetailsBO> lstCount = new List<View_PackageProjectDetailsBO>();
                PackageProcedureBLL bll = new PackageProcedureBLL();

                string filter = "IsActive='2'";
                lstCount = bll.GetAllPackagefilter(filter);
                lstAll = bll.GetAllPackagefilterwPagination(filter, jtStartIndex, jtPageSize, jtSorting);

                return Json(new { Result = "OK", Records = lstAll, TotalRecordCount = lstCount.Count() });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult PackageActiveProcedureList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                jtPageSize += jtStartIndex;

                List<View_PackageProjectDetailsBO> lstAll = new List<View_PackageProjectDetailsBO>();
                List<View_PackageProjectDetailsBO> lstCount = new List<View_PackageProjectDetailsBO>();
                PackageProcedureBLL bll = new PackageProcedureBLL();

                string filter = "IsActive='1'";
                lstCount = bll.GetAllPackagefilter(filter);
                lstAll = bll.GetAllPackagefilterwPagination(filter, jtStartIndex, jtPageSize, jtSorting);

                return Json(new { Result = "OK", Records = lstAll, TotalRecordCount = lstCount.Count() });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult GetPackageInfo(string sPackageID)
        {
            try
            {
                List<View_PackageProjectDetailsBO> lst = new List<View_PackageProjectDetailsBO>();
                List<M_CertificateTypeBO> lstType = new List<M_CertificateTypeBO>();
                PackageProcedureBLL bll = new PackageProcedureBLL();
                CertificateTypeBLL typebll = new CertificateTypeBLL();

                string sFilter = "PackageId='" + sPackageID + "'";
                lst = bll.GetAllPackagefilter(sFilter);

                lstType = typebll.GetAllCertificateType();

                if (Session["UpdateProcedurePackage"] != null)
                {
                    Session.Remove("UpdateProcedurePackage");
                }
                Session["UpdateProcedurePackage"] = sPackageID;

                return Json(new { Result = "OK", Pack = lst[0], Type = lstType });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateProcedure(string sProcedureID)
        {
            try
            {
                M_PackageBO bo = new M_PackageBO();
                M_CertificateTypeBO certbo = new M_CertificateTypeBO();
                SalesBLL bll = new SalesBLL();
                int status = 0;
                string ProcedurePackage = string.Empty;
                string filter = string.Empty;

                //Update Certificate Type and Status
                bo.CertificateTypeID = Convert.ToInt32(sProcedureID);
                bo.IsActive = 1; // Active
                bo.Mid = Session["UserID"].ToString();
                bo.Mdt = DateTime.Now;

                if (Session["UpdateProcedurePackage"] != null)
                {
                    ProcedurePackage = Session["UpdateProcedurePackage"].ToString();
                    Session.Remove("UpdateProcedurePackage");
                }
                else
                {
                    return Json(new { Status = "ERROR", Message = "No Session Exists" });

                }
                filter = "PackageId='" + ProcedurePackage + "'";
                status = bll.UpdateProcedure(bo, filter);

                if (status >= 1)
                {
                    var addedPackage = bo;
                    return Json(new { Status = "OK", Message = "Package Procedure Updated Successfully" });
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

        [HttpPost]
        public JsonResult GetPackageUpdateInfo(string sPackageID)
        {
            try
            {
                List<View_PackageProjectDetailsBO> lst = new List<View_PackageProjectDetailsBO>();
                List<M_CertificateTypeBO> lstType = new List<M_CertificateTypeBO>();
                PackageProcedureBLL bll = new PackageProcedureBLL();
                CertificateTypeBLL typebll = new CertificateTypeBLL();

                string sFilter = "PackageId='" + sPackageID + "'";
                lst = bll.GetAllPackagefilter(sFilter);

                lstType = typebll.GetAllCertificateType();

                if (Session["UpdateActiveProcedure"] != null)
                {
                    Session.Remove("UpdateActiveProcedure");
                }
                Session["UpdateActiveProcedure"] = sPackageID;

                return Json(new { Result = "OK", Pack = lst[0], Type = lstType }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpdateActiveProcedure(string sUpdateProcedureID)
        {
            try
            {
                M_PackageBO bo = new M_PackageBO();
                M_CertificateTypeBO certbo = new M_CertificateTypeBO();
                SalesBLL bll = new SalesBLL();
                int status = 0;
                string ProcedurePackage = string.Empty;
                string filter = string.Empty;

                //Update Certificate Type and Status
                bo.CertificateTypeID = Convert.ToInt32(sUpdateProcedureID);
                bo.IsActive = 1; // Active
                bo.Mid = Session["UserID"].ToString();
                bo.Mdt = DateTime.Now;

                if (Session["UpdateActiveProcedure"] != null)
                {
                    ProcedurePackage = Session["UpdateActiveProcedure"].ToString();
                    Session.Remove("UpdateActiveProcedure");
                }
                else
                {
                    return Json(new { Status = "ERROR", Message = "No Session Exists" });

                }
                filter = "PackageId='" + ProcedurePackage + "'";
                status = bll.UpdateProcedure(bo, filter);

                if (status >= 1)
                {
                    var addedPackage = bo;
                    return Json(new { Status = "OK", Message = "Package Procedure Updated Successfully" });
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

        #region LOAD AND CREATE NEW PROCEDURE

        [HttpPost]
        public List<M_CertificateTypeBO> GetPackageProcedure()
        {
            List<M_CertificateTypeBO> lstProcedure = new List<M_CertificateTypeBO>();
            CertificateTypeBLL typebll = new CertificateTypeBLL();

            lstProcedure = typebll.GetAllCertificateType();

            return lstProcedure;
        }

        [HttpPost]
        public JsonResult SetPackageProcedure(string sNewProcedure, string sProcedureTypeDesc)
        {
            if (sNewProcedure == null || sNewProcedure == "")
            {
                return Json(new { Result = "ERROR", Message = "Please insert Procedure Name" }, JsonRequestBehavior.AllowGet);
            }
            if (sProcedureTypeDesc == null || sProcedureTypeDesc == "")
            {
                return Json(new { Result = "ERROR", Message = "Please insert Procedure Description" }, JsonRequestBehavior.AllowGet);
            }

            List<M_CertificateTypeBO> lst = new List<M_CertificateTypeBO>();
            CertificateTypeBLL bll = new CertificateTypeBLL();
            M_CertificateTypeBO bo = new M_CertificateTypeBO();

            bo.CertificateTypeName = sNewProcedure;
            bo.CertificateTypeDesc = sProcedureTypeDesc;
            bo.IsActive = 1;
            bo.Cid = Session["UserID"].ToString();
            bo.Cdt = DateTime.Now;
            bo.Mid = Session["UserID"].ToString();
            bo.Mdt = DateTime.Now;

            int iStatus = bll.InsertCertificateType(bo);

            if (iStatus >= 1)
            {
                lst = GetPackageProcedure();

                return Json(new { Result = "OK", NewProcedure = lst }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { Result = "ERROR", Message = "Error Connected to DB"}, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #endregion
    }
}
