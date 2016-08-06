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
using OneCRS.Common;
using OneCRS.Common.BO;
using OneCRS.BLL;

namespace OneCRS.MVC.Reports
{
    public partial class ReportCertificatePackageStatus : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    Response.Redirect("/Home/Index");
                }
                if (!IsPostBack)
                {
                    BindProject();
                    if (ViewState["CertificateStatus"] != null)
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
                RptViewer.ServerReport.ReportPath = "/ReportOneCRS/CertificatePackageQuotaStatus";
                //Passing the Report Path   

                string sFromDate = string.Empty;
                string SToDate = string.Empty;

                if (!string.IsNullOrEmpty(txtFromDate.Text))
                    sFromDate = Convert.ToDateTime(txtFromDate.Text).ToString("yyyy-MM-dd");
                if (!string.IsNullOrEmpty(txtToDate.Text))
                    SToDate = Convert.ToDateTime(txtToDate.Text).ToString("yyyy-MM-dd");
                SToDate = SToDate + " 23:59:59";
                sFromDate = sFromDate + " 00:00:00";

                Microsoft.Reporting.WebForms.ReportParameter[] Params = new Microsoft.Reporting.WebForms.ReportParameter[4];
                Params[0] = new Microsoft.Reporting.WebForms.ReportParameter("ProjectID", ddlProject.SelectedItem.Value, Visible);
                Params[1] = new Microsoft.Reporting.WebForms.ReportParameter("ProjectName", ddlProject.SelectedItem.Text, Visible);
                Params[2] = new Microsoft.Reporting.WebForms.ReportParameter("FromDate", sFromDate, Visible);
                Params[3] = new Microsoft.Reporting.WebForms.ReportParameter("ToDate", SToDate, Visible);


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

                if (txtFromDate.Text != string.Empty && txtToDate.Text != string.Empty && ddlProject.SelectedIndex != 0)
                {
                    string sRetString = string.Empty;
                    sRetString = Common.Common1.CompareStartEndDate(txtFromDate.Text, txtToDate.Text);
                    if (string.IsNullOrEmpty(sRetString))
                    {
                        ViewState["CertificateStatus"] = "True";
                        LoadReport();
                    }
                    else
                    {
                        scriptText = "alert('" + sRetString + "');";
                        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", scriptText, true);

                    }

                }
                else
                {
                    LblError.Visible = true;
                    LblError.Text = "* All fields are required.";
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

        private void BindProject()
        {
            try
            {
                if (ddlProject.Items.Count > 0)
                {
                    ddlProject.Items.Clear();
                }
                List<M_ProjectBO> lstProject = new List<M_ProjectBO>();
                ProjectBLL bll = new ProjectBLL();
                //get the list of Project 

                List<RolesBO> lstRoles = new List<RolesBO>();
                lstRoles = bll.GetRoleType(Session["RoleID"].ToString());
                string sRoleType = string.Empty;
                if (lstRoles.Count > 0)
                {
                    sRoleType = lstRoles[0].RoleType.ToLower();
                }
                if (Session["RoleID"].ToString() == "3" || sRoleType == "external")
                {
                    string sFilter = "ProjectID='" + Session["ProjectID"].ToString() + "'";
                    lstProject = bll.GetProjectByID(sFilter);
                }
                else
                {
                    lstProject = bll.GetAllProject();
                }
                var allDepartment = lstProject.Select(c => new { DisplayText = c.ProjectName.ToUpper(), Value = c.ProjectId });


                ddlProject.DataValueField = "Value";
                ddlProject.DataTextField = "DisplayText";
                ddlProject.DataSource = allDepartment;
                ddlProject.DataBind();
                ddlProject.Items.Insert(0, new ListItem("Select", "0"));

            }
            catch (Exception ex)
            {
            }
        }
    }
}