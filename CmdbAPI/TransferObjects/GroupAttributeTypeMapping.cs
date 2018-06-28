using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class GroupAttributeTypeMapping
    {
        [DataMember]
        public Guid GroupId { get; set; }

        [DataMember]
        public Guid AttributeTypeId { get; set; }
    }
}
