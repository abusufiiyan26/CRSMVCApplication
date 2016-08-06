using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.HessianTestModel
{
    public class objectmodel
    {
        public string setCertMode { get; set; }
        public string setCertStatus { get; set; }
        public string setCertRemarks { get; set; }
        public string UserId { get; set; }
    }

    public class UserRequest
    {
        public string genUserRequest { get; set; }
        public string getOrgId { get; set; }
    }
}