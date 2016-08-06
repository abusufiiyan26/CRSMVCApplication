using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel.DataAnnotations;
namespace OneCRS.MVC.Models.Administration
{
    public class CertificateProcedure
    {

        public int ProcedureId { get; set; }
        [Required]
        public string ProcedureName { get; set; }
        [Required]
        public int ClassID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; }
      
    }
}