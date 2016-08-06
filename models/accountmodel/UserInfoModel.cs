using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.AccountModel
{
    public class UserInfoModel
    {
        public string ICNo { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Mobile_No { get; set; }
        public string Address { get; set; }
        public int? Country { get; set; }
        public int? State { get; set; }
        public string Postcode { get; set; }
        public string City { get; set; }
        public DateTime? DOB { get; set; }
        public string Gender { get; set; }
        public HttpPostedFileBase UserImg { get; set; }

        public string stringImg { get; set; }
        public bool isImgAvailable { get; set; }
    }

    public class UserChangePass
    {
        public string oPin { get; set; }
        public string nPin { get; set; }
        public string cnPin { get; set; }
    }
}