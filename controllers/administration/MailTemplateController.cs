using OneCRS.BLL;
using OneCRS.Common;
using OneCRS.Common.BO;
using OneCRS.MVC.Models.Administration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using OneCRS.BLL.AuditTrail;
using OneCRS.Common.Enum;

namespace OneCRS.MVC.Controllers.Administration
{
    public class MailTemplateController : Controller
    {
        //LIST OF MAIL TEMPLATE AVAILABLE
        public ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOutAdmin", "Home", new { returnUrl = path });
            }
            return View();
        }

        //SELECTED MAIL TEMPLATE
        public ActionResult Edit()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOutAdmin", "Home", new { returnUrl = path });
            }
            return View();
        }

        public ActionResult CreateNew()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOutAdmin", "Home", new { returnUrl = path });
            }
            return View();
        }

        public ActionResult Update()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOutAdmin", "Home", new { returnUrl = path });
            }
            return View();
        }

        [HttpPost]
        public JsonResult getTemplateRecords(string ValueToFind = "", string ValueSearch = "", int roleID = 0, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                jtPageSize += jtStartIndex;

                List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
                List<EmailTemplateBO> lstCount = new List<EmailTemplateBO>();
                EmailTemplateBLL bll = new EmailTemplateBLL();

                lstMail = bll.GetAllTemplate();

                string filter = "EmailTemplate_ID IS NOT NULL";

                lstCount = bll.GetMailTemplate(filter);
                lstMail = bll.GetMailTemplatePagination(filter, jtStartIndex, jtPageSize, jtSorting);

                return Json(new { Result = "OK", Records = lstMail, TotalRecordCount = lstCount.Count() });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult getTotalCount()
        {
            List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
            EmailTemplateBLL bll = new EmailTemplateBLL();

            lstMail = bll.GetAllTemplate();

            var totalRecords = lstMail.Count();

            var jsonData = new
            {
                total = totalRecords
            };
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getUpdateData(string EmailID)
        {
            List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
            EmailTemplateBLL bll = new EmailTemplateBLL();

            string sFilter = "EmailID='" + EmailID + "'";
            lstMail = bll.GetMailTemplate(sFilter);

            if (lstMail.Count > 0)
            {
                return Json(new { Result = "OK", Temp = lstMail[lstMail.Count - 1] });
            }
            else
            {
                return Json(new { Result = "ERROR", Message = "Email ID Not Found" });
            }

        }

        [HttpPost]
        public JsonResult saveEdit(UpdateTemplateModel m)
        {
            try
            {
                EmailTemplateBO logBO = new EmailTemplateBO();
                EmailTemplateBLL bll = new EmailTemplateBLL();
                EmailNotification emailreq = new EmailNotification();
                int insUpdateStatus = 0;
                string filterID = "";

                logBO.Description = m.UpdateDescription;
                logBO.Subject = m.UpdateSubjectName;
                logBO.MailContent = m.UpdateData;

                //insMailStatus = bll.InsertMailTemplate(logBO);
                filterID = "EmailID = '" + m.UpdateEmailID + "'";
                insUpdateStatus = bll.UpdateTemplate(logBO, filterID);

                if (insUpdateStatus > 0)
                {
                    return Json(new { Result = "OK", Message = "Email Template Successfully Updated" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Email Template Failed to be Updated" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult saveInsert(TemplateModel m)
        {
            try
            {
                EmailTemplateBO logBO = new EmailTemplateBO();
                EmailTemplateBLL bll = new EmailTemplateBLL();
                EmailNotification emailreq = new EmailNotification();
                int insMailStatus = 0;
                int val = 0;

                Guid guidname = System.Guid.NewGuid();
                logBO.EmailTemplate_ID = guidname;
                logBO.TemplateName = m.TemplateName;
                logBO.Description = m.Description;
                logBO.Subject = m.Subject;
                logBO.MailContent = m.Data;

                insMailStatus = bll.InsertMailTemplate(logBO);

                if (insMailStatus > 0)
                {
                    List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
                    string title = "";
                    string content = "";

                    //string filter = "EmailTemplate_ID='" + guidname + "'";
                    //lstMail = bll.GetMailTemplate(filter);

                    //title = lstMail[0].TemplateName;
                    //content = lstMail[0].MailContent;
                    //title = m.Subject;
                    //content = m.Data;

                    //List<View_CertificateRegistrationBO> lstView = new List<View_CertificateRegistrationBO>();
                    //CertVerificationBLL certbll = new CertVerificationBLL();
                    //string sFilter = "CertificateRequestID='4'";
                    //lstView = certbll.GetCertJoin(sFilter);
                    //string RoleName = "Registration Personnel (RP)";
                    //string tokenID = CryptUtils.Encrypt("" + lstView[0].Name + "");
                    //string sUrl = Url.Action("NewAccount", "Register", new { TokenID = tokenID }, Request.Url.Scheme);
                    //val = emailreq.IncomingNewRequestEmailTemplate(lstView, RoleName, "smartrider731@gmail.com", title, content, sUrl);

                    return Json(new { Result = "OK", Message = "Email Template Successfully Inserted" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Email Template Failed to be Inserted" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        #region AuditLog Added on 18 Jan 2016 by abu
        public void Log_EmailTemplate(string primaryKey, EmailTemplateBO newData, EmailTemplateBO oldData, string userID, string action, string description)
        {
            if (action == DBAction.UPDATE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, oldData, AppTableID.EmailTemplate, guid);

            }

            else if (action == DBAction.DELETE.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, null, oldData, AppTableID.EmailTemplate, guid);

            }
            else if (action == DBAction.ADD.ToString())
            {
                string guid = AppAuditLogger.LogHeader(userID, action, description);
                AppAuditLogger.LogDetails(primaryKey, newData, null, AppTableID.EmailTemplate, guid);

            }

        }
        #endregion

    }
}
