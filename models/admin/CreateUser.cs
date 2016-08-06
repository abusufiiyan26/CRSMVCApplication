using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Admin
{
    public class CreateUser
    {
        public int User_ID { get; set; }
        public string Name { get; set; }
        public string IDType { get; set; }
        public string ICNo { get; set; }
        public int CountryID { get; set; }
        public int StateID { get; set; }
        public string Mobile_No { get; set; }
        public string Email { get; set; }
        public string User_Status { get; set; }
        public DateTime ActiveDate { get; set; }
        public string Address { get; set; }
        public string Postcode { get; set; }
        public string City { get; set; }
        public string Gender { get; set; }
        public DateTime DOB { get; set; }

        //Company Information
        public int OrgID { get; set; }
        public string OrgName { get; set; }
        public string OrgRegNo { get; set; }
        public string OrgAddress { get; set; }
        public int OrgCountryID { get; set; }
        public int OrgStateID { get; set; }
        public string OrgPostcode { get; set; }
        public string OrgCity { get; set; }
        public string OrgFaxNo { get; set; }
        public string OrgTelNo { get; set; }

        //Role Information
        public int ProjectID { get; set; }
        public int Role_ID { get; set; }
        public int Department_ID { get; set; }

        //Customer Information
        public string Industry { get; set; }
        public string Website { get; set; }
        public string CustType { get; set; }

        public string CustomerCode { get; set; }

        public string CreatedAt { get; set; }
    }

    public class UpdateUser
    {
        //public int User_ID { get; set; }
        public string UpdateUserIDs { get; set; }
        public string UpdateName { get; set; }
        public string UpdateIDType { get; set; }
        public string UpdateICNo { get; set; }
        public int UpdateCountryID { get; set; }
        public int UpdateStateID { get; set; }
        public string UpdateMobile_No { get; set; }
        public string UpdateEmail { get; set; }
        public string User_Status { get; set; }
        public string UpdateAddress { get; set; }
        public string UpdatePostcode { get; set; }
        public string UpdateCity { get; set; }
        public string UpdateGender { get; set; }
        public DateTime UpdateDOB { get; set; }

        //Company Information
        public string UpdateOrgName { get; set; }
        public string UpdateOrgRegNo { get; set; }
        public string UpdateOrgAddress { get; set; }
        public int UpdateOrgCountryID { get; set; }
        public int UpdateOrgStateID { get; set; }
        public string UpdateOrgPostcode { get; set; }
        public string UpdateOrgCity { get; set; }
        public string UpdateOrgFaxNo { get; set; }
        public string UpdateOrgTelNo { get; set; }
        public int UpdateOrgProjectID { get; set; }

        //Role Information
        public int ProjectID { get; set; }
        public int Role_ID { get; set; }
        public int Department_ID { get; set; }

        //Customer Information
        public string Industry { get; set; }
        public string Website { get; set; }
        public string CustType { get; set; }

        public string CustomerCode { get; set; }
    }

    public class NewUserOrg
    {
        //Company Information
        public int NewAddUserID { get; set; }
        public string NewAddOrgName { get; set; }
        public string NewAddOrgRegNo { get; set; }
        public string NewAddOrgAddress { get; set; }
        public int NewAddOrgCountryID { get; set; }
        public int NewAddOrgStateID { get; set; }
        public string NewAddOrgPostcode { get; set; }
        public string NewAddOrgCity { get; set; }
        public string NewAddOrgFaxNo { get; set; }
        public string NewAddOrgTelNo { get; set; }
        public int NewAddOrgProject { get; set; }
    }
}