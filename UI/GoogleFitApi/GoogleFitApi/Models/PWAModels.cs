using GoogleFitApi.Models;
using GoogleFitApi.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitPlay.Models
{
    public class PostResponseModel
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public string Result { get; set; }
        public string AdditionalData { get; set; }
        public int AppVersion { get; set; }
    }
    
    public class ActivateRequestModel
    {
        public int Uid { get; set; }
        public string Password { get; set; }
        public string ActivationCode { get; set; }
    }

    public class PostRequestModel
    {
        public object RequestModel { get; set; }
        public int AppVersion { get; set; }        
    }

    public class GetDataRequestModel
    {
        public string SearchQuery { get; set; }
        public int PageNum { get; set; }
        public string Lang { get; set; }
    }

    public class PwaLoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class AuthorizationModel
    {
        public int PlayerID { get; set; }        
        public AuthorizationModel(string AuthorizationCode)
        {
            Player APUser = SecurityProvider.GetUserFromAuthorizationCode(AuthorizationCode);
            PlayerID = APUser.Player_ID;
        }
        
    }    

    public class GameScoreItem
    {
        public Player PlayerInfo { get; set; }
        public PlayerJoinedGame ScoreInfo { get; set; }
    }
}