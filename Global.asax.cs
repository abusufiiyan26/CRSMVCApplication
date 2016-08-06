using OneCRS.BLL.AuditTrail;
using OneCRS.Common;
using OneCRS.Common.BO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace OneCRS.MVC
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Benchmark.Start();
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();
            Benchmark.End();
            Console.WriteLine("Time taken for Login : " + Benchmark.GetDuration());
        }
        protected void Session_End(object sender, EventArgs e)
        {
            #region Audit Added on 10 dec 2015 by abu
            Guid sGuid = System.Guid.NewGuid();
            if (Session["AuditLogID"] != null)
            {
                sGuid = (Guid)Session["AuditLogID"];
            }

            AppSysAuditTrailBO bo = new AppSysAuditTrailBO();
            bo.AuditLogID = sGuid;
            bo.LoginOutTimestamp = DateTime.Now;
            bo.ActionType = "Logout";
            AppAuditLogger.UpdateUserLogDetails(bo);
            #endregion
            //Clean-up Code
            // FormsAuthentication.SignOut();
            Session.Clear();
            Response.ExpiresAbsolute = DateTime.Now;
            Response.Expires = 0;
            Response.CacheControl = "no-cache";
            Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            Response.AppendHeader("Pragma", "no-cache"); // HTTP 1.0.
            Response.AppendHeader("Expires", "0"); // Proxies.

            Session.Abandon(); // clear the session at the end of request
            //  Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));

        }

        protected void Application_BeginRequest()
        {
            // Fires at the beginning of each request //Added by abu on 03 Mar 2016
            if(System.Configuration.ConfigurationManager.AppSettings["MaintenanceMode"] =="True")
            {
                //if(Request.IsLocal)
                //{
                    HttpContext.Current.RewritePath("Maintenance");
                //}
            }
        }
    }
}