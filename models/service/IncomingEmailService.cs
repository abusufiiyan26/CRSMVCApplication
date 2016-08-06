using OneCRS.BLL;
using OneCRS.Common;
using OneCRS.Common.BO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Service
{
    public class IncomingEmailService
    {
        WebPageExceptionDetailsBLL bllEx = new WebPageExceptionDetailsBLL();

        //Request New Certificate (User -> AP/RP)
        public int EmailNotification(List<View_CertificateRegistrationBO> lstView, string templateName)
        {
            List<View_CertificateRegistrationBO> vlstUser = new List<View_CertificateRegistrationBO>();
            List<View_CertificateRegistrationBO> vlstUserFromAP = new List<View_CertificateRegistrationBO>();
            List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
            CertVerificationBLL uBll = new CertVerificationBLL();
            View_CertificateRegistrationBO viewBo = new View_CertificateRegistrationBO();
            EmailTemplateBLL bll = new EmailTemplateBLL();
            EmailNotificationBLL mailSent = new EmailNotificationBLL();
            string cc = string.Empty;
            string Emailfilter = string.Empty;
            int newStatMail = 0;
            int vEmailIsAP = 0;
            string filter = string.Empty;
            string title = string.Empty;
            string content = string.Empty;

            if (lstView[lstView.Count - 1].MediaID == 1)
            {
                //If the media is roaming, and verification needed from AP 
                if (lstView[lstView.Count - 1].V_IsAP == 1)
                {
                    Emailfilter = "ProjectId='" + lstView[lstView.Count - 1].Project_Id + "' AND Role_ID='3' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 1;
                }
                //If the media is roaming, and verification needed from RP
                else
                {
                    Emailfilter = "Role_ID='4' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 0;
                }
            }
            else if (lstView[lstView.Count - 1].MediaID == 2)
            {
                //If the media is token, and verification needed from AP 
                if (lstView[lstView.Count - 1].Token_V_IsAP == 1)
                {
                    Emailfilter = "ProjectId='" + lstView[lstView.Count - 1].Project_Id + "' AND Role_ID='3' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 1;
                }
                //If the media is token, and verification needed from RP
                else
                {
                    Emailfilter = "Role_ID='4' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 0;
                }
            }
            else if (lstView[lstView.Count - 1].MediaID == 3)
            {
                //If the media is softcert, and verification needed from AP 
                if (lstView[lstView.Count - 1].Soft_V_IsAP == 1)
                {
                    Emailfilter = "ProjectId='" + lstView[lstView.Count - 1].Project_Id + "' AND Role_ID='3' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 1;
                }
                //If the media is softcert, and verification needed from RP
                else
                {
                    Emailfilter = "Role_ID='4' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 0;
                }
            }
            else if (lstView[lstView.Count - 1].MediaID == 4)
            {
                //If the media is Smartcard, and verification needed from AP 
                if (lstView[lstView.Count - 1].Smart_V_IsAP == 1)
                {
                    Emailfilter = "ProjectId='" + lstView[lstView.Count - 1].Project_Id + "' AND Role_ID='3' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 1;
                }
                //If the media is Smartcard, and verification needed from RP
                else
                {
                    Emailfilter = "Role_ID='4' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 0;
                }
            }
            else if (lstView[0].MediaID == 5)
            {
                //If the media is Server, and verification needed from AP 
                if (lstView[lstView.Count - 1].Server_V_IsAP == 1)
                {
                    Emailfilter = "ProjectId='" + lstView[lstView.Count - 1].Project_Id + "' AND Role_ID='3' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 1;
                }
                //If the media is Server, and verification needed from RP
                else
                {
                    Emailfilter = "Role_ID='4' AND Cert_Status='1'";
                    vlstUser = uBll.GetCertJoin(Emailfilter);
                    vEmailIsAP = 0;
                }
            }
            else
            {
                Emailfilter = "Role_ID='4' AND Cert_Status='1'";
                vlstUser = uBll.GetCertJoin(Emailfilter);
                vEmailIsAP = 0;
            }

            if (vlstUser.Count > 0)
            {
                foreach (View_CertificateRegistrationBO attach in vlstUser)
                {
                    viewBo = new View_CertificateRegistrationBO();
                    viewBo.Email = attach.Email;
                    viewBo.Name = attach.Name;
                    cc = cc + attach.Email + ";";
                    vlstUserFromAP.Add(viewBo);
                }
                try
                {
                    if (vEmailIsAP == 1)
                    {
                        filter = "TemplateName='" + templateName + "'";
                        lstMail = bll.GetMailTemplate(filter);
                        if (lstMail.Count > 0)
                        {
                            title = lstMail[lstMail.Count - 1].Subject;
                            content = lstMail[lstMail.Count - 1].MailContent;

                            newStatMail = mailSent.IncomingNewRequestEmailTemplate(lstView, "Authorized Personnel (AP)", "", cc, title, content, "");
                        }
                    }
                    else
                    {
                        filter = "TemplateName='" + templateName + "'";
                        lstMail = bll.GetMailTemplate(filter);
                        if (lstMail.Count > 0)
                        {
                            title = lstMail[lstMail.Count - 1].Subject;
                            content = lstMail[lstMail.Count - 1].MailContent;

                            newStatMail = mailSent.IncomingNewRequestEmailTemplate(lstView, "Registration Personnel (RP)", "", cc, title, content, "");
                        }
                    }
                }
                catch (Exception ex)
                {
                    string UserID = "";
                    if (lstView[0].User_ID != 0)
                    {
                        UserID = lstView[0].User_ID.ToString();
                    }
                    bllEx.ManageException(ex, "Wizard", "PublicController", "SaveNewApplication", UserID);
                }
            }
            return newStatMail;
        }

        //Certificate Confirmation (User -> RO)
        public int NotificationWithView(List<View_CertificateRegistrationBO> lstView, string templateName)
        {
            int newStatMail = 0;

            try
            {
                EmailNotificationBLL mailSent = new EmailNotificationBLL();
                List<View_CertificateRegistrationBO> vEmail = new List<View_CertificateRegistrationBO>();
                List<View_CertificateRegistrationBO> vEmailAdmin = new List<View_CertificateRegistrationBO>();
                View_CertificateRegistrationBO viewReqBo = new View_CertificateRegistrationBO();
                CertRequestBLL reqbll = new CertRequestBLL();
                CertVerificationBLL certbll = new CertVerificationBLL();
                List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
                EmailTemplateBLL bll = new EmailTemplateBLL();
                string cc = "";
                string filter = string.Empty;
                string title = string.Empty;
                string content = string.Empty;

                string emailFilter = "Role_ID='5' AND Cert_Status='1'";
                vEmail = certbll.GetCertJoin(emailFilter);

                foreach (View_CertificateRegistrationBO attach in vEmail)
                {
                    viewReqBo = new View_CertificateRegistrationBO();
                    viewReqBo.Email = attach.Email;
                    viewReqBo.Name = attach.Name;
                    cc = cc + attach.Email + ";";
                    vEmailAdmin.Add(viewReqBo);
                }

                filter = "TemplateName='" + templateName + "'";
                lstMail = bll.GetMailTemplate(filter);
                if (lstMail.Count > 0)
                {
                    title = lstMail[lstMail.Count - 1].Subject;
                    content = lstMail[lstMail.Count - 1].MailContent;

                    newStatMail = mailSent.IncomingNewRequestEmailTemplate(lstView, "Registration Officer (RO)", "", cc, title, content, "");
                }
            }
            catch (Exception ex)
            {
                string UserID = "";
                if (lstView[0].User_ID != 0)
                {
                    UserID = lstView[0].User_ID.ToString();
                }
                bllEx.ManageException(ex, "Wizard", "PublicController", "SaveNewApplication", UserID);
            }
            return newStatMail;
        }

        //Request New Certificate (System -> User)
        public int UserEmailNotification(List<View_CertificateRegistrationBO> lstView, string Email, string Name, int isUserExist, string sUrl, string templateName, string info)
        {
            int statusMail = 0;

            try
            {
                EmailNotificationBLL mailSent = new EmailNotificationBLL();
                List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
                EmailTemplateBLL bll = new EmailTemplateBLL();
                string filter = string.Empty;
                string title = string.Empty;
                string content = string.Empty;

                if (isUserExist == 1)
                {
                    //filter = "TemplateName='UserNewRequestNotification'";
                    filter = "TemplateName='" + templateName + "'";
                    lstMail = bll.GetMailTemplate(filter);
                    if (lstMail.Count > 0)
                    {
                        title = lstMail[lstMail.Count - 1].Subject;
                        content = lstMail[lstMail.Count - 1].MailContent;
                        statusMail = mailSent.UserNewRequestEmailTemplate(lstView, "", Email, "", title, content, "");
                    }
                }
                else
                {
                    //filter = "TemplateName='CertificateRequestwithUserCreationEmail'";
                    filter = "TemplateName='" + templateName + "'";
                    lstMail = bll.GetMailTemplate(filter);
                    if (lstMail.Count > 0)
                    {
                        title = lstMail[lstMail.Count - 1].Subject;
                        content = lstMail[lstMail.Count - 1].MailContent;
                        statusMail = mailSent.UserNewRequestEmailTemplate(lstView, "", Email, "", title, content, sUrl);
                    }
                }
                return statusMail;
            }
            catch (Exception ex)
            {
                statusMail = 0;
                return statusMail;
            }
        }

        //User Registration (System -> User)
        public int RegistrationEmailNotification(string Password, string Email, string Name, string UserName, string sUrl, string templateName)
        {
            int statusMail = 0;

            try
            {
                EmailNotificationBLL mailSent = new EmailNotificationBLL();
                List<EmailTemplateBO> lstMail = new List<EmailTemplateBO>();
                EmailTemplateBLL bll = new EmailTemplateBLL();
                string filter = string.Empty;
                string title = string.Empty;
                string content = string.Empty;

                filter = "TemplateName='" + templateName + "'";
                lstMail = bll.GetMailTemplate(filter);
                if (lstMail.Count > 0)
                {
                    title = lstMail[lstMail.Count - 1].Subject;
                    content = lstMail[lstMail.Count - 1].MailContent;
                    statusMail = mailSent.RegistrationEmailTemplate(Password, Email, Name, UserName, title, content, sUrl, "");
                }
                return statusMail;
            }
            catch (Exception ex)
            {
                statusMail = 0;
                return statusMail;
            }
        }

    }
}