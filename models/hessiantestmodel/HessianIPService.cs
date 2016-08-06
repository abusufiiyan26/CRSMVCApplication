using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace OneCRS.MVC.Models.HessianTestModel
{
    public class HessianIPService
    {
        NameValueCollection HessURL = WebConfigurationManager.GetWebApplicationSection("appSettings") as System.Collections.Specialized.NameValueCollection;

        public string getCAIP()
        {
            string urlCA = HessURL["CASERVICEIP"] + "CAService/CAService";
            return urlCA;
        }
        public string getCredentialIP()
        {
            string urlCredential = HessURL["CREDENTIALIP"] + "credentialService/credentialService";
            return urlCredential;
        }
        public string getCryptoIP()
        {
            string urlCrypto = HessURL["CRYPTOIP"] + "cryptoService/cryptoService";
            return urlCrypto;
        }
        public string getEnrollmentIP()
        {
            string urlEnroll = HessURL["ENROLLMENTIP"] + "enrollmentService/enrollmentService";
            return urlEnroll;
        }
        public string getRoamingIP()
        {
            string urlRoaming = HessURL["ROAMINGIP"] + "RoamingService/RoamingService";
            return urlRoaming;
        }
        public string getValidationIP()
        {
            string urlValidation = HessURL["VALIDATIONIP"] + "validationService/validationService";
            return urlValidation;
        }
    }
}