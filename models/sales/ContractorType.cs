using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Sales
{
    public class ContractorType
    {
        public int ContractorTypeID { get; set; }
        [Required]
        public string ContractorTypeName { get; set; }
    }
}