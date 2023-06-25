
using GoogleFitApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace GoogleFitApi.Security
{
    public class PlayerAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            if (HttpContext.Current.Request.Headers["Auth"] != null)
            {
                string AuthCode = HttpContext.Current.Request.Headers["Auth"].ToString();
                Player APUser = SecurityProvider.GetUserFromAuthorizationCode(AuthCode);
                if (APUser != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }
}