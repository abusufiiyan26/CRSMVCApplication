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
    public class CertificateProcedureController : Controller
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
        [HttpPost]
        public JsonResult CertificateProcedureList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                List<M_CertificateProcedureBO> lst = new List<M_CertificateProcedureBO>();
                CertificateProcedureBLL bll = new CertificateProcedureBLL();
                int lstCount = 0;
                int iRowEnd = 0;
                iRowEnd = jtPageSize + jtStartIndex;
                lst = bll.SearchCertificateProcedureWithPaging("", jtSorting, "", jtStartIndex + 1, iRowEnd, ref lstCount);


                return Json(new { Result = "OK", Records = lst, TotalRecordCount = lstCount });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult CreateCertificateProcedure(CertificateProcedure CertificateProcModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                M_CertificateProcedureBO boCertificate = new M_CertificateProcedureBO();
                CertificateProcedureBLL bll = new CertificateProcedureBLL();

                boCertificate.ProcedureName = CertificateProcModel.ProcedureName;
                boCertificate.ClassID = CertificateProcModel.ClassID;
                boCertificate.StartDate = CertificateProcModel.StartDate;
                boCertificate.EndDate = CertificateProcModel.EndDate;
                boCertificate.Status = CertificateProcModel.Status;
                boCertificate.IsActive = 1;
                boCertificate.Mid = Session["UserID"].ToString();
                boCertificate.Mdt = DateTime.Now;
                boCertificate.Cid = Session["UserID"].ToString();
                boCertificate.Cdt = DateTime.Now;

                //Added on 15 dec for validation
                List<M_CertificateProcedureBO> lstBo = new List<M_CertificateProcedureBO>();
                string sFilter = "ProcedureName='" + CertificateProcModel.ProcedureName + "' and ClassID='" + CertificateProcModel.ClassID + "'";
                lstBo = bll.GetAllwithCertificateName(sFilter);

                if (lstBo.Count == 0)
                {
                    status = bll.InsertCertificateProcedureIdType(boCertificate);

                    if (status > 0)
                    {
                        #region Audit Added on 10 dec 2015

                        Log_M_CertificateProcedure("CertificateProcedure", boCertificate, null, Session["UserID"].ToString(), DBAction.ADD.ToString(), "InsertCertificateProcedure");


                        #endregion

                        var addedPackage = boCertificate;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Certificate Procedure is Added Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Certificate Procedure is already exist. Please Check!." });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult UpdateCertificateProcedure(CertificateProcedure CertificateModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { Result = "ERROR", Message = "Form is not valid! Please correct it and try again." });
                }

                int status = 0;

                M_CertificateProcedureBO boCertificate = new M_CertificateProcedureBO();
                CertificateProcedureBLL bll = new CertificateProcedureBLL();

                boCertificate.ProcedureName = CertificateModel.ProcedureName;
                boCertificate.ProcedureId = CertificateModel.ProcedureId;
                boCertificate.ClassID = CertificateModel.ClassID;
                boCertificate.StartDate = CertificateModel.StartDate;
                boCertificate.EndDate = CertificateModel.EndDate;
                boCertificate.Status = CertificateModel.Status;
                boCertificate.IsActive = 1;
                boCertificate.Mid = Session["UserID"].ToString();
                boCertificate.Mdt = DateTime.Now;
                //Added on 15 dec for validation
                List<M_CertificateProcedureBO> lstBo = new List<M_CertificateProcedureBO>();
                string sFilter = "ProcedureName='" + CertificateModel.ProcedureName + "' and ClassID='" + CertificateModel.ClassID + "'";
                lstBo = bll.GetAllwithCertificateName(sFilter);

                List<M_CertificateProcedureBO> lstoldBo = new List<M_CertificateProcedureBO>();
                sFilter = "ProcedureId='" + CertificateModel.ProcedureId + "'";
                lstoldBo = bll.GetAllwithCertificateName(sFilter);

                if (lstBo.Count == 0)
                {
                    status = bll.UpdateCertificateProcedureIdType(boCertificate);

                    if (status > 0)
                    {
                        #region Audit Added on 10 dec 2015

                        Log_M_CertificateProcedure("CertificateProcedure", boCertificate, lstoldBo[0], Session["UserID"].ToString(), DBAction.UPDATE.ToString(), "UpdateCertificateProcedure");


                        #endregion
                        var addedPackage = boCertificate;
                        return Json(new { Result = "OK", Record = addedPackage, Message = "Certificate Procedure is  Updated Successfully" });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = "Error connect to the database" });
                    }
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Certificate Procedure already is exist. Please Check!." });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult DeleteCertificateProcedure(int ProcedureId)
        {
            try
            {
                int status = 0;
                CertificateProcedureBLL bll = new CertificateProcedureBLL();
                List<M_CertificateProcedureBO> lstoldBo = new List<M_CertificateProcedureBO>();
                string sFilter = "ProcedureId='" + ProcedureId + "'";
                lstoldBo = bll.GetAllwithCertificateName(sFilter);
                status = bll.DeleteProcedureId(ProcedureId);
                #region Audit Added on 10 dec 2015
                if (status >= 1)
                {
                    Log_M_CertificateProcedure("CertificateProcedure", null, lstoldBo[0], Session["UserID"].ToString(), DBAction.DELETE.ToString(), "DeleteCertificateProcedure");
                }

                #endregion
                return Json(new { Result = "OK", Message = "Certificate Procedure is deleted Successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        //Get the Class list
        [HttpPost]
        public JsonResult GetClassID()
        {
            try
            {
                List<M_ClassTypeBO> lstClass = new List<M_ClassTypeBO>();
                CertificateClassBLL bll = new CertificateClassBLL();

                //get the country and state ID and VALUE 
                lstClass = bll.GetAllCertificateClassType();

                var allClass = lstClass.Select(c => new { DisplayText = c.ClassName, Value = c.ClassID });

                return Json(new { Result = "OK", Options = allClass });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
        #region AuditLog Added on 29 Dec 2015 by abu
        public void Log_M_CertificateProcedure(string primaryKey, M_CertificateProcedureBO newData, M_CertificateProcedureBO oldData, string userID, string action, string description)
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
