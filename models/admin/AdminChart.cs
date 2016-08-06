using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Admin
{
    public class AdminChart
    {
        [Required]
        public string iMonth { get; set; }
        [Required]
        public string iYear { get; set; }

    }
}