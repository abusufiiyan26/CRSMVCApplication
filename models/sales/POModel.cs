using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Sales
{
    public class POModel
    {
        public int? sNo { get; set; }
        public int? mediaID { get; set; }
        public int? Quantity { get; set; }
    }

    public class PORead
    {
        public int? sNo { get; set; }
        public int? mediaID { get; set; }
        public string mediaName { get; set; }
        public int? Quantity { get; set; }
    }

    public class POListModel
    {
        public int? quotationNo { get; set; }
        public string poNumber { get; set; }
        public string poTitle { get; set; }
        public string poDate { get; set; }

        public int? cQCName { get; set; }
        public string poPrice { get; set; }
    }
}