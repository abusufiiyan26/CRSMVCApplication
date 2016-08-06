using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using System.Web.Security;

namespace OneCRS.MVC.Models.Sales
{
    public class Project
    {
        //first step
        public int ProjectId { get; set; }
        public string GLCode { get; set; }
        public string ProjectName { get; set; }
        public string ProjectCode { get; set; }
        public int? ProjectType { get; set; }
        public string ProjectPrefix { get; set; }
        public string ProjectOwner { get; set; }
        public int? ProjectCP { get; set; }
        public string ProjectDesc { get; set; }
        public string P_Remarks { get; set; }
        public string P_EmailCC { get; set; }
        public int? P_Quantity { get; set; }
        public int? P_QuantityPO { get; set; }
        public int? P_QuantityPaid { get; set; }
        public bool P_AccessIsUser { get; set; }
        public bool P_AccessIsUserSI { get; set; }
        public bool P_AccessIsAP { get; set; }

        public string ProjectPONumber { get; set; }

        //Added on 15nov
        //second step
        public bool C_CertIsCountry { get; set; }
        public bool C_CertIsCN { get; set; }
        public bool C_CertIsSN { get; set; }
        public bool C_CertIsEmail { get; set; }
        public bool C_CertIsOrgName { get; set; }
        public bool C_CertIsOrgRegNo { get; set; }
        public bool C_MediumIsSoft { get; set; }
        public bool C_MediumIsToken { get; set; }
        public bool C_MediumIsSmart { get; set; }
        public bool C_MediumIsRoaming { get; set; }
        public bool C_MediumIsServer { get; set; }
        //public int C_QATotalNo { get; set; }
        //public int C_QA_ID { get; set; }

        //third step
        public bool PT_UserIsBypass { get; set; }
        public bool PT_UserIsOnline { get; set; }
        public int PT_UserIsOnlineInt { get; set; }
        public string PT_UserURL { get; set; }
        public bool PT_UserIsManual { get; set; }
        public bool PT_APIsBypass { get; set; }
        public bool PT_APIsOnline { get; set; }
        public int PT_APIsOnlineInt { get; set; }
        public string PT_APURL { get; set; }
        public bool PT_APIsManual { get; set; }

        //fourth step
        public string SD_IsRequired { get; set; }
        public bool SD_IsIC { get; set; }
        public bool SD_IsSSM { get; set; }
        public bool SD_IsRegSlip { get; set; }
        public bool SD_IsAuthLetter { get; set; }
        public bool SD_IsPassPort { get; set; }
        public bool SD_IsSupporting1 { get; set; }
        public bool SD_IsSupporting2 { get; set; }

        public bool SD_IsRequiredBool { get; set; }

        //fifth step
        public bool V_IsAP { get; set; }
        public bool V_IsRP { get; set; }
        public bool A_IsRO { get; set; }
        public bool A_IsBypassRO { get; set; }

        //public bool VerifiedBy { get; set; }

        public int MAXselectedno { get; set; }

        //verification for each medium
        public int Token_V_IsAP { get; set; }
        public int Token_V_IsRP { get; set; }
        public int Token_A_IsRO { get; set; }
        public int Token_A_IsBypassRO { get; set; }

        public int Soft_V_IsAP { get; set; }
        public int Soft_V_IsRP { get; set; }
        public int Soft_A_IsRO { get; set; }
        public int Soft_A_IsBypassRO { get; set; }

        public int Smart_V_IsAP { get; set; }
        public int Smart_V_IsRP { get; set; }
        public int Smart_A_IsRO { get; set; }
        public int Smart_A_IsBypassRO { get; set; }

        public int Server_V_IsAP { get; set; }
        public int Server_V_IsRP { get; set; }
        public int Server_A_IsRO { get; set; }
        public int Server_A_IsBypassRO { get; set; }

        //update verification for each medium
        public bool Update_Token_V_IsAP { get; set; }
        public bool Update_Token_V_IsRP { get; set; }
        public bool Update_Token_A_IsRO { get; set; }
        public bool Update_Token_A_IsBypassRO { get; set; }

        public bool Update_Soft_V_IsAP { get; set; }
        public bool Update_Soft_V_IsRP { get; set; }
        public bool Update_Soft_A_IsRO { get; set; }
        public bool Update_Soft_A_IsBypassRO { get; set; }

        public bool Update_Smart_V_IsAP { get; set; }
        public bool Update_Smart_V_IsRP { get; set; }
        public bool Update_Smart_A_IsRO { get; set; }
        public bool Update_Smart_A_IsBypassRO { get; set; }

        public bool Update_Server_V_IsAP { get; set; }
        public bool Update_Server_V_IsRP { get; set; }
        public bool Update_Server_A_IsRO { get; set; }
        public bool Update_Server_A_IsBypassRO { get; set; }

        //display to the dropdownlist
        public int Hide_C_MediumIsSoft { get; set; }
        public int Hide_C_MediumIsToken { get; set; }
        public int Hide_C_MediumIsSmart { get; set; }
        public int Hide_C_MediumIsRoaming { get; set; }
        public int Hide_C_MediumIsServer { get; set; }

        public string ErrorResult { get; set; }
        public int? CertStructure { get; set; }

        public string projectPOFiles { get; set; }
    }

    public class ProjectForm
    {
        //first step
        public int ProjectId { get; set; }
        public string GLCode { get; set; }
        public string ProjectName { get; set; }
        public string ProjectCode { get; set; }
        public string ProjectCodeValue { get; set; }
        public string ProjectType { get; set; }
        public string ProjectPrefix { get; set; }
        public string ProjectOwner { get; set; }
        public string ProjectDesc { get; set; }
        public string P_Remarks { get; set; }
        public string P_EmailCC { get; set; }
        public int P_Quantity { get; set; }
        public int P_QuantityPO { get; set; }
        public int P_QuantityPaid { get; set; }
        public bool P_AccessIsUser { get; set; }
        public bool P_AccessIsUserSI { get; set; }
        public bool P_AccessIsAP { get; set; }

        //Added on 15nov
        //second step
        public bool C_CertIsCountry { get; set; }
        public bool C_CertIsCN { get; set; }
        public bool C_CertIsSN { get; set; }
        public bool C_CertIsEmail { get; set; }
        public bool C_CertIsOrgName { get; set; }
        public bool C_CertIsOrgRegNo { get; set; }
        public bool C_MediumIsSoft { get; set; }
        public bool C_MediumIsToken { get; set; }
        public bool C_MediumIsSmart { get; set; }
        public bool C_MediumIsRoaming { get; set; }
        public bool C_MediumIsServer { get; set; }
        //public int C_QATotalNo { get; set; }
        //public int C_QA_ID { get; set; }

        //third step
        public bool PT_UserIsBypass { get; set; }
        public bool PT_UserIsOnline { get; set; }
        public string PT_UserURL { get; set; }
        public bool PT_UserIsManual { get; set; }
        public bool PT_APIsBypass { get; set; }
        public bool PT_APIsOnline { get; set; }
        public string PT_APURL { get; set; }
        public bool PT_APIsManual { get; set; }

        //fourth step
        public string SD_IsRequired { get; set; }
        public bool SD_IsIC { get; set; }
        public bool SD_IsSSM { get; set; }
        public bool SD_IsRegSlip { get; set; }
        public bool SD_IsAuthLetter { get; set; }

        public bool SD_IsRequiredBool { get; set; }

        //fifth step
        public bool V_IsAP { get; set; }
        public bool V_IsRP { get; set; }
        public bool A_IsRO { get; set; }
        public bool A_IsBypassRO { get; set; }

        //public bool VerifiedBy { get; set; }

        public int MAXselectedno { get; set; }

        //verification for each medium
        public int Token_V_IsAP { get; set; }
        public int Token_V_IsRP { get; set; }
        public int Token_A_IsRO { get; set; }
        public int Token_A_IsBypassRO { get; set; }

        public int Soft_V_IsAP { get; set; }
        public int Soft_V_IsRP { get; set; }
        public int Soft_A_IsRO { get; set; }
        public int Soft_A_IsBypassRO { get; set; }

        public int Smart_V_IsAP { get; set; }
        public int Smart_V_IsRP { get; set; }
        public int Smart_A_IsRO { get; set; }
        public int Smart_A_IsBypassRO { get; set; }

        public int Server_V_IsAP { get; set; }
        public int Server_V_IsRP { get; set; }
        public int Server_A_IsRO { get; set; }
        public int Server_A_IsBypassRO { get; set; }

        //update verification for each medium
        public bool Update_Token_V_IsAP { get; set; }
        public bool Update_Token_V_IsRP { get; set; }
        public bool Update_Token_A_IsRO { get; set; }
        public bool Update_Token_A_IsBypassRO { get; set; }

        public bool Update_Soft_V_IsAP { get; set; }
        public bool Update_Soft_V_IsRP { get; set; }
        public bool Update_Soft_A_IsRO { get; set; }
        public bool Update_Soft_A_IsBypassRO { get; set; }

        public bool Update_Smart_V_IsAP { get; set; }
        public bool Update_Smart_V_IsRP { get; set; }
        public bool Update_Smart_A_IsRO { get; set; }
        public bool Update_Smart_A_IsBypassRO { get; set; }

        public bool Update_Server_V_IsAP { get; set; }
        public bool Update_Server_V_IsRP { get; set; }
        public bool Update_Server_A_IsRO { get; set; }
        public bool Update_Server_A_IsBypassRO { get; set; }

        //display to the dropdownlist
        public int Hide_C_MediumIsSoft { get; set; }
        public int Hide_C_MediumIsToken { get; set; }
        public int Hide_C_MediumIsSmart { get; set; }
        public int Hide_C_MediumIsRoaming { get; set; }
        public int Hide_C_MediumIsServer { get; set; }

        public string ErrorResult { get; set; }
        public int? CertStructure { get; set; }
    }
}