using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using OneCRS.MVC.Models;
using System.Text;
using Microsoft.Reporting.WebForms;
using System.Data;
using System.Configuration;
using System.Collections;

namespace OneCRS.MVC.Reports
{
    public partial class ReportRevenueRecongnitionDeferment : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {

                if (!IsPostBack)
                {


                    LoadReport();

                }
            }
            catch (Exception ex)
            {

            }
        }

        protected void LoadReport()
        {

            try
            {
                string urlReportServer = ConfigurationManager.AppSettings["SSRSBaseUrl"].ToString();
                string UserNameReportServer = ConfigurationManager.AppSettings["SSRSUserName"].ToString();
                string PwdReportServer = ConfigurationManager.AppSettings["SSRSPWD"].ToString();
                string DomainReportServer = ConfigurationManager.AppSettings["SSRSDomin"].ToString();

                RptViewer.ProcessingMode = ProcessingMode.Remote;
                // ProcessingMode will be Either Remote or Local
                RptViewer.ServerReport.ReportServerUrl = new Uri(urlReportServer);
                //Set the ReportServer Url
                RptViewer.ServerReport.ReportPath = "/ReportOneCRS/Finance_RevenueRecongnitionDeferment";
                //Passing the Report Path   

                int iDeferredMonth = 0;
                int iSelectedMonth = 0;
                int iSelectedYear = 0;
                int iCurrentYear = 0;


                //Get Deferred Month details
                iSelectedYear = DateTime.Now.Year;// Convert.ToInt32(ddlYear.SelectedItem.Value);
                iSelectedMonth = DateTime.Now.Month;// Convert.ToInt32(ddlMonth.SelectedItem.Value);
                iCurrentYear = DateTime.Now.Year;




                Microsoft.Reporting.WebForms.ReportParameter[] Params = new Microsoft.Reporting.WebForms.ReportParameter[3];
                Params[0] = new Microsoft.Reporting.WebForms.ReportParameter("Month", iSelectedMonth.ToString(), Visible);
                Params[1] = new Microsoft.Reporting.WebForms.ReportParameter("Year", iSelectedYear.ToString(), Visible);
                Params[2] = new Microsoft.Reporting.WebForms.ReportParameter("DeferredMonth", iDeferredMonth.ToString(), Visible);

                // pass crendentitilas
                RptViewer.ServerReport.ReportServerCredentials = new ReportServerCredentials(UserNameReportServer, PwdReportServer, DomainReportServer);
                //'"report", "123456", "sonicmaster")

                //pass parmeters to report
                RptViewer.ServerReport.SetParameters(Params);
                //Set Report Parameters
                RptViewer.ServerReport.Refresh();

            }
            catch (Exception ex)
            {
            }

        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            string scriptText = string.Empty;
            try
            {

                ViewState["RevenueRecongnitionDeferment"] = "True";
                LoadReport();



            }
            catch (Exception ex)
            {
                scriptText = "alert('" + ex.Message.ToString() + "');";
                ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", scriptText, true);

            }

        }


        private ArrayList ReportDefaultPatam()
        {
            ArrayList arrLstDefaultParam = new ArrayList();
            arrLstDefaultParam.Add(CreateReportParameter("ReportTitle", "Title of Report"));
            arrLstDefaultParam.Add(CreateReportParameter("ReportSubTitle", "Sub Title of Report"));
            return arrLstDefaultParam;
        }

        private ReportParameter CreateReportParameter(string paramName, string pramValue)
        {
            ReportParameter aParam = new ReportParameter(paramName, pramValue);
            return aParam;
        }

    }
}