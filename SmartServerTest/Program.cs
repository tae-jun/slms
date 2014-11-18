using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartServer
{
    class Program
    {
        static void Main(string[] args)
        {
            Request.write("Net/LON/Test 1", 0x0);
            Console.WriteLine("Success");
            Console.ReadLine();
        }
    }
}
