using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Administration
{
    public class UserRoleGroup
    {        
        [Required]
        public string RoleGrpName { get; set; }
        [Required]
        public int RoleGrpID { get; set; }
       
    }
}