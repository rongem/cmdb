using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataObjects
{
    [Serializable]
    [DataContract]
    public class ConnectionRuleFilterExtender : ConnectionRule
    {
        [DataMember]
        public string ItemUpperTypeName { get; set; }
        [DataMember]
        public string ItemLowerTypeName { get; set; }
        [DataMember]
        public string ConnTypeName { get; set; }
        [DataMember]
        public int ExistingConnections { get; set; }
    }
}
