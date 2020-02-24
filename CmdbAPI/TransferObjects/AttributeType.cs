using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class AttributeType
    {
        [DataMember]
        public Guid TypeId { get; set; }

        [DataMember]
        public string TypeName { get; set; }

        [DataMember]
        public Guid AttributeGroup { get; set; }

        [DataMember]
        public string ValidityRule { get; set; }
    }
}
