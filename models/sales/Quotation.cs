using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Sales
{
    public class Quotation
    {
        public int? sNo { get; set; }
        public int? packageID { get; set; }
        public int? mediaID { get; set; }
        public string PackageName { get; set; }
        public string PackageCode { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public string UnitPrice { get; set; }
        public int? GST { get; set; }
        public string GSTPrice { get; set; }
        public string Price { get; set; }
        public string Remarks { get; set; }
        public string isDBExist { get; set; }
    }

    public class QuotationList
    {
        public int? quotationID { get; set; }
        public int? projectID { get; set; }
        public string projectName { get; set; }

        public string poNumber { get; set; }
        public string poTitle { get; set; }
        public string poDate { get; set; }

        public int poQuantityCert { get; set; }
        public int poQuantitySSL { get; set; }
        public decimal poPrice { get; set; }

        public string cQNo { get; set; }
        public int? cQCPerson { get; set; }
        public int? cQCName { get; set; }
        public string cQAdd { get; set; }
        public string cQCity { get; set; }
        public string cQPCode { get; set; }
        public string cQState { get; set; }
        public string cQCountry { get; set; }
        public string cQTelO { get; set; }
        public string cQTelM { get; set; }

        public int? packID { get; set; }
        public string packRemarks { get; set; }
        public string packUnitPrice { get; set; }
        public string packGSTPrice { get; set; }
        public string packPrice { get; set; }

        public string deliveryMethod { get; set; }
        public string validityPeriod { get; set; }
        public string deliveryPayment { get; set; }
        public string deliveryTotal { get; set; }
        public string deliveryFees { get; set; }

        public int? invoiceType { get; set; }
        public string termsCondition { get; set; }
        public string IsGrandPrice { get; set; }
    }

    public class PODetails
    {
        public int? sNo { get; set; }
        public int? packageID { get; set; }
        public int? mediaID { get; set; }
        public string PackageName { get; set; }
        public int? Quantity { get; set; }
        public string UnitPrice { get; set; }
        public int? GST { get; set; }
        public string Price { get; set; }
        public string isDBExist { get; set; }
    }
}