using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCRS.MVC.Models;

namespace OneCRS.MVC.Controllers
{
    public class ReportController : Controller
    {
        //
        // GET: /Report/
        //User report
        public ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
       public ActionResult CertificateStatusRpt()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
        public ActionResult CertificateRegRpt()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
        //Added for Revenue Recongination
        public ActionResult RevenueRecongnitionRpt()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
        public ActionResult ExportSAPRpt()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
        public ActionResult CertificateQuotaRpt()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
        //Added on 28 Jul 2016 for Revenue and Deferement Report
        public ActionResult RevenueDefermentRpt()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }
            return View();
        }
    }
}
