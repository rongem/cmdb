using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class ItemType
    {
        [DataMember]
        public Guid TypeId { get; set; }

        [DataMember]
        public string TypeName { get; set; }

        [DataMember]
        public string TypeBackColor { get; set; }
    }
}
