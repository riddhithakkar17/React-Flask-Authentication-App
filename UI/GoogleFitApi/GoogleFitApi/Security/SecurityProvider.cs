
using GoogleFitApi.Models;
using GoogleFitApi.Provider;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace GoogleFitApi.Security
{
    public class SecurityProvider
    {                
        public static Player GetUserFromAuthorizationCode(string authorizationCode)
        {
            string Data = Decrypt(authorizationCode);
            string[] DataPart = Data.Split(new string[] { "|" }, StringSplitOptions.None);
            int PlayerID = Config.ConvertToInt32(DataPart[0]);
            string Username = DataPart[1];
            string Password = DataPart[2];
            Player player = new FitPlayEntities().Players.Find(PlayerID);            
            if (player != null)
            {
                if (player.Email == Username && player.Password == CamputeHash(Password))
                {
                    return player;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }                

        internal static string CamputeHash(string Content)
        {
            if (Content == "FitPlay_InitialPass")
            {
                return Content;
            }
            else
            {
                byte[] HardwareIDBytes = System.Text.Encoding.ASCII.GetBytes(Content);
                System.Security.Cryptography.MD5 MyMD5Algorithm = System.Security.Cryptography.MD5.Create();
                byte[] HashedHID = MyMD5Algorithm.ComputeHash(HardwareIDBytes);
                string Key = System.Text.Encoding.ASCII.GetString(HashedHID);
                return Key;
            }
        }

        internal static string GenerateAuthorizationCode(int UserID, string Username, string Password)
        {
            string Data = UserID + "|" + Username + "|" + Password;
            return Encrypt(Data);
        }        

        private const string ENCRYPTION_KEY = "FitPlaySec_2239";

        #region Encryption/decryption

        /// <summary>
        /// The salt value used to strengthen the encryption.
        /// </summary>
        private readonly static byte[] SALT = Encoding.ASCII.GetBytes(ENCRYPTION_KEY.Length.ToString());

        /// <summary>
        /// Encrypts any string using the Rijndael algorithm.
        /// </summary>
        /// <param name="inputText">The string to encrypt.</param>
        /// <returns>A Base64 encrypted string.</returns>
        public static string Encrypt(string inputText)
        {
            RijndaelManaged rijndaelCipher = new RijndaelManaged();
            byte[] plainText = Encoding.Unicode.GetBytes(inputText);
            PasswordDeriveBytes SecretKey = new PasswordDeriveBytes(ENCRYPTION_KEY, SALT);

            using (ICryptoTransform encryptor = rijndaelCipher.CreateEncryptor(SecretKey.GetBytes(32), SecretKey.GetBytes(16)))
            {
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(plainText, 0, plainText.Length);
                        cryptoStream.FlushFinalBlock();
                        return Convert.ToBase64String(memoryStream.ToArray());
                    }
                }
            }
           // File.WriteAllText(HttpContext.Current.Server.MapPath("LatestEncrytedPlain.txt"), inputText);
        }

        /// <summary>
        /// Decrypts a previously encrypted string.
        /// </summary>
        /// <param name="inputText">The encrypted string to decrypt.</param>
        /// <returns>A decrypted string.</returns>
        public static string Decrypt(string inputText)
        {

           
                inputText = inputText.Replace(" ", "+");
                RijndaelManaged rijndaelCipher = new RijndaelManaged();
                byte[] encryptedData = Convert.FromBase64String(inputText);
                PasswordDeriveBytes secretKey = new PasswordDeriveBytes(ENCRYPTION_KEY, SALT);

                using (ICryptoTransform decryptor = rijndaelCipher.CreateDecryptor(secretKey.GetBytes(32), secretKey.GetBytes(16)))
                {
                    using (MemoryStream memoryStream = new MemoryStream(encryptedData))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            byte[] plainText = new byte[encryptedData.Length];
                            int decryptedCount = cryptoStream.Read(plainText, 0, plainText.Length);
                            return Encoding.Unicode.GetString(plainText, 0, decryptedCount);
                        }
                    }
                }
           
        }

        #endregion
    }
}