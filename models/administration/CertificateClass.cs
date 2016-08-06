using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Administration
{
    public class CertificateClass
    {
        public int ClassID { get; set; }
        [Required]
        public string ClassName { get; set; }
        public string ClassDesc { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; }
    }
}