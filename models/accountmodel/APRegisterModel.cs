using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.AccountModel
{
    public class APRegisterModel
    {
        public string idtype { get; set; }
        public string idno { get; set; }
        public string name { get; set; }
        public string dob { get; set; }
        public string sex { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string postcode { get; set; }
        public int country { get; set; }
        public int state { get; set; }
        public string email { get; set; }
        public string telno { get; set; }

        public string c_orgname { get; set; }
        public string c_regno { get; set; }
        public string c_telno { get; set; }
        public string c_faxno { get; set; }
        public string c_address { get; set; }
        public string c_city { get; set; }
        public string c_postcode { get; set; }
        public int c_country { get; set; }
        public int c_state { get; set; }
        public int project { get; set; }

        public string bank { get; set; }
        public string picture { get; set; }
        public string comments { get; set; }
    }
}