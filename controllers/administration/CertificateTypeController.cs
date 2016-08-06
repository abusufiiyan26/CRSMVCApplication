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
    public class CertificateTypeController : Controller
    {
        //
        // GET: /CertificateType/

        public ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
        [HttpPost]
        public JsonResult CertificateTypeList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                List<M_CertificateTypeBO> lstUsers = new List<M_CertificateTypeBO>();
                CertificateTypeBLL bllUser = new CertificateTypeBLL();
                int lstCount = 0;
                int iRowEnd = 0;
                iRowEnd = jtPageSize + jtStartIndex;
                lstUsers = bllUser.SearchCertificateTypeWithPaging("", jtSorting, "", jtStartIndex + 1, iRowEnd, ref lstCount);


                return Json(new { Result = "OK", Records = lstUsers, TotalRecordCount = lstCount });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult CreateCertificateType(CertificateType CertificateModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                M_CertificateTypeBO boCertificate = new M_CertificateTypeBO();
                CertificateTypeBLL bll = new CertificateTypeBLL();
                boCertificate.CertificateTypeName = CertificateModel.CertificateTypeName;
                boCertificate.CertificateTypeDesc = CertificateModel.CertificateTypeDesc;
                boCertificate.No_Year = CertificateModel.No_Year;
                boCertificate.StartDate = CertificateModel.StartDate;
                boCertificate.EndDate = CertificateModel.EndDate;
                boCertificate.Status = CertificateModel.Status;
                boCertificate.IsActive = 1;
                boCertificate.Mid = Session["UserID"].ToString();
                boCertificate.Mdt = DateTime.Now;
                boCertificate.Cid = Session["UserID"].ToString();
                boCertificate.Cdt = DateTime.Now;
                
                //Added on 15 dec for validation
                List<M_CertificateTypeBO> lstBo = new List<M_CertificateTypeBO>();
                string sFilter = "CertificateTypeName='" + CertificateModel.CertificateTypeName + "' and No_Year='" + CertificateModel.No_Year + "'";
                lstBo = bll.GetAllwithCertificateName(sFilter);

                if (lstBo.Count == 0)
                {
                    status = bll.InsertCertificateType(boCertificate);

                    if (status > 0)
                    {
                        #region Audit Added on 10 dec 2015

                        Log_M_CertificateType("CertificateType", boCertificate, null, Session["UserID"].ToString(), DBAction.ADD.ToString(), "InsertCertificate");


                        #endregion

                        var addedPackage = boCertificate;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Certificate Type is Added Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Certificate Type is already exist. Please Check!." });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult UpdateCertificateType(CertificateType CertificateModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                M_CertificateTypeBO boCertificate = new M_CertificateTypeBO();
                CertificateTypeBLL bll = new CertificateTypeBLL();
                boCertificate.CertificateTypeID = CertificateModel.CertificateTypeID;
                boCertificate.CertificateTypeName = CertificateModel.CertificateTypeName;
                boCertificate.CertificateTypeDesc = CertificateModel.CertificateTypeDesc;
                boCertificate.No_Year = CertificateModel.No_Year;
                boCertificate.StartDate = CertificateModel.StartDate;
                boCertificate.EndDate = CertificateModel.EndDate;
                boCertificate.Status = CertificateModel.Status;
                boCertificate.IsActive = 1;
                boCertificate.Mid = Session["UserID"].ToString();
                boCertificate.Mdt = DateTime.Now;
                //Added on 15 dec for validation
                List<M_CertificateTypeBO> lstBo = new List<M_CertificateTypeBO>();
                string sFilter = "CertificateTypeName='" + CertificateModel.CertificateTypeName + "' and No_Year='" + CertificateModel.No_Year + "'";
                lstBo = bll.GetAllwithCertificateName(sFilter);
              
                List<M_CertificateTypeBO> lstoldBo = new List<M_CertificateTypeBO>();
                sFilter = "CertificateTypeID='" + CertificateModel.CertificateTypeID + "'";
                lstoldBo = bll.GetAllwithCertificateName(sFilter);

                if (lstBo.Count == 0)
                {
                    status = bll.UpdateCertificateType(boCertificate);

                    if (status > 0)
                    {
                        #region Audit Added on 10 dec 2015

                        Log_M_CertificateType("CertificateType", boCertificate, lstoldBo[0], Session["UserID"].ToString(), DBAction.UPDATE.ToString(), "UpdateCertificate");


                        #endregion
                        var addedPackage = boCertificate;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Certificatetype is  Updated Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Certificatetype already is exist. Please Check!." });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult DeleteCertificateType(int CertificateTypeID)
        {
            try
            {
                int status = 0;
                CertificateTypeBLL bll = new CertificateTypeBLL();
                List<M_CertificateTypeBO> lstoldBo = new List<M_CertificateTypeBO>();
                string sFilter = "CertificateTypeID='" + CertificateTypeID + "'";
                lstoldBo = bll.GetAllwithCertificateName(sFilter);
                status = bll.Delete(CertificateTypeID);
                #region Audit Added on 10 dec 2015
                if (status >= 1)
                {
                    Log_M_CertificateType("CertificateType", null, lstoldBo[0], Session["UserID"].ToString(), DBAction.DELETE.ToString(), "DeleteCertificate");
                }

                #endregion
                return Json(new { Result = "OK", Message = "CertificateType is deleted Successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        #region AuditLog Added on 29 Dec 2015 by abu
        public void Log_M_CertificateType(string primaryKey, M_CertificateTypeBO newData, M_CertificateTypeBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.M_CertificateType, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.M_CertificateType, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.M_CertificateType, guid);

            }

        }
        #endregion
    }
}
