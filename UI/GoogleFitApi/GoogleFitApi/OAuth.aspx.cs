using GoogleFitApi.Models;
using GoogleFitApi.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GoogleFitApi
{
    public partial class OAuth : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string Code = Request.Params["Code"];
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                Player player = Security.SecurityProvider.GetUserFromAuthorizationCode(Session["Token"].ToString());
                player.GoogleAuthorizationCode = Code;
                EF.Entry(player).State = System.Data.Entity.EntityState.Modified;
                EF.SaveChanges();                
            }            
        }
    }
}