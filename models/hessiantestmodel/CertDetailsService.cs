using hessiancsharp.client;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Configuration;

namespace OneCRS.MVC.Models.HessianTestModel
{
    public class CertDetailsService
    {
        private bool ValidateAllCertificates(object sender, System.Security.Cryptography.X509Certificates.X509Certificate certificate,
                                    System.Security.Cryptography.X509Certificates.X509Chain chain,
                                    System.Net.Security.SslPolicyErrors sslPolicyErrors) { return true; }

        public X509Certificate getRoamingDetailsService(string UserID, string OrgID)
        {
            System.Net.ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(ValidateAllCertificates);
            NameValueCollection HessURL = WebConfigurationManager.GetWebApplicationSection("appSettings") as System.Collections.Specialized.NameValueCollection;
            CHessianProxyFactory factory = new CHessianProxyFactory();
            HessianIPService hessianIP = new HessianIPService();

            string urlEnroll = hessianIP.getEnrollmentIP();
            EnrollmentService objE = (EnrollmentService)factory.Create(typeof(EnrollmentService), urlEnroll);

            System.Collections.ArrayList Certs = objE.findCert(UserID, OrgID);
            if (Certs.Count > 0)
            {
                System.Collections.Hashtable hCert = (System.Collections.Hashtable)Certs[Certs.Count-1];
                //byte[] bCert = ObjectToByteArray(hCert["data"]);
                byte[] bCert = (byte[])hCert["data"];
                //, password
                System.Security.Cryptography.X509Certificates.X509Certificate cert = new System.Security.Cryptography.X509Certificates.X509Certificate(bCert);
                return cert;
            }
            else
            {
                return null;
            }
        }
    }
}