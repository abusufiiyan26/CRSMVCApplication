using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Public
{
    public class Invoice
    {
        public int InvoiceNo { get; set; }
        public string Description { get; set; }
        public string TxCode { get; set; }
        public int UnitPrice { get; set; }
        public int Quantity { get; set; }
        public int Total { get; set; }
    }
}