using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Sales
{
    public class Service
    {
        public int ServiceId { get; set; }
        [Required]
        public string ServiceName { get; set; }
        public string ServiceDesc { get; set; }
        public int ProjectID { get; set; }
    }
}