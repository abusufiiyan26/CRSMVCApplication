using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Administration
{
    public class CertificateType
    {
       public int CertificateTypeID { get; set; }

        [Required]
        public string CertificateTypeName { get; set; }

        [Required]
        public string CertificateTypeDesc { get; set; }
        public int ProcedureId { get; set; }

        [Required]
        public int No_Year { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? EndDate { get; set; }

        [Required]
        public string Status { get; set; }
        
    }
}