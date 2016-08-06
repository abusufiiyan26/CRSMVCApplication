using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models
{
    public class MenuModel
    {
        public List<MainMenu> MainMenuModel { get; set; }
        public List<SubMenu> SubMenuModel { get; set; }
        public List<SubSubMenu> SubSubMenuModel { get; set; }
        public List<Sub3Menu> Sub3MenuModel { get; set; }
    }
    public class MainMenu
    {
        public int ID;
        public string MainMenuItem;
        public string MainMenuURL;
        public string MainMenuIcon;
    }
    public class SubMenu
    {
        public int MainMenuID;
        public string SubMenuItem;
        public string SubMenuURL;
        public int MenuID;
    }
    public class SubSubMenu
    {
        public int MainMenuID;
        public string SubSubMenuItem;
        public string SubSubMenuURL;
        public int MenuID;
    }
    public class Sub3Menu
    {
        public int MainMenuID;
        public string Sub3MenuItem;
        public string Sub3MenuURL;
    }
}