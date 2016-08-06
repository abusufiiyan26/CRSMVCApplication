using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace OneCRS.MVC.Models.Service
{
    public class RandomService
    {
        public string RandomString(int Size)
        {
            string input = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvyxyz0123456789";
            StringBuilder builder = new StringBuilder();
            Random rnd = new Random();
            char ch;

            for (int i = 0; i < Size; i++)
            {
                ch = input[rnd.Next(0, input.Length)];
                builder.Append(ch);
            }
            return builder.ToString();
        }

    }
}