using GoogleFitApi.Provider;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GoogleFitApi
{
    public partial class ConnectGoogleFitApi : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.Params["Token"]== null)
            {
                throw new Exception("Access Denied");
            }
            else
            {
                Session["Token"] = Request.Params["Token"];
                File.WriteAllText(Server.MapPath("/App_Data/Log.txt"), GoogleFitApiHandler.ConnectToGoogleApi());                
                Response.Redirect(GoogleFitApiHandler.ConnectToGoogleApi());
            }
        }
    }
}