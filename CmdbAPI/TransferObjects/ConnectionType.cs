using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class ConnectionType
    {
        [DataMember]
        public Guid ConnTypeId { get; set; }

        [DataMember]
        public string ConnTypeName { get; set; }

        [DataMember]
        public string ConnTypeReverseName { get; set; }
    }
}
