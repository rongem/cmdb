using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    /// <summary>
    /// Transferobjekt für Verbindungen zwischen Configuration Items
    /// </summary>
    [Serializable]
    [DataContract]
    public class Connection
    {

        [DataMember]
        public Guid ConnId { get; set; }

        [DataMember]
        public Guid ConnType { get; set; }

        /*[DataMember]
        public string ConnTypeName { get; set; }

        [DataMember]
        public string ConnTypeReverseName { get; set; }*/

        [DataMember]
        public Guid ConnUpperItem { get; set; }

        [DataMember]
        public Guid ConnLowerItem { get; set; }

        [DataMember]
        public Guid RuleId { get; set; }

        [DataMember]
        public string Description { get; set; }

    }
}
