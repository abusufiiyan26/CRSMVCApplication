using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Sales
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public int? CustomerTypeID { get; set; }
        public string RegistrationNo { get; set; }
        public string ContactPerson { get; set; }
        public string Addr1 { get; set; }
        public string Addr2 { get; set; }
        public string Addr3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostCode { get; set; }
        public string Country { get; set; }
        public string Type { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string FaxNo { get; set; }
        public string MobileNo { get; set; }
    }
}