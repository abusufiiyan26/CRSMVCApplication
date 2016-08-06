using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Administration
{
    public class TemplateModel
    {
        public string TemplateName { get; set; }
        public string Description { get; set; }
        public string Data { get; set; }
        public string MailID { get; set; }
        public string EmailSource { get; set; }
        public string Subject { get; set; }
    }

    public class UpdateTemplateModel
    {
        public string UpdateTemplateName { get; set; }
        public string UpdateDescription { get; set; }
        public string UpdateData { get; set; }
        public string UpdateEmailSource { get; set; }
        public string UpdateSubjectName { get; set; }
        public string UpdateEmailID { get; set; }
    }
}