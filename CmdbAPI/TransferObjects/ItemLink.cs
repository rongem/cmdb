using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class ItemLink
    {
        [DataMember]
        public Guid LinkId { get; set; }

        [DataMember]
        public Guid ItemId { get; set; }

        [DataMember]
        public string LinkURI { get; set; }

        [DataMember]
        public string LinkDescription { get; set; }
    }
}
