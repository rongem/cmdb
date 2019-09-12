using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    /// <summary>
    /// Transferobjekt für Configuration Items
    /// </summary>
    [Serializable]
    [DataContract]
    public class ConfigurationItem
    {
        [DataMember]
        public Guid ItemId { get; set; }

        [DataMember]
        public Guid ItemType { get; set; }

        [DataMember]
        public string TypeName { get; set; }

        [DataMember]
        public string ItemName { get; set; }

        [DataMember]
        public string ItemLastChange { get; set; }

        [DataMember]
        public int ItemVersion { get; set; }

        [DataMember]
        public string[] ResponsibleUsers { get; set; }
    }
}
