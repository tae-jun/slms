using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartServer
{
    public class Startup
    {
        public async Task<object> read(object input)
        {
            return Request.read(input);
        }

        public async Task<object> write(object input)
        {
            return Request.write(input);
        }
    }
}
