using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    /// <summary>
    /// Transferobjekt für Attribute von Configuration Items
    /// </summary>
    [Serializable]
    [DataContract]
    public class ItemAttribute
    {
        [DataMember]
        public Guid AttributeId { get; set; }

        [DataMember]
        public Guid ItemId { get; set; }

        [DataMember]
        public Guid AttributeTypeId { get; set; }

        [DataMember]
        public string AttributeTypeName { get; set; }

        [DataMember]
        public string AttributeValue { get; set; }

        [DataMember]
        public DateTime AttributeLastChange { get; set; }

        [DataMember]
        public int AttributeVersion { get; set; }

    }
}
