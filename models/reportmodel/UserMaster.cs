using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models
{
    public class UserMaster
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string ICNo { get; set; }
        public string RoleName { get; set; }
        public string DepartName { get; set; }
        public Boolean UserStatus { get; set; }
    }
}