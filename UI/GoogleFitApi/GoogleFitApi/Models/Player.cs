//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace GoogleFitApi.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Player
    {
        public int Player_ID { get; set; }
        public string PlayerName { get; set; }
        public Nullable<bool> Gender { get; set; }
        public Nullable<byte> Age { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string AvatarImage { get; set; }
        public string Password { get; set; }
        public string ActivationCode { get; set; }
        public Nullable<bool> IsActivated { get; set; }
        public Nullable<short> Body_Weight { get; set; }
        public Nullable<short> Player_Height { get; set; }
        public Nullable<short> Body_BMI { get; set; }
        public string GoogleAuthorizationCode { get; set; }
    }
}
