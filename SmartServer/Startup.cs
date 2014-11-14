using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartServer
{
    public class Startup
    {
        public async Task<object> read(dynamic input)
        {
            string UCPTname = (string)input.UCPTname;


            return Request.read(input);
        }

        public async Task<object> write(dynamic input)
        {
            string UCPTname = (string)input.UCPTname;
            int dim = (int)input.dim;

            Request.write(UCPTname, dim);

            object res = new
            {
                status = "success"
            };

            return res;
        }
    }
}
