using CmdbAPI.Security;
using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class UserRoleMapping
    {
        [DataMember]
        public string Username { get; set; }

        [DataMember]
        public bool IsGroup { get; set; }

        [DataMember]
        public UserRole Role { get; set; }
    }
}
