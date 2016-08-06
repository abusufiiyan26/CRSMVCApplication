using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OneCRS.Common.BO;
using OneCRS.BLL;

namespace OneCRS.MVC.Models.Service
{
    public class SoftPINService
    {
        public int InsertSoftPIN(int sCertificateRequestID, string PFXPin)
        {
            int VPinStatus = 0;

            try
            {
                t_CertificateRegistrationBO certBo = new t_CertificateRegistrationBO();
                PinQuestionSetupBLL pinbll = new PinQuestionSetupBLL();

                certBo.PFXPin = PFXPin;

                string sPinFilter = "CertificateRequestID='" + sCertificateRequestID + "'";
                VPinStatus = pinbll.UpdateCertPIN(certBo, sPinFilter);
            }
            catch (Exception ex)
            {
                VPinStatus = 0;
            }
            return VPinStatus;
        }
    }
}