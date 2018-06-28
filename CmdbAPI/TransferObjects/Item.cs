using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    public class Item
    {
        [DataContract]
        public class Attribute
        {
            [DataMember]
            public string type;

            [DataMember]
            public string value;
        }

        [DataContract]
        public class Connection
        {
            [DataMember]
            public Guid targetId;

            [DataMember]
            public string targetType;

            [DataMember]
            public string targetName;

            [DataMember]
            public string connectionType;

            [DataMember]
            public string description;
        }

        [DataContract]
        public class Link
        {
            [DataMember]
            public string uri;

            [DataMember]
            public string description;
        }

        [DataContract]
        public class Responsibility
        {
            [DataMember]
            public string name;

            [DataMember]
            public string mail;

            [DataMember]
            public string phone;

            [DataMember]
            public string office;
        }

        [DataMember]
        public string type;

        [DataMember]
        public string name;

        [DataMember]
        public List<Attribute> attributes;

        [DataMember]
        public List<Connection> connectionsToUpper;

        [DataMember]
        public List<Connection> connectionsToLower;

        [DataMember]
        public List<Link> links;

        [DataMember]
        public List<Responsibility> responsibilities;
    }
}
