using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Sales
{
    public class Product
    {
        public int ProductCode { get; set; }
        public string ProductName { get; set; }
        public int ProductTypeID { get; set; }
        public int ProductCategoryID { get; set; }
        public decimal? RPrice { get; set; }
        public string Description { get; set; }
    }

    public class RoamingCreateCert
    {
        public string commonName { get; set; }
        public string organizationName { get; set; }
        public string serialNumber { get; set; }
        public string emailAddress { get; set; }
        public string countryName { get; set; }
    }
}