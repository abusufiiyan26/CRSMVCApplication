using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Administration
{
    public class UserRoleAccess
    {
        [Required]
        public string RoleName { get; set; }
        [Required]
        public string RoleType { get; set; }
        [Required]
        public int RoleGrpID { get; set; }
        [Required]
        public int DepartmentID { get; set; }
        [Required]
        public int RoleID { get; set; }
    }
}