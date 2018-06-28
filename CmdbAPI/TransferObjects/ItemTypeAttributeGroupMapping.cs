using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class ItemTypeAttributeGroupMapping
    {
        [DataMember]
        public Guid GroupId { get; set; }

        [DataMember]
        public Guid ItemTypeId { get; set; }
    }
}
