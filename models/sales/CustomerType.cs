using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Sales
{
    public class CustomerType
    {
        public int CustomerTypeID { get; set; }
        [Required]
        public string CustomerTypeName { get; set; }
        public string CustomerTypeDesc { get; set; }
    }
}