using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCRS.BLL;
using OneCRS.Common.BO;
using OneCRS.Common;
using OneCRS.MVC.Models;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using InfoSoftGlobal;
using System.Data.SqlClient;

namespace OneCRS.MVC.Controllers
{
    public class DashboardController : Controller
    {
        #region Chart declaration added by abu
        ReportsBLL bll = new ReportsBLL();
        string X, Y;
        string GraphWidth = "450";
        string GraphHeight = "420";
        string[] color = new string[36];
        #endregion

        #region Menu List
        [ChildActionOnly]
        public ActionResult HeaderMenu()
        {
            //Menu
            MenuModel ObjMenuModel = new MenuModel();
            ObjMenuModel.MainMenuModel = new List<MainMenu>();
            ObjMenuModel.MainMenuModel = GetMainMenu();
            ObjMenuModel.SubMenuModel = new List<SubMenu>();
            ObjMenuModel.SubMenuModel = GetSubMenu();
            ObjMenuModel.SubSubMenuModel = new List<SubSubMenu>();
            ObjMenuModel.SubSubMenuModel = GetSubSubMenu();
            ObjMenuModel.Sub3MenuModel = new List<Sub3Menu>();
            ObjMenuModel.Sub3MenuModel = GetSubSubSubMenu();
            return View("~/Views/Shared/_MenuPartial.cshtml", ObjMenuModel);
        }

        public List<MainMenu> GetMainMenu()
        {
            List<MainMenu> ObjMainMenu = new List<MainMenu>();
            List<MenuBO> menudb = new List<MenuBO>();
            List<View_MenuWithRolePriviledgesBO> menudb1 = new List<View_MenuWithRolePriviledgesBO>();
            MenuBLL BLLMainMenu = new MenuBLL();
            int RoleGrpID = 0;
            int RoleID = 0;
            string sFilter = string.Empty;
            if (Session["RoleID"] != null)
            {
                RoleID = Convert.ToInt32(Session["RoleID"].ToString());
            }
            RoleGrpID = BLLMainMenu.GetUserGrpID(RoleID);
            sFilter = "MenuparentID is null and RoleGrpID='" + RoleGrpID + "'";
            menudb1 = BLLMainMenu.GetMenuViewList(sFilter);

            //menudb = BLLMainMenu.GetMenuList("MenuparentID is null");


            foreach (View_MenuWithRolePriviledgesBO bo in menudb1)
            {
                ObjMainMenu.Add(new MainMenu { ID = bo.menu_id, MainMenuItem = bo.Menuname, MainMenuURL = bo.Menu_URL });
            }
            //ObjMainMenu.Add(new MainMenu { ID = 1, MainMenuItem = "Production", MainMenuURL = "http://www.google.com" });
            //ObjMainMenu.Add(new MainMenu { ID = 2, MainMenuItem = "Sales", MainMenuURL = "#" });
            //ObjMainMenu.Add(new MainMenu { ID = 3, MainMenuItem = "Admin", MainMenuURL = "#" });
            //ObjMainMenu.Add(new MainMenu { ID = 4, MainMenuItem = "Finance", MainMenuURL = "#" });
            //ObjMainMenu.Add(new MainMenu { ID = 5, MainMenuItem = "Reports", MainMenuURL = "#" });
            return ObjMainMenu;
        }
        public List<SubMenu> GetSubMenu()
        {
            List<SubMenu> ObjSubMenu = new List<SubMenu>();
            List<MenuBO> menudb = new List<MenuBO>();
            MenuBLL BLLSubMenu = new MenuBLL();
            List<View_MenuWithRolePriviledgesBO> menudb1 = new List<View_MenuWithRolePriviledgesBO>();
            int RoleGrpID = 0;
            int RoleID = 0;
            string sFilter = string.Empty;
            if (Session["RoleID"] != null)
            {
                RoleID = Convert.ToInt32(Session["RoleID"].ToString());
            }
            RoleGrpID = BLLSubMenu.GetUserGrpID(RoleID);
            sFilter = "MenuparentID is not null and SubMenuParentID is null and RoleGrpID='" + RoleGrpID + "'";
            menudb1 = BLLSubMenu.GetMenuViewList(sFilter);
            // menudb = BLLSubMenu.GetMenuList("MenuparentID is not null");
            foreach (View_MenuWithRolePriviledgesBO bo in menudb1)
            {
                ObjSubMenu.Add(new SubMenu { MainMenuID = bo.MenuparentID.GetValueOrDefault(), SubMenuItem = bo.Menuname, SubMenuURL = bo.Menu_URL, MenuID = bo.menu_id });
            }
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 1, SubMenuItem = "Certificate", SubMenuURL = "#" });
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 1, SubMenuItem = "Renewal", SubMenuURL = "#" });
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 2, SubMenuItem = "Manage Project", SubMenuURL = "#" });
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 2, SubMenuItem = "Manage Package", SubMenuURL = "#" });
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 3, SubMenuItem = "Manage User", SubMenuURL = "#" });
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 3, SubMenuItem = "Manage Team", SubMenuURL = "#" });
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 4, SubMenuItem = "Export SAP", SubMenuURL = "#" });
            //ObjSubMenu.Add(new SubMenu { MainMenuID = 4, SubMenuItem = "Generate Invoice", SubMenuURL = "#" });
            return ObjSubMenu;
        }

        public List<SubSubMenu> GetSubSubMenu()
        {
            List<SubSubMenu> ObjSubSubMenu = new List<SubSubMenu>();
            List<MenuBO> menudb = new List<MenuBO>();
            MenuBLL BLLSubSubMenu = new MenuBLL();
            List<View_MenuWithRolePriviledgesBO> menudb1 = new List<View_MenuWithRolePriviledgesBO>();
            int RoleGrpID = 0;
            int RoleID = 0;
            string sFilter = string.Empty;
            if (Session["RoleID"] != null)
            {
                RoleID = Convert.ToInt32(Session["RoleID"].ToString());
            }
            RoleGrpID = BLLSubSubMenu.GetUserGrpID(RoleID);
            sFilter = "Menu_ID in (select Menu_ID from dbo.Menu where MenuparentID is not null and (ModuleSeqNo is not null and SubMenuParentID is not null)) and RoleGrpID='" + RoleGrpID + "'";
            // sFilter = "SubMenuParentID in (select Menu_ID from dbo.Menu where MenuparentID is not null) and RoleGrpID='" + RoleGrpID + "'";
            menudb1 = BLLSubSubMenu.GetMenuViewList(sFilter);
            foreach (View_MenuWithRolePriviledgesBO bo in menudb1)
            {
                ObjSubSubMenu.Add(new SubSubMenu { MainMenuID = bo.SubMenuParentID.GetValueOrDefault(), SubSubMenuItem = bo.Menuname, SubSubMenuURL = bo.Menu_URL, MenuID = bo.menu_id });
            }

            return ObjSubSubMenu;
        }

        public List<Sub3Menu> GetSubSubSubMenu()
        {
            List<Sub3Menu> ObjSub3Menu = new List<Sub3Menu>();
            List<MenuBO> menudb = new List<MenuBO>();
            MenuBLL BLLSubSubMenu = new MenuBLL();
            List<View_MenuWithRolePriviledgesBO> menudb1 = new List<View_MenuWithRolePriviledgesBO>();
            int RoleGrpID = 0;
            int RoleID = 0;
            string sFilter = string.Empty;
            if (Session["RoleID"] != null)
            {
                RoleID = Convert.ToInt32(Session["RoleID"].ToString());
            }
            RoleGrpID = BLLSubSubMenu.GetUserGrpID(RoleID);
            sFilter = "SubMenuParentID in (select Menu_ID from dbo.Menu where MenuparentID is not null and (ModuleSeqNo is not null and SubMenuParentID is not null)) and RoleGrpID='" + RoleGrpID + "'";
            // sFilter = "SubMenuParentID in (select Menu_ID from dbo.Menu where MenuparentID is not null) and RoleGrpID='" + RoleGrpID + "'";
            menudb1 = BLLSubSubMenu.GetMenuViewList(sFilter);
            foreach (View_MenuWithRolePriviledgesBO bo in menudb1)
            {
                ObjSub3Menu.Add(new Sub3Menu { MainMenuID = bo.SubMenuParentID.GetValueOrDefault(), Sub3MenuItem = bo.Menuname, Sub3MenuURL = bo.Menu_URL });
            }

            return ObjSub3Menu;
        }
        #endregion

        public ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }

            if (Session["RoleID"].ToString() == "3")
            {
                return RedirectToAction("AP", "Dashboard");
            }
            if (Session["RoleID"].ToString() != "2")
            {
                return RedirectToAction("Admin", "Dashboard");
            }

            //COUNT TOTAL NO OF PENDING VERIFICATION
            List<View_CertificateRegistrationBO> lstNewTotal = new List<View_CertificateRegistrationBO>();
            List<View_CertificateRegistrationBO> lstPayment = new List<View_CertificateRegistrationBO>();
            CertVerificationBLL certbll = new CertVerificationBLL();
            string filterProNewID = "User_ID='" + Session["UserID"].ToString() + "'";
            lstNewTotal = certbll.GetCertJoin(filterProNewID);

            string filter = "User_ID='" + Session["UserID"].ToString() + "' AND StatusID='17'";
            lstPayment = certbll.GetCertJoin(filter);

            ViewBag.PendingView = lstNewTotal.Count();
            ViewBag.PendingPayment = lstPayment.Count();
            //added on 5 aug 2016 .. for fusion chart for changi travels pte ltd
            ConfigureColors();
            CreateDoughnutGraph(DateTime.Now.Year);
            CreateBarGraph(DateTime.Now.Month, DateTime.Now.Year);
            return View();
        }

        public ActionResult Agent()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }

            return View();
        }

        public ActionResult AP()
        {
            if (Session["UserID"] == null)
            {
                string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                return RedirectToAction("LogOut", "Home", new { returnUrl = path });
            }

            if (Session["RoleID"].ToString() == "2")
            {
                return RedirectToAction("Index", "Dashboard");
            }
            if (Session["RoleID"].ToString() != "3")
            {
                return RedirectToAction("Admin", "Dashboard");
            }

            //COUNT TOTAL NO OF PENDING VERIFICATION
            List<View_CertificateRegistrationBO> lstNewTotal = new List<View_CertificateRegistrationBO>();
            List<View_CertificateRegistrationBO> lstRenewTotal = new List<View_CertificateRegistrationBO>();
            CertVerificationBLL certbll = new CertVerificationBLL();
            string filterProNewID = "Project_Id='" + Session["ProjectID"].ToString() + "' AND StatusID='1' AND V_IsAP='1'";
            lstNewTotal = certbll.GetCertJoin(filterProNewID);

            string filterProRenewID = "Project_Id='" + Session["ProjectID"].ToString() + "' AND StatusID='2' AND V_IsAP='1'";
            lstRenewTotal = certbll.GetCertJoin(filterProRenewID);

            ViewBag.PendingNewCount = lstNewTotal.Count();
            ViewBag.PendingRenewCount = lstRenewTotal.Count();

            return View();
        }

        public ActionResult Admin(int iYear = 0, int iMonth = 0)
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    string path = HttpContext.Request.Url.AbsolutePath + HttpContext.Request.Url.Query;
                    return RedirectToAction("LogOut", "Home", new { returnUrl = path });
                }
                if (Session["RoleID"] != null)
                {
                    //Role id 1 is super admin and 6 is production admin
                    if (Session["RoleID"].ToString() != "1" && Session["RoleID"].ToString() != "6")
                    {
                        ViewBag.Reset = "hidden";
                    }
                    else
                    {
                        LoadYear();
                        LoadMonth();
                        ConfigureColors();
                        CreateDoughnutGraph(iYear);
                        CreateBarGraph(iMonth, iYear);
                    }

                    //REGION FOR RO DASHBOARD
                    List<RolesBO> lstRole = new List<RolesBO>();
                    UserRoleAccessBLL rolebll = new UserRoleAccessBLL();
                    string sFilter = "RoleID='" + Session["RoleID"].ToString() + "'";
                    lstRole = rolebll.GetAllUserswithRoleName(sFilter);

                    if (lstRole.Count > 0)
                    {
                        ViewBag.Department = lstRole[0].RoleName;
                        if (Session["RoleID"].ToString() == "4")
                        {
                            List<View_CertificateRegistrationBO> lstView = new List<View_CertificateRegistrationBO>();
                            CertVerificationBLL certbll = new CertVerificationBLL();

                            //Total Count of Pending RO Approval
                            string filterProID = "Role_ID='2'";
                            filterProID = filterProID + " AND (StatusID='1' OR StatusID='2')";
                            filterProID = filterProID + " AND ((V_IsRP='1' AND MediaID='1')";
                            filterProID = filterProID + " OR (Token_V_IsRP='1' AND MediaID='2')";
                            filterProID = filterProID + " OR (Soft_V_IsRP='1' AND MediaID='3')";
                            filterProID = filterProID + " OR (Smart_V_IsRP='1' AND MediaID='4')";
                            filterProID = filterProID + " OR (Server_V_IsRP='1' AND MediaID='5'))";
                            lstView = certbll.GetCertJoin(filterProID);
                            ViewBag.PendingRPVerification = lstView.Count;

                            //Total Count of Pending AP Request Approval
                            List<View_SalesPOBO> lstAll = new List<View_SalesPOBO>();
                            PurchaseOrderBLL poBll = new PurchaseOrderBLL();
                            string PendingWorkOrder = "((PO_TotalQuantity+PO_DetailsQuantity) - (PO_OutPKI+PO_OutSSL) != 0)";
                            lstAll = poBll.GetSalesPOWithFilter(PendingWorkOrder);
                            ViewBag.PendingWorkOrder = lstAll.Count;

                            //Total Count of Pending Revocation Approval
                            string CompleteWorkOrder = "((PO_TotalQuantity+PO_DetailsQuantity) - (PO_OutPKI+PO_OutSSL) = 0)";
                            lstAll = poBll.GetSalesPOWithFilter(CompleteWorkOrder);
                            ViewBag.CompleteWorkOrder = lstAll.Count;

                            //Total Count of Complete 
                            filterProID = "AP_Verified='Y' AND isAdmin IS NULL";
                            filterProID = filterProID + " AND ((V_IsRP='1' AND MediaID='1')";
                            filterProID = filterProID + " OR (Token_V_IsRP='1' AND MediaID='2')";
                            filterProID = filterProID + " OR (Soft_V_IsRP='1' AND MediaID='3')";
                            filterProID = filterProID + " OR (Smart_V_IsRP='1' AND MediaID='4')";
                            filterProID = filterProID + " OR (Server_V_IsRP='1' AND MediaID='5'))";
                            lstView = certbll.GetCertJoin(filterProID);
                            ViewBag.RPTotalApproved = lstView.Count;
                        }
                        else if (Session["RoleID"].ToString() == "5")
                        {
                            List<View_CertificateRegistrationBO> lstView = new List<View_CertificateRegistrationBO>();
                            CertVerificationBLL certbll = new CertVerificationBLL();
                            
                            //Total Count of Pending RO Approval
                            string pendingROApproval = "(StatusID = '3' OR StatusID = '4') AND Role_ID='2'";
                            lstView = certbll.GetCertJoin(pendingROApproval);
                            ViewBag.PendingROApproval = lstView.Count;

                            //Total Count of Pending AP Request Approval
                            string pendingAPRequestApproval = "(StatusID='18' OR StatusID='19')";
                            lstView = certbll.GetCertJoin(pendingAPRequestApproval);
                            ViewBag.PendingAPApproval = lstView.Count;

                            //Total Count of Pending Revocation Approval
                            string pendingRevocationApproval = "StatusID = '13' AND isAdmin IS NULL";
                            lstView = certbll.GetCertJoin(pendingRevocationApproval);
                            ViewBag.PendingRevokeApproval = lstView.Count;

                            //Total Count of Pending Revocation Approval
                            string totalApproved = "RO_Approved='Y' AND isAdmin IS NULL";
                            lstView = certbll.GetCertJoin(totalApproved);
                            ViewBag.TotalApproved = lstView.Count;
                        }
                        else if (Session["RoleID"].ToString() == "7")
                        {
                            //Get Count for Pending Customer Code
                            List<View_ProjectUserOrganisationBO> lstCustomer = new List<View_ProjectUserOrganisationBO>();
                            UserBLL bll = new UserBLL();
                            string filterCustID = "Type IS NOT NULL AND CustomerCode IS NULL";
                            lstCustomer = bll.GetUserProjectOrg(filterCustID);
                            ViewBag.CustomerCode = lstCustomer.Count;

                            //Get Count for Pending GL Code
                            List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
                            ProjectBLL ProBLL = new ProjectBLL();
                            string filterProID = "GLCode IS NULL";
                            lstProject = ProBLL.GetProjectCount(filterProID);
                            ViewBag.GLCode = lstProject.Count;

                            //Get Count for Pending Credit Invoice (PO)
                            List<View_PaymentCreditBO> lstPaymentPO = new List<View_PaymentCreditBO>();
                            List<View_PaymentCreditBO> lstPaymentCP = new List<View_PaymentCreditBO>();
                            PaymentBLL paybll = new PaymentBLL();
                            string filterPayCreditPOID = "PaymentType='2' AND ActiveStatus='1' AND DisplayStatus='1' AND EmailStatus='0' AND PO_Number != 0";
                            filterPayCreditPOID += " GROUP BY InvoiceNo, PO_Number, PaymentType, ProjectID, ProjectName, ModeName, CustomerID, CompanyName, PO_No, ProjectPO_Number, ContractNo";
                            lstPaymentPO = paybll.GetNewCreditPaymentGroup(filterPayCreditPOID);
                            ViewBag.CreditPOInvoice = lstPaymentPO.Count;

                            //Get Count for Pending Credit Invoice (Contract & Project PO) - 2 Weeks Invoice
                            string filterPayCreditCPID = "PaymentType='2' AND ActiveStatus='1' AND DisplayStatus='1' AND EmailStatus='0' AND PO_Number == 0";
                            filterPayCreditCPID += filterPayCreditCPID + " GROUP BY InvoiceNo, PO_Number, PaymentType, ProjectID, ProjectName, ModeName, CustomerID, CompanyName, PO_No, ProjectPO_Number, ContractNo";
                            lstPaymentCP = paybll.GetNewCreditPaymentGroup(filterPayCreditCPID);
                            ViewBag.CreditCPInvoice = lstPaymentCP.Count;
                        }
                        else if (Session["RoleID"].ToString() == "15")
                        {
                            //Get Count for Pending Customer Code
                            List<View_ProjectUserOrganisationBO> lstCustomer = new List<View_ProjectUserOrganisationBO>();
                            UserBLL bll = new UserBLL();
                            string filterCustID = "Type IS NOT NULL AND CustomerCode IS NULL";
                            lstCustomer = bll.GetUserProjectOrg(filterCustID);
                            ViewBag.CustomerCode = lstCustomer.Count;

                            //Get Count for Pending Profit Center
                            List<View_PackageProjectDetailsBO> lstPackage = new List<View_PackageProjectDetailsBO>();
                            PackageProcedureBLL packBll = new PackageProcedureBLL();
                            string filterPackID = "ProfitCenter IS NULL";
                            lstPackage = packBll.GetAllPackagefilter(filterPackID);
                            ViewBag.ProfitCenter = lstPackage.Count;

                            //Get Count for Pending GL Code
                            List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
                            ProjectBLL ProBLL = new ProjectBLL();
                            string filterProID = "GLCode IS NULL";
                            lstProject = ProBLL.GetProjectCount(filterProID);
                            ViewBag.GLCode = lstProject.Count;

                            //Get Count for Pending Credit Invoice
                            List<View_PaymentCreditBO> lstPayment = new List<View_PaymentCreditBO>();
                            PaymentBLL paybll = new PaymentBLL();
                            string filterPayID = "PaymentType='2' AND ActiveStatus='1' AND DisplayStatus='1' AND EmailStatus='0'";
                            lstPayment = paybll.GetNewCreditPaymentFilter(filterPayID);
                            ViewBag.CreditInvoice = lstPayment.Count;
                        }
                    }

                }
                if (Session["ActiveRequestID"] != null)
                {
                    List<View_CertificateRegistrationBO> lstActiveCert = new List<View_CertificateRegistrationBO>();
                    CertVerificationBLL certbll = new CertVerificationBLL();

                    string sActiveFilter = "CertificateRequestID='" + Session["ActiveRequestID"].ToString() + "'";
                    lstActiveCert = certbll.GetCertJoin(sActiveFilter);

                    if (lstActiveCert.Count > 0)
                    {
                        int MAX = lstActiveCert.Count - 1;
                        double DaysRemaining = (Convert.ToDateTime(lstActiveCert[MAX].CertificateValidTo) - DateTime.Now).TotalDays;
                        ViewBag.CertValidity = Convert.ToInt32(DaysRemaining);
                    }
                }
            }
            catch (Exception ex)
            {
            }

            return View();
        }

        //Added for chart dashboard
        #region Admin chart
        private void CreateDoughnutGraph(int iYear)
        {
            string strCaption = "Year Wise";
            string strSubCaption = string.Empty;// "For the year " + DateTime.Now.Year;
            List<View_PublicDashBoardChartYrBO> boChartYr = new List<View_PublicDashBoardChartYrBO>();


            if (iYear != 0)
            {
                strSubCaption = "For the year " + iYear;
                boChartYr = bll.PAdminChartYrSelectAll(iYear);
            }
            else if (iYear == 0)
            {
                strSubCaption = "For the year " + DateTime.Now.Year;
                boChartYr = bll.PAdminChartYrSelectAll(DateTime.Now.Year);
            }

            string xAxis = "RoleName";
            string yAxis = "UserID";

            //strXML will be used to store the entire XML document generated
            string strXML = null;

            //Generate the graph element
            strXML = @"<graph caption='" + strCaption + @"' subCaption='" + strSubCaption + @"' decimalPrecision='0' 
                          pieSliceDepth='30' formatNumberScale='0'
                          xAxisName='" + xAxis + @"' yAxisName='" + yAxis + @"' rotateNames='1'
                    >";

            int i = 0;
            // get values


            foreach (View_PublicDashBoardChartYrBO dr2 in boChartYr)
            {
                strXML += "<set name='" + dr2.RoleName.ToString() + "' value='" + dr2.UserID.ToString() + "' color='" + color[i] + @"'  link=&quot;JavaScript:myJS('" + dr2.RoleName.ToString() + ", " + dr2.UserID.ToString() + "'); &quot;/>";
                i++;
            }
            //foreach (DataRow dr2 in dt.Rows)
            //{
            //    strXML += "<set name='" + dr2[0].ToString() + "' value='" + dr2[1].ToString() + "' color='" + color[i] + @"'  link=&quot;JavaScript:myJS('" + dr2["Month"].ToString() + ", " + dr2["Qnty"].ToString() + "'); &quot;/>";
            //    i++;
            //}

            //Finally, close <graph> element
            strXML += "</graph>";

            ViewBag.FCLiteral1 = FusionCharts.RenderChartHTML(
                "../FusionCharts/FCF_Doughnut2D.swf", // Path to chart's SWF
                "",                              // Leave blank when using Data String method
                strXML,                          // xmlStr contains the chart data
                "mygraph1",                      // Unique chart ID
                GraphWidth, GraphHeight,                   // Width & Height of chart
                false
                );
        }
        private void CreateBarGraph(int iMonth, int iYear)
        {
            string strCaption = "Month Wise Issued";
            string strSubCaption = string.Empty;// "For the Month " + DateTime.Now.ToString("MMMM") + " Year: " + DateTime.Now.Year;
            List<View_PublicDashBoardChartMonthBO> boChartMonth = new List<View_PublicDashBoardChartMonthBO>();
            string sFilter = string.Empty;

            if (iMonth != 0 && iYear != 0)
            {
                string sMonthnames = "|JAN|FEB|MAR|APR|MAY|JUN|JULY|AUG|SEP|OCT|NOV|DEC|";
                string[] aMonthNames;
                aMonthNames = sMonthnames.Split('|');
                strSubCaption = "For the Month " + aMonthNames[iMonth] + " Year: " + iYear;
                boChartMonth = bll.PAdminChartMonthSelectAll(iMonth, iYear);
            }
            else if (iMonth == 0 && iYear == 0)
            {
                strSubCaption = "For the Month " + DateTime.Now.ToString("MMMM") + " Year: " + DateTime.Now.Year;
                int iCurrentMonth = 0;
                iCurrentMonth = DateTime.Now.Month;

                boChartMonth = bll.PAdminChartMonthSelectAll(iCurrentMonth, DateTime.Now.Year);
            }

            string xAxis = "Role Name";
            string yAxis = "UserID";

            //strXML will be used to store the entire XML document generated
            string strXML = null;

            //Generate the graph element
            strXML = @"<graph caption='" + strCaption + @"' subCaption='" + strSubCaption + @"' decimalPrecision='0' 
                          pieSliceDepth='30' formatNumberScale='0'
                          xAxisName='" + xAxis + @"' yAxisName='" + yAxis + @"' rotateNames='1'
                    >";

            int i = 0;


            foreach (View_PublicDashBoardChartMonthBO dr2 in boChartMonth)
            {
                strXML += "<set name='" + dr2.RoleName.ToString() + "' value='" + dr2.UserID.ToString() + "' color='" + color[i] + @"'  link=&quot;JavaScript:myJS('" + dr2.RoleName.ToString() + ", " + dr2.UserID.ToString() + "'); &quot;/>";
                i++;
            }
            //foreach (DataRow dr2 in dt.Rows)
            //{
            //    strXML += "<set name='" + dr2[0].ToString() + "' value='" + dr2[1].ToString() + "' color='" + color[i] + @"'  link=&quot;JavaScript:myJS('" + dr2["Month"].ToString() + ", " + dr2["Qnty"].ToString() + "'); &quot;/>";
            //    i++;
            //}

            //Finally, close <graph> element
            strXML += "</graph>";

            ViewBag.FCLiteral2 = FusionCharts.RenderChartHTML(
                "../FusionCharts/FCF_Column3D.swf", // Path to chart's SWF
                "",                              // Leave blank when using Data String method
                strXML,                          // xmlStr contains the chart data
                "mygraph1",                      // Unique chart ID
                GraphWidth, GraphHeight,                   // Width & Height of chart
                false
                );
        }

        private void ConfigureColors()
        {
            color[0] = "F6BD0F";
            color[1] = "AFD8F8";
            color[2] = "8BBA00";
            color[3] = "FF8E46";
            color[4] = "008E8E";
            color[5] = "D64646";
            color[6] = "8E468E";
            color[7] = "588526";
            color[8] = "B3AA00";
            color[9] = "008ED6";
            color[10] = "9D080D";
            color[11] = "A186BE";
            color[12] = "330000";
            color[13] = "000000";
            color[15] = "000033";
            color[16] = "000066";
            color[17] = "003300";
            color[18] = "003333";
            color[19] = "330033";
            color[20] = "333300";
            color[21] = "33cc00";
            color[22] = "663366";
            color[23] = "663300";
            color[24] = "B22222";
            color[25] = "FF00FF";
            color[26] = "DAA520";
            color[27] = "F0E68C";
            color[28] = "FF69B4";
            color[29] = "CD5C5C";
            color[30] = "4B0082";
            color[31] = "BA55D3";
            color[32] = "9370DB";
            color[33] = "3CB371";
            color[34] = "7B68EE";
            color[35] = "00FA9A";

        }

        public void LoadMonth()
        {
            List<SelectListItem> li = new List<SelectListItem>();
            li.Add(new SelectListItem { Text = "Select", Value = "0" });
            li.Add(new SelectListItem { Text = "JAN", Value = "1" });
            li.Add(new SelectListItem { Text = "FEB", Value = "2" });
            li.Add(new SelectListItem { Text = "MAR", Value = "3" });
            li.Add(new SelectListItem { Text = "APR", Value = "4" });
            li.Add(new SelectListItem { Text = "MAY", Value = "5" });
            li.Add(new SelectListItem { Text = "JUNE", Value = "6" });
            li.Add(new SelectListItem { Text = "JUL", Value = "7" });
            li.Add(new SelectListItem { Text = "AUG", Value = "8" });
            li.Add(new SelectListItem { Text = "SEP", Value = "9" });
            li.Add(new SelectListItem { Text = "OCT", Value = "10" });
            li.Add(new SelectListItem { Text = "NOV", Value = "11" });
            li.Add(new SelectListItem { Text = "DEC", Value = "12" });
            ViewData["Months"] = li;

        }
        public void LoadYear()
        {
            try
            {
                List<View_AdminDashBoardChartYrBO> boChartYears = new List<View_AdminDashBoardChartYrBO>();
                boChartYears = bll.AdminChartListOfYear();
                List<SelectListItem> li = new List<SelectListItem>();
                foreach (View_AdminDashBoardChartYrBO drYear in boChartYears)
                {
                    li.Add(new SelectListItem { Text = drYear.Year.ToString(), Value = drYear.Year.ToString() });
                }
                ViewData["Years"] = li;
            }
            catch
            {

            }
            //List<SelectListItem> li = new List<SelectListItem>();
            //li.Add(new SelectListItem { Text = "Select", Value = "0" });
            //li.Add(new SelectListItem { Text = "2016", Value = "2016" });
            //li.Add(new SelectListItem { Text = "2015", Value = "2015" });
            //li.Add(new SelectListItem { Text = "2014", Value = "2014" });
            //li.Add(new SelectListItem { Text = "2013", Value = "2013" });


        }
        #endregion
    }
}
