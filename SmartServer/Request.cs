using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartServer
{
    class Request
    {
        public static object read(string UCPTname)
        {
            

            return null;
        }

        public static void write(string UCPTname, int dim)
        {
            iLON_SoapCalls.BindClientToSmartServer();
            iLON_SmartServer.iLON100portTypeClient SmartServer = iLON_SoapCalls._iLON;
            try
            {
                iLON_SmartServer.E_xSelect xSelect = new iLON_SmartServer.E_xSelect();
                xSelect.xSelect = string.Format("//Item[@xsi:type=\"Dp_Cfg\"][starts-with(UCPTname,\"{0}/VirtFb\")]", UCPTname);
                iLON_SmartServer.Item_Coll ItemColl = SmartServer.List(xSelect);
                iLON_SmartServer.Item_DataColl ItemDataColl = SmartServer.Read(ItemColl);
                if (ItemColl.UCPTfaultCount > 0)
                {
                    Console.Out.WriteLine("you've got errors");
                }
                else
                {
                    iLON_SmartServer.Dp_Data tDimm = (iLON_SmartServer.Dp_Data)ItemDataColl.Item[0];
                    tDimm.UCPTvalue[0].Value = dim.ToString();

                    iLON_SmartServer.Dp_Data tRelay = (iLON_SmartServer.Dp_Data)ItemDataColl.Item[10];
                    tRelay.UCPTvalue[0].Value = dim.ToString();

                    SmartServer.Write(ItemDataColl);
                    Console.WriteLine(string.Format("{0} = {1}", UCPTname, dim));
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
            }
            finally
            {
                iLON_SoapCalls.CloseBindingToSmartServer();
            }

            //return null;
        }
    }
}
