using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneCRS.MVC.Models.Service
{
    public class JQGridSearchService
    {
        public string SearchFunction(string searchField)
        {
            string Search = "";
            Search = Search + "(RequestID LIKE '%" + searchField + "%'";
            Search = Search + " OR Name LIKE '%" + searchField + "%'";
            Search = Search + " OR ICNo LIKE '%" + searchField + "%'";
            Search = Search + " OR CompanyName LIKE '%" + searchField + "%'";
            Search = Search + " OR PackageName LIKE '%" + searchField + "%'";
            Search = Search + " OR Request_Date LIKE '%" + searchField + "%')";
            return Search;
        }

        public string FormatMapping(string searchField, string searchOper, string searchString)
        {

            string newVal = "";

            if (searchOper == "eq")
            {                // "eq" - equal
                newVal = searchField + " = '" + searchString + "'";
            }
            else if (searchOper == "ne")
            {           // "ne" - not equal
                newVal = searchField + " <> '" + searchString + "'";
            }
            else if (searchOper == "lt")
            {           // "lt" - less than
                newVal = searchField + " < '" + searchString + "'";
            }
            else if (searchOper == "le")
            {           // "le" - less than or equal to
                newVal = searchField + " <= '" + searchString + "'";
            }
            else if (searchOper == "gt")
            {           // "gt" - greater than
                newVal = searchField + " > '" + searchString + "'";
            }
            else if (searchOper == "ge")
            {           // "ge" - greater than or equal to
                newVal = searchField + " >= '" + searchString + "'";
            }
            else if (searchOper == "bw")
            {           // "bw" - begins with
                newVal = searchField + " LIKE '" + searchString + "%'";
            }
            else if (searchOper == "bn")
            {           // "bn" - does not begin with
                newVal = searchField + " NOT LIKE '" + searchString + "%'";
            }
            else if (searchOper == "ew")
            {           // "ew" - ends with
                newVal = searchField + " LIKE '%" + searchString + "'";
            }
            else if (searchOper == "en")
            {          // "en" - does not end with
                newVal = searchField + " NOT LIKE '%" + searchString + "'";
            }
            else if (searchOper == "cn")
            {          // "cn" - contains
                newVal = searchField + " LIKE '%" + searchString + "%'";
            }
            else if (searchOper == "nc")
            {           //" nc" - does not contain
                newVal = searchField + " NOT LIKE '%" + searchString + "%'";
            }
            else
            {
                newVal = searchField + " LIKE '%" + searchString + "%'";
            }
            return newVal;
        }

        public string TokenSOPinFunction(string searchField)
        {
            string Search = "";
            Search = Search + "(RequestID LIKE '%" + searchField + "%'";
            Search = Search + " OR TokenHID LIKE '%" + searchField + "%'";
            Search = Search + " OR TokenSOPIN LIKE '%" + searchField + "%'";
            Search = Search + " OR TokenSerialNo LIKE '%" + searchField + "%'";
            Search = Search + " OR TokenUnblockCode LIKE '%" + searchField + "%')";
            return Search;
        }
    }
}