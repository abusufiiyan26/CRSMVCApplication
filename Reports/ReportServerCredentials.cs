using System;
using System.Data;
using System.Configuration;
using System.Net;
using System.Security.Principal;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Microsoft.Reporting.WebForms;

namespace OneCRS.MVC.Reports
{

    [Serializable]
    public sealed class ReportServerCredentials :
        IReportServerCredentials
    {
        private string _userName;
        private string _password;
        private string _domain;

        public ReportServerCredentials(string userName, string password, string domain)
        {
            _userName = userName;
            _password = password;
            _domain = domain;
        }
        public System.Security.Principal.WindowsIdentity ImpersonationUser
        {
            get { return null; }
        }


        public System.Net.ICredentials NetworkCredentials
        {
            get { return new System.Net.NetworkCredential(_userName, _password, _domain); }
        }

        public bool GetFormsCredentials(out Cookie authCookie, out string userName, out string password,out string authority)
        {
            authCookie = null;
            //userName = null;
            //password = null;
            //authority = null;
            userName = _userName;
            password = _password;
            authority = _domain;
            // Not using form credentials
            return false;
        }
    }

}