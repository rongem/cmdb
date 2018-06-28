using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class ItemResponsibility
    {
        [DataMember]
        public Guid ItemId { get; set; }

        [DataMember]
        public string ResponsibleToken { get; set; }
    }
}
