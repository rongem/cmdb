using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.TransferObjects
{
    /// <summary>
    /// Gibt alle Meta-Informationen in einem Objekt zurück
    /// </summary>
    [Serializable]
    [DataContract]
    public class MetaData
    {
        [DataMember]
        public AttributeGroup[] attributeGroups;

        [DataMember]
        public AttributeType[] attributeTypes;

        [DataMember]
        public ItemTypeAttributeGroupMapping[] itemTypeAttributeGroupMappings;

        [DataMember]
        public ConnectionRule[] connectionRules;

        [DataMember]
        public ConnectionType[] connectionTypes;

        [DataMember]
        public ItemType[] itemTypes;

        [DataMember]
        public string userName;

        [DataMember]
        public Security.UserRole userRole;
    }
}
