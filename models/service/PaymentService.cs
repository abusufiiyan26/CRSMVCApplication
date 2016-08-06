using OneCRS.BLL;
using OneCRS.Common.BO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;

namespace OneCRS.MVC.Models.Service
{
    public class PaymentService
    {
        public int InsertPayment(int UserID, int RequestID, int PONumber, int PackageID,
            int ProjectID, int ModeID, string Gateway, string PaymentStatus, string BankName, string ReceiptNo, int PaymentType, 
            int sInvoiceNo, int activeStatus, int emailStatus, int displayStatus,
            int? CustomerID, string ProjectPONo, string ContractNo, string ContactPersonName, int? ContactPersonID)
        {
            List<t_PaymentDetailsBO> lstpayBo = new List<t_PaymentDetailsBO>();
            List<UsersBO> lstUser = new List<UsersBO>();
            List<M_PackageBO> lstPack = new List<M_PackageBO>();
            t_PaymentDetailsBO pBo = new t_PaymentDetailsBO();
            PaymentBLL paybll = new PaymentBLL();
            UserBLL usrbll = new UserBLL();
            PackageBLL packbll = new PackageBLL();
            int paymentstatus = 0;

            string sFilter = "User_ID='" + UserID + "'";
            lstUser = usrbll.GetAllUserByID(sFilter);

            string packFilter = "PackageId='" + PackageID + "'";
            lstPack = packbll.GetPackage(packFilter);

            //Receipt RUning No
            List<ConfigNoBO> lstConfig = new List<ConfigNoBO>();
            ConfigNoBLL configBll = new ConfigNoBLL();
            string cFilter = "Module='Finance' AND Prefix='Receipt'";
            lstConfig = configBll.GetConfigNo(cFilter);

            //Get the GST Value
            List<DefaultDataCollectionBO> lstDDL = new List<DefaultDataCollectionBO>();
            DefaultDataCollectionBLL ddlBll = new DefaultDataCollectionBLL();
            string filterGST = "KeyValue='GST'";
            lstDDL = ddlBll.SelectRevokeReason(filterGST);
            int GSTValue = 0;
            if (lstDDL.Count > 0)
            {
                GSTValue = Convert.ToInt32(lstDDL[lstDDL.Count - 1].Value);
            }

            //Get the Finance Code
            string FinanceCode = string.Empty;
            if (BankName != null)
            {
                string filterBank = "Module='Finance' AND KeyValue='BankCode' AND Value='" + BankName + "'";
                lstDDL = ddlBll.SelectRevokeReason(filterBank);
                if (lstDDL.Count > 0)
                {
                    FinanceCode = lstDDL[lstDDL.Count - 1].KeyData;
                }
            }

            if (sInvoiceNo == 0)
            {
                pBo.InvoiceNo = Convert.ToInt32(lstConfig[0].ConfigNo) + 1; //year(16) + month(01) + runingno (6)
            }
            else
            {
                pBo.InvoiceNo = sInvoiceNo;
            }
            pBo.CustName = lstUser[0].Name.ToUpper();
            pBo.ApplicationDate = DateTime.Now;
            pBo.ReferenceNo = DateTime.Now.Year + "/" + pBo.InvoiceNo;
            pBo.Certificate_No = RequestID;
            pBo.PO_Number = PONumber;
            pBo.PaymentType = PaymentType;
            pBo.PackageID = PackageID;
            pBo.ProjectID = ProjectID;
            pBo.UnitPrice = Convert.ToDecimal(lstPack[lstPack.Count - 1].Price);
            pBo.GSTPrice = GSTValue;
            pBo.Total = Convert.ToDecimal(lstPack[lstPack.Count - 1].TotalPrice);
            pBo.ModeId = ModeID;
            pBo.Gateway = Gateway;
            pBo.PaymentDate = DateTime.Now;
            pBo.PaymentStatus = PaymentStatus;
            pBo.User_ID = UserID;
            pBo.Cid = Convert.ToString(UserID);
            pBo.Cdt = DateTime.Now;
            pBo.Mid = Convert.ToString(UserID);
            pBo.Mdt = DateTime.Now;
            pBo.CertificateRequestID = RequestID;
            pBo.BankName = BankName;
            pBo.ReceiptNo = ReceiptNo;
            pBo.ActiveStatus = activeStatus;
            pBo.EmailStatus = emailStatus;
            pBo.DisplayStatus = displayStatus;

            //NEW FIELD
            pBo.FinanceCode = FinanceCode;
            pBo.CustomerID = CustomerID;
            pBo.ContractNo = ContractNo;
            pBo.ProjectPO_Number = ProjectPONo;
            pBo.ContactPersonName = ContactPersonName;
            pBo.ContactPersonID = ContactPersonID;

            paymentstatus = paybll.InsertPay(pBo);

            ConfigNoBO cbo = new ConfigNoBO();
            cbo.RNo = lstConfig[0].RNo;
            cbo.ConfigNo = pBo.InvoiceNo.ToString();
            int updConfigStatus = configBll.UpdateConfigNo(cbo);

            return pBo.InvoiceNo;
        }
    }
}