using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class ConnectionRule
    {
        [DataMember]
        public Guid RuleId { get; set; }

        [DataMember]
        public Guid ItemUpperType { get; set; }

        [DataMember]
        public Guid ConnType { get; set; }

        [DataMember]
        public Guid ItemLowerType { get; set; }

        [DataMember]
        public int MaxConnectionsToUpper { get; set; }

        [DataMember]
        public int MaxConnectionsToLower { get; set; }

        [DataMember]
        public string ValidationExpression { get; set; }
    }
}
