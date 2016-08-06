using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Administration
{
    public class UserRolePrivileges
    {
        
        public string RolePrivilegesID { get; set; }

        [Required]
        public int DepartmentID { get; set; }

        [Required]
        public int menu_id { get; set; }

        [Required]
        public int Visible { get; set; }

        [Required]
        public int RoleGrpID { get; set; }

        public int RAdd { get; set; }
        public int RModify { get; set; }
    }
}