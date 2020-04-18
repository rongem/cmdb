using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class Search
    {
        [DataMember]
        public string NameOrValue { get; set; }

        [DataMember]
        public Guid? ItemType { get; set; }

        [Serializable]
        [DataContract]
        public class SearchAttribute
        {
            [DataMember]
            public Guid AttributeTypeId { get; set; }

            [DataMember]
            public string AttributeValue { get; set; }
        }

        [DataMember]
        public SearchAttribute[] Attributes { get; set; }

        [Serializable]
        [DataContract]
        public class SearchConnection
        {
            [DataMember]
            public Guid ConnectionType { get; set; }

            [DataMember]
            public Guid? ConfigurationItemType { get; set; }

            [DataMember]
            public string Count { get; set; }
        }

        [DataMember]
        public SearchConnection[] ConnectionsToUpper { get; set; }

        [DataMember]
        public SearchConnection[] ConnectionsToLower { get; set; }

        [DataMember]
        public string ResponsibleToken { get; set; }

        [DataMember]
        public long? ChangedBefore { get; set; }

        [DataMember]
        public long? ChangedAfter { get; set; }
    }
}
