using System;

using System.Collections.Generic;

using System.Linq;                                         

public class Program

{

                public static void Main()

                {

                                string[] cards= new[] { "6", "6", "3", "10", "8"};

                                List<string> inputList = new List<string>(cards);

                var dList=  inputList.Distinct();

                //Console.WriteLine(inputList.Count());

                                //Console.WriteLine(dList.Count());

                                if(dList.Count()==inputList.Count())

                                {

                                                Console.WriteLine("False");

                                }

                                else

                                {

                        HashSet<string> hset = new HashSet<string>();

                        List<string> duplicatescards = new List<string>();

foreach(string item in cards)

{

    int oldCount = hset.Count;

    hset.Add(item);

    if (hset.Count == oldCount)

    {

        if (!duplicatescards.Contains(item))

        {

            duplicatescards.Add(item);

        }

    }

}

//Console.WriteLine(duplicatescards .Count());

//Console.WriteLine(duplicatescards[0]);

String sHighestpair = String.Format("[True, {0}]", duplicatescards[0]);

Console.WriteLine(sHighestpair);

                                }

                                               

      }

}