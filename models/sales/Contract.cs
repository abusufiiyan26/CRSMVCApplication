using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Sales
{
    public class Contract
    {
        public int ContractId { get; set; }
        public int ProjectID { get; set; }
        public string ContractDate { get; set; }
        public string ContractTitle { get; set; }
        public string ContractNo { get; set; }
        public int CustomerID { get; set; }
        public int ContactPersonID { get; set; }
        public int? ContractValue { get; set; }
        public string ContractStartDate { get; set; }
        public string ContractEndDate { get; set; }
        public decimal BondValue { get; set; }
        //public string ContractPeriod { get; set; }
        public string ContractType { get; set; }
        public int ContractQuantity { get; set; }
        public string BankGuarantee { get; set; }
        public string GuaranteePeriod { get; set; }
        public string ProjectStartDate { get; set; }
    }

    public class UpdateContract
    {
        public int UpdateContractId { get; set; }
        public string UpdateContractDate { get; set; }
        public string UpdateContractTitle { get; set; }
        public string UpdateContractNo { get; set; }
        public int UpdateProjectID { get; set; }
        public int UpdateCustomerID { get; set; }
        public int UpdateContactPersonID { get; set; }
        public int? UpdateContractValue { get; set; }
        public string UpdateContractStartDate { get; set; }
        public string UpdateContractEndDate { get; set; }
        public decimal UpdateBondValue { get; set; }
        //public string UpdateContractPeriod { get; set; }
        public string UpdateContractType { get; set; }
        public int UpdateContractQuantity { get; set; }
        public string UpdateBankGuarantee { get; set; }
        public string UpdateGuaranteePeriod { get; set; }
        public string UpdateProjectStartDate { get; set; }
    }
}