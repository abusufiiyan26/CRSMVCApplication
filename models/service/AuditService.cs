using OneCRS.BLL.AuditTrail;
using OneCRS.Common;
using OneCRS.Common.BO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Service
{
    public class AuditService
    {
        public int AuditTrail(List<View_CertificateRegistrationBO> lstView, int UserID, int ProjectID, string ActionType,
                                string Module, string Description, HttpBrowserCapabilitiesBase bc, string auditSession)
        {
            AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
            int ret = 0;

            try
            {
                string BrowserType = bc.Browser + " (" + bc.Version + ")";
                bo.AuditLogID = System.Guid.NewGuid();
                bo.LoginTimestamp = DateTime.Now;
                bo.UserID = UserID;
                bo.ProjectID = ProjectID;
                bo.ActionType = ActionType;
                bo.SessionID = auditSession;
                bo.BrowserType = BrowserType;
                bo.Module = Module;
                bo.Description = Description;
                ret = AppAuditLogger.AddUserLogDetails(bo);
            }
            catch (Exception ex)
            {
                //AppEntLogger.WritePerfLog(ex.ToString(), "ERROR");
                ret = 0;
            }
            return ret;
        }
    }
}