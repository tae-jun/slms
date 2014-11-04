using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartServer
{
    public class Startup
    {
        public async Task<object> Invoke(object input)
        {
            return "Hello World from C#";
        }
    }
}
