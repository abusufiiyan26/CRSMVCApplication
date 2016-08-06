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
    public partial class ReportRevenueRecongnition : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {

                if (!IsPostBack)
                {
                    //'Added by abu on 21 Mar 2016
                    ddlYear.DataSource = Enumerable.Range(DateTime.Now.Year - 6, 7).Reverse();
                    ddlYear.DataBind();
                    ddlYear.Items.Insert(0, new ListItem("Select Year", "0"));
                    if (ViewState["RevenueRecongnition"] != null)
                    {
                        LoadReport();
                    }
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
                RptViewer.ServerReport.ReportPath = "/ReportOneCRS/Finance_RevenueRecongnition";
                //Passing the Report Path   

                int iDeferredMonth = 0;
                int iSelectedMonth = 0;
                int iSelectedYear = 0;
                int iCurrentYear = 0;
                int iTotalDeferredYr = 0;

                //Get Deferred Month details
                iSelectedYear = Convert.ToInt32(ddlYear.SelectedItem.Value);
                iSelectedMonth = Convert.ToInt32(ddlMonth.SelectedItem.Value);
                iCurrentYear = DateTime.Now.Year;
                if (iSelectedYear == iCurrentYear)
                {
                    iDeferredMonth = 0;
                }
                else if (iSelectedYear <= iCurrentYear)
                {
                    iTotalDeferredYr = iCurrentYear - iSelectedYear;
                    iDeferredMonth = (iTotalDeferredYr * 12) - (iSelectedMonth - 1);
                }

                //



                Microsoft.Reporting.WebForms.ReportParameter[] Params = new Microsoft.Reporting.WebForms.ReportParameter[3];
                Params[0] = new Microsoft.Reporting.WebForms.ReportParameter("Month", ddlMonth.SelectedItem.Value, Visible);
                Params[1] = new Microsoft.Reporting.WebForms.ReportParameter("Year", ddlYear.SelectedItem.Text, Visible);
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
                LblError.Visible = false;

                if (ddlMonth.SelectedIndex != 0 && ddlYear.SelectedIndex != 0)
                {

                    if (ddlYear.SelectedItem.Text == DateTime.Now.Year.ToString())
                    {
                        if (Convert.ToInt32(ddlMonth.SelectedItem.Value) > DateTime.Now.Month)
                        {
                            LblError.Visible = true;
                        }

                    }
                    
                    if (LblError.Visible == false)
                    {
                        ViewState["RevenueRecongnition"] = "True";
                        LoadReport();
                    }
                    else
                    {
                        scriptText = "alert('Month sholud not be greater than Current Month for the Current Year.Please check!');";
                        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", scriptText, true);

                       // LblError.Text = "Month sholud not be greater than Current Month for the Current Year.Please check!";
                    }
                    


                }
                else
                {
                    LblError.Visible = true;
                    LblError.Text = "* are required.";
                }


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