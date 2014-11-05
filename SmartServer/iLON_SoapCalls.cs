using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel;

namespace SmartServer
{
    class iLON_SoapCalls
    {
        // your SmartServer's IpAddress
        public static string _iLonEndpointIpAddress = Config.SMART_SERVER_IP_ADDRESS;
        // your SmartServer’s Web service reference
        static public iLON_SmartServer.iLON100portTypeClient _iLON = null;
        /// <summary>
        /// Instantiates the SmartServer Web service for
        /// .NET 3.5
        /// </summary>
        static public void BindClientToSmartServer()
        {
            // Specify the binding to be used for the client.
            BasicHttpBinding binding = new BasicHttpBinding();
            // Initialize the namespace
            binding.Namespace = "http://wsdl.echelon.com/web_services_ns/ilon100/v4.0/message/";
            // Obtain the URL of the Web service on the i.LON SmartServer.
            System.ServiceModel.EndpointAddress endpointAddress
            = new System.ServiceModel.EndpointAddress("http://"
            + _iLonEndpointIpAddress + "/WSDL/iLON100.wsdl");
            // Instantiate the SmartServer Web service object with this address and binding.
            _iLON = new iLON_SmartServer.iLON100portTypeClient(binding, endpointAddress);
            // Uncommment the lines below to enable authentication
            // binding.Security.Mode =
            // System.ServiceModel.BasicHttpSecurityMode.TransportCredentialOnly;
            // binding.Security.Transport.ClientCredentialType =
            // System.ServiceModel.HttpClientCredentialType.Basic;
            // _iLON.ChannelFactory.Credentials.UserName.UserName = "ilon";
            // _iLON.ChannelFactory.Credentials.UserName.Password = "ilon";
        }
        /// <summary>
        /// Close the SmartServer Web service
        /// </summary>
        static public void CloseBindingToSmartServer()
        {
            // Closing the client gracefully
            // closes the connection and cleans up resources
            try
            {
                _iLON.Close();
            }
            finally
            {
                _iLON = null;
            }
        }
    }
}
