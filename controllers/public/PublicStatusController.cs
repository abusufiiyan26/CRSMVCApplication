using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OneCRS.MVC.Controllers.Public
{
    public class PublicStatusController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Status()
        {
            ViewBag.Date = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt");
            ViewBag.ProjectUserName = TempData["ProjectUserName"].ToString();
            ViewBag.ProjectIDNo = TempData["ProjectIDNo"].ToString();
            ViewBag.ProjectEmail = TempData["ProjectEmail"].ToString();
            ViewBag.ProjectCompany = TempData["ProjectCompany"].ToString();
            ViewBag.ProjectROC = TempData["ProjectROC"].ToString();
            ViewBag.ProjectName = TempData["ProjectName"].ToString();
            ViewBag.ProjectStatus = TempData["ProjectStatus"].ToString();
            return View();
        }

    }
}
