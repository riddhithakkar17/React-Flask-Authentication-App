using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GoogleFitApi.Models;

namespace GoogleFitApi.Provider
{
    public class Config
    {
        internal static int ConvertToInt32(object v)
        {
            try
            {
                return Convert.ToInt32(v);
            }
            catch
            {
                return 0;
            }
        }

        internal static void SendActivationEmail(Player registerModel)
        {
            throw new NotImplementedException();
        }
    }
}