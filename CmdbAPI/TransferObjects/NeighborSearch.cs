using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class NeighborSearch
    {
        [DataMember]
        public Guid SourceItem { get; set; }

        [DataMember]
        public Guid ItemType { get; set; }

        [DataMember]
        public int MaxLevels { get; set; }

        [DataMember]
        public Direction SearchDirection { get; set; }

        [DataMember]
        public Search ExtraSearch { get; set; }

    }
}
