using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace GoogleFitApi.Provider
{
    public class GoogleFitApiHandler
    {
        private const string client_id = "583572889380-8h60p6o48h80flf93hg6vut1l35k72kc.apps.googleusercontent.com";
        private const string client_secret = "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";
        private const string redirect_uri = "https://fitplay.babaktn.com/OAuth.aspx";
        public enum GoogleFitDataType { CaloriesBurned }

        public static string ConnectToGoogleApi()
        {
            return "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=" + redirect_uri + "&response_type=code&client_id=" + client_id + "&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.activity.read&access_type=offline&flowName=GeneralOAuthFlow";
        }

        public static AccessToken GetAccessToken(string AuthorizationCode)
        {
            string Uri = "https://oauth2.googleapis.com/token?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + AuthorizationCode + "&redirect_uri=" + AuthorizationCode + "&grant_type=authorization_code";
            string DataResult = NetworkHandler.GetData(Uri);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<AccessToken>(DataResult);
        }

        public static string GetLatestFitData(AccessToken Token,GoogleFitDataType fitdatatype,DateTime StartDateTick)
        {
            //For UserID as stated in this link : https://developers.google.com/fit/rest/v1/reference/users/dataSources/get
            // the only supported value for the user id is "me".
            //The identity of the user that "me" refers to is conveyed by the OAuth token you pass with your request.
            //If you want to access the data for a user, they will need to grant an OAuth token to you.
            string DataType = "";
            if (fitdatatype == GoogleFitDataType.CaloriesBurned)
            {
                DataType = "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended";
            }            
            string Uri = "https://fitness.googleapis.com/fitness/v1/users/me/dataSources/"+DataType+"/datasets/"+GetUtcNS(StartDateTick)+ "-"+ GetUtcNS(DateTime.Now);
            string DataResult = NetworkHandler.GetData(Uri);
            GoogleFitDataResult fitdataresult = Newtonsoft.Json.JsonConvert.DeserializeObject<GoogleFitDataResult>(DataResult);
            return fitdataresult.insertedDataPoint.Sum(i => i.value.FirstOrDefault().fpVal).ToString();                        
        }

        private static long GetUtcNS(DateTime dt)
        {
            var st = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var t = (dt.ToUniversalTime() - st);
            return Convert.ToInt64(t.TotalMilliseconds) * 1000000;
        }
    }

    public class NetworkHandler
    {
        public static string GetData(string Uri)
        {
            return GetData(Uri, "");
        }
        public static string GetData(string Uri, string Authorization)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Uri);
            request.Method = "GET";
            request.ContentType = "application/json";

            if (Authorization != "")
                request.Headers.Add("Authorization", Authorization);

            HttpWebResponse response = null;

            try
            {
                response = (HttpWebResponse)request.GetResponse();
                //Proecess the resppnse stream... (could be JSON, XML or HTML etc..._
                using (Stream responseStream = response.GetResponseStream())
                {
                    if (responseStream != null)
                    {
                        using (StreamReader reader = new StreamReader(responseStream))
                        {
                            return reader.ReadToEnd();
                        }
                    }
                    else
                    {
                        throw new Exception("Response not available");
                    }
                }
            }
            catch (Exception ex)
            {
                if (response != null)
                {
                    ((IDisposable)response).Dispose();
                }
                throw new Exception(ex.Message);
            }
            finally
            {
                if (response != null)
                {
                    ((IDisposable)response).Dispose();
                }
            }
            //Authorization Header
        }
    }

    public class AccessToken
    {
        public string access_token { get; set; }
        public string scope { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string refresh_token { get; set; }
    }

    public class Value
    {
        public List<object> mapVal { get; set; }
        public double fpVal { get; set; }
    }

    public class DeletedDataPoint
    {
        public string modifiedTimeMillis { get; set; }
        public string startTimeNanos { get; set; }
        public string endTimeNanos { get; set; }
        public List<Value> value { get; set; }
        public string dataTypeName { get; set; }
        public string originDataSourceId { get; set; }
    }

    public class InsertedDataPoint
    {
        public string modifiedTimeMillis { get; set; }
        public string startTimeNanos { get; set; }
        public string endTimeNanos { get; set; }
        public List<Value> value { get; set; }
        public string dataTypeName { get; set; }
        public string originDataSourceId { get; set; }
    }

    public class GoogleFitDataResult
    {
        public string nextPageToken { get; set; }
        public List<DeletedDataPoint> deletedDataPoint { get; set; }
        public string dataSourceId { get; set; }
        public List<InsertedDataPoint> insertedDataPoint { get; set; }
    }
}