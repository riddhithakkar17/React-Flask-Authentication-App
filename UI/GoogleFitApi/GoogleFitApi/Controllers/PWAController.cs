using FitPlay.Models;
using GoogleFitApi.Models;
using GoogleFitApi.Provider;
using GoogleFitApi.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace GoogleFitApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PWAController : ApiController
    {
        #region .:: Base Codes
        public const int AppVersion = 1;
        public AuthorizationModel Token
        {
            get
            {
                return new AuthorizationModel(Request.Headers.GetValues("Auth").FirstOrDefault());
            }
        }
        private PostResponseModel CreateSuccessResponse(string responsetext, string additionalData)
        {
            PostResponseModel res = new PostResponseModel();
            res.AppVersion = AppVersion;
            res.ErrorMessage = "";
            res.Success = true;
            res.AdditionalData = additionalData;
            res.Result = responsetext;
            return res;
        }
        private PostResponseModel CreateSuccessResponse(string responsetext)
        {
            PostResponseModel res = new PostResponseModel();
            res.AppVersion = AppVersion;
            res.ErrorMessage = "";
            res.Success = true;
            res.AdditionalData = "";
            res.Result = responsetext;
            return res;
        }
        private PostResponseModel InvalidTokenError()
        {
            return CreateErrorResponse("Invalid Token");
        }
        private PostResponseModel CreateErrorResponse(string responsetext)
        {
            PostResponseModel res = new PostResponseModel();
            res.AppVersion = AppVersion;
            res.ErrorMessage = responsetext;
            res.AdditionalData = "";
            res.Success = false;
            res.Result = "";
            return res;
        }
        private T Json<T>(object ObjectToConvert)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject(ObjectToConvert.ToString(), typeof(T)) as dynamic;
        }
        #endregion

        [HttpPost]
        public PostResponseModel Login(PostRequestModel requestmodel)
        {
            PwaLoginModel loginrequest = Json<PwaLoginModel>(requestmodel.RequestModel);
            Player player = new FitPlayEntities().Players.Where(i => i.Email == loginrequest.Username).FirstOrDefault();
            if (player == null)
            {
                return CreateErrorResponse("Login Failed. Invalid Username and/or Password");
            }
            else if (player.Password == SecurityProvider.CamputeHash(loginrequest.Password))
            {
                return CreateSuccessResponse(SecurityProvider.GenerateAuthorizationCode(player.Player_ID, player.Email, loginrequest.Password));
            }
            else
            {
                return CreateErrorResponse("Login Failed. Invalid Username and/or Password");
            }
        }

        [HttpPost]
        public PostResponseModel Register(PostRequestModel requestmodel)
        {
            Player RegisterModel = Json<Player>(requestmodel.RequestModel);
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                if (EF.Players.Where(i => i.Mobile == RegisterModel.Mobile).Count() > 0)
                {
                    return CreateErrorResponse("The presented mobile number already exists in our database");
                }
                else if (EF.Players.Where(i => i.Email == RegisterModel.Email).Count() > 0)
                {
                    return CreateErrorResponse("The presented email address already exists in our database");
                }
                else
                {
                    RegisterModel.AvatarImage = "/img/Avatar.png";
                    RegisterModel.Age = 0;
                    RegisterModel.Body_BMI = 0;
                    RegisterModel.Body_Weight = 0;
                    RegisterModel.Gender = null;
                    RegisterModel.GoogleAuthorizationCode = "";
                    RegisterModel.Player_Height = 0;
                    RegisterModel.IsActivated = true; //false; temporarily for testing
                    RegisterModel.ActivationCode = new Random().Next(10000, 99999).ToString();
                    RegisterModel.Password = SecurityProvider.CamputeHash(RegisterModel.Password);
                    EF.Players.Add(RegisterModel);
                    EF.SaveChanges();
                    //Config.SendActivationEmail(RegisterModel);
                    return CreateSuccessResponse(RegisterModel.Player_ID.ToString());
                }
            }
        }

        [HttpGet]
        public Player Profile()
        {
            return new FitPlayEntities().Players.Find(Token.PlayerID);
        }

        [HttpPost]
        public PostResponseModel UpdateProfile(PostRequestModel requestmodel)
        {
            Player RegisterModel = Json<Player>(requestmodel.RequestModel);
            if (RegisterModel.Player_ID != Token.PlayerID)
            {
                return CreateErrorResponse("Security Error");
            }
            else
            {
                using (FitPlayEntities EF = new FitPlayEntities())
                {
                    if (EF.Players.Where(i => i.Mobile == RegisterModel.Mobile && i.Player_ID != RegisterModel.Player_ID).Count() > 0)
                    {
                        return CreateErrorResponse("The presented mobile number already exists in our database");
                    }
                    else if (EF.Players.Where(i => i.Email == RegisterModel.Email && i.Player_ID != RegisterModel.Player_ID).Count() > 0)
                    {
                        return CreateErrorResponse("The presented email address already exists in our database");
                    }
                    else
                    {
                        Player OldData = EF.Players.Find(RegisterModel.Player_ID);
                        if (RegisterModel.Password != "")
                        {
                            OldData.Password = SecurityProvider.CamputeHash(RegisterModel.Password);
                        }
                        EF.Entry(OldData).State = System.Data.Entity.EntityState.Modified;
                        EF.SaveChanges();
                        return CreateSuccessResponse(RegisterModel.Player_ID.ToString());
                    }
                }
            }
        }

        [HttpPost]
        public PostResponseModel SendPasswordReminderLink(PostRequestModel requestmodel)
        {
            return CreateErrorResponse("Not Implemented");
        }


        [HttpPost]
        public PostResponseModel Activate(PostRequestModel requestmodel)
        {
            ActivateRequestModel arm = Json<ActivateRequestModel>(requestmodel.RequestModel);
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                Player crm = EF.Players.Find(arm.Uid);
                if (crm.Password == SecurityProvider.CamputeHash(arm.Password))
                {
                    if (crm.ActivationCode == arm.ActivationCode)
                    {
                        crm.IsActivated = true;
                        EF.Entry(crm).State = System.Data.Entity.EntityState.Modified;
                        EF.SaveChanges();
                        return CreateSuccessResponse("1");
                    }
                    else
                    {
                        return CreateErrorResponse("Invalid Activation Code");
                    }
                }
                else
                {
                    return CreateErrorResponse("Invalid User Data");
                }
            }
        }

        [HttpPost]
        public PostResponseModel ResendActivationCode(PostRequestModel requestmodel)
        {
            ActivateRequestModel arm = Json<ActivateRequestModel>(requestmodel.RequestModel);
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                Player crm = EF.Players.Find(arm.Uid);
                if (crm.Password == SecurityProvider.CamputeHash(arm.Password))
                {
                    Config.SendActivationEmail(crm);
                    return CreateSuccessResponse("1");
                }
                else
                {
                    return CreateErrorResponse("Invalid User Data");
                }
            }
        }

        [HttpPost]
        [Player]
        public PostResponseModel CreateGame(PostRequestModel requestmodel)
        {
            Game NewGame = Json<Game>(requestmodel.RequestModel);
            using (FitPlayEntities EF = new FitPlayEntities())
            {                
                NewGame.CreatedDateTime = DateTime.Now;
                NewGame.CreatorPlayerID = Token.PlayerID;
                EF.Games.Add(NewGame);
                EF.SaveChanges();
                return CreateSuccessResponse(NewGame.GameID.ToString());
            }
        }

        [HttpPost]
        [Player]
        public PostResponseModel RemoveGame(PostRequestModel requestmodel)
        {
            int GameID = Config.ConvertToInt32(requestmodel.RequestModel);
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                Game CurrentGame = EF.Games.Find(GameID);
                if (CurrentGame.CreatorPlayerID == Token.PlayerID)
                {
                    EF.Games.Remove(CurrentGame);
                    EF.SaveChanges();
                    return CreateSuccessResponse("1");
                }
                else
                {
                    return CreateErrorResponse("Access Denied");
                }
            }
        }

        [HttpGet]
        [Player]
        public Game GetGameData(int GameID)
        {
            return new FitPlayEntities().Games.Find(GameID);
        }

        [HttpGet]
        [Player]
        public List<Game> GetAllGames()
        {
            return new FitPlayEntities().Games.ToList();
        }

        [HttpGet]
        [Player]
        public List<Game> GetMyGames()
        {
            int UID = Token.PlayerID;
            return new FitPlayEntities().Games.Where(i=>i.CreatorPlayerID == UID).ToList();
        }

        [HttpGet]
        [Player]
        public List<Game> GetMyJoinedGames()
        {
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                var Query = from a in EF.Games
                            join b in EF.PlayerJoinedGames on a.GameID equals b.Game_Id
                            where b.Player_Id == Token.PlayerID
                            select a;
                return Query.ToList();
            }
        }

        [HttpPost]
        [Player]
        public PostResponseModel UpdateGame(PostRequestModel requestmodel)
        {
            Game NewGame = Json<Game>(requestmodel.RequestModel);
            Game OldModel = new FitPlayEntities().Games.Find(NewGame.GameID);
            NewGame.CreatedDateTime = OldModel.CreatedDateTime;
            NewGame.CreatorPlayerID = OldModel.CreatorPlayerID;
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                EF.Entry(NewGame).State = System.Data.Entity.EntityState.Modified;
                EF.SaveChanges();
            }
            return CreateSuccessResponse("1");
        }

        [HttpPost]
        [Player]
        public PostResponseModel JoinTheGame(PostRequestModel requestmodel)
        {
            PlayerJoinedGame playerjoin = Json<PlayerJoinedGame>(requestmodel.RequestModel);
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                if (EF.PlayerJoinedGames.Where(i => i.Player_Id == playerjoin.Player_Id && i.Game_Id == playerjoin.Game_Id).Count() > 0)
                {
                    return CreateErrorResponse("Player has already joined the game");
                }
                else
                {
                    EF.PlayerJoinedGames.Add(playerjoin);
                    EF.SaveChanges();
                    return CreateSuccessResponse(playerjoin.PlayerJoinedID.ToString());
                }
            }
        }

        [HttpGet]
        [Player]
        public List<GameScoreItem> GetGameStatistic(int GameID)
        {
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                var Query = from a in EF.PlayerJoinedGames
                            join b in EF.Players on a.Player_Id equals b.Player_ID
                            where a.Game_Id == GameID
                            select new GameScoreItem { PlayerInfo = b, ScoreInfo = a };
                return Query.ToList();
            }
        }

        [HttpGet]
        [Player]
        public string ConnectToGoogleFitApi()
        {
            return "https://fitplay.babaktn.com/ConnectGoogleFitApi.aspx?Token=" + Request.Headers.GetValues("Auth").FirstOrDefault();
        }

        [HttpGet]
        [Player]
        public string GetLatestGoogleFitData(int GameID)
        {
            String Res = "0";
            using (FitPlayEntities EF = new FitPlayEntities())
            {
                int PlayerID = Token.PlayerID;
                string GoogleAuthorizationCode = EF.Players.Find(PlayerID).GoogleAuthorizationCode;
                List<PlayerJoinedGame> PJG = EF.PlayerJoinedGames.Where(i => i.Player_Id == PlayerID).ToList();
                AccessToken GoogleFitAccessToken = GoogleFitApiHandler.GetAccessToken(GoogleAuthorizationCode);
                foreach (PlayerJoinedGame pj in PJG)
                {
                    Game CurrentUserGame = EF.Games.Find(pj.Game_Id);
                    if (CurrentUserGame.GameType == "CaloriesBurned")
                    {
                        string FitData = GoogleFitApiHandler.GetLatestFitData(GoogleFitAccessToken, GoogleFitApiHandler.GoogleFitDataType.CaloriesBurned, CurrentUserGame.GameStartDate.Value);
                        pj.GoogleFitValue = FitData;
                        pj.Score = Convert.ToInt32(FitData);
                        EF.Entry(pj).State = System.Data.Entity.EntityState.Modified;
                        EF.SaveChanges();
                        if (pj.Game_Id == GameID)
                        {
                            Res = FitData;
                        }
                    }
                }
            }
            return Res;
        }
    }
}
