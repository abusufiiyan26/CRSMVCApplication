using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OneCRS.MVC.Models.Administration
{
    public class Menu
    {
        public int Menu_ID { get; set; }

        [Required]
        public string Menuname { get; set; }
       
        public int MenuparentID { get; set; }
        
        public string Menu_URL { get; set; }

        public int ModuleSeqNo { get; set; }

        public int SubMenuParentID { get; set; }
    }
}