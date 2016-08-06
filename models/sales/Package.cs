using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Sales
{
    public class Package
    {
        public string DibillsCode { get; set; }
        public string PackageName { get; set; }
        public int ProjectID { get; set; }
        public int? PackageID { get; set; }
        public int MediaID { get; set; }
        public int P_CertType { get; set; }
        public int P_Product { get; set; }
        public int P_Validity { get; set; }
        public int P_CertLength { get; set; }
        public string P_Hardware { get; set; }
        public string P_Packaging { get; set; }
        public string P_API { get; set; }
        public string P_Guide { get; set; }
        public string P_AccessibleBy { get; set; }
        public decimal P_Price { get; set; }
        public decimal P_GST { get; set; }
        public decimal P_TotalPrice { get; set; }
        public string PackageTypeID { get; set; }
        public int IsActive { get; set; }

        public string GeneralLedger { get; set; }
        public string ProfitCenter { get; set; }
        public string CertTypeID { get; set; }
    }
}