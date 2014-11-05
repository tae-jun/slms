using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartServer
{
    class Request
    {
        public static object read(dynamic input)
        {
            string id = (string)input.id;

            object res = new
            {
                id = id,
                result = "read function result"
            };

            return res;
        }

        public static object write(object input)
        {
            return null;
        }
    }
}
