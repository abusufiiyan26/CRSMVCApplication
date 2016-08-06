using OneCRS.BLL;
using OneCRS.Common.BO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Service
{
    public class TokenPINService
    {
        public int InsertTokenCertPIN(int CertificateRequestID, string RequestID, string TokenPIN, int UserID)
        {
            int insStatus = 0;

            try
            {
                //Insert into Certificate Token
                List<t_CertificateTokenSOPINBO> lstToken = new List<t_CertificateTokenSOPINBO>();
                t_CertificateTokenSOPINBO tokenBo = new t_CertificateTokenSOPINBO();
                TokenManagementBLL tokenbll = new TokenManagementBLL();
                
                tokenBo.CertificateRequestID = CertificateRequestID;
                tokenBo.RequestID = RequestID;
                tokenBo.TokenPIN = TokenPIN;
                tokenBo.Cid = UserID.ToString();
                tokenBo.Cdt = DateTime.Now;
                tokenBo.Mid = UserID.ToString();
                tokenBo.Mdt = DateTime.Now;

                string tokenFilter = "CertificateRequestID='" + CertificateRequestID + "'";
                lstToken = tokenbll.SelectUnblockCode(tokenFilter);

                if (lstToken.Count == 0)
                {
                    insStatus = tokenbll.InsertPIN(tokenBo);
                }
            }
            catch (Exception ex)
            {
                insStatus = 0;
            }
            return insStatus;
        }
    }
}