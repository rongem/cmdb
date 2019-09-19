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
            public Guid id;

            [DataMember]
            public Guid typeId;

            [DataMember]
            public string type;

            [DataMember]
            public string value;

            [DataMember]
            public string lastChange;

            [DataMember]
            public int version;
        }

        [DataContract]
        public class Connection
        {
            [DataMember]
            public Guid id;

            [DataMember]
            public Guid targetId;

            [DataMember]
            public Guid targetTypeId;

            [DataMember]
            public string targetType;

            [DataMember]
            public string targetName;

            [DataMember]
            public string targetColor;

            [DataMember]
            public string connectionType;

            [DataMember]
            public Guid typeId;

            [DataMember]
            public Guid ruleId;

            [DataMember]
            public string description;
        }

        [DataContract]
        public class Link
        {
            [DataMember]
            public Guid id;

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
            public string account;

            [DataMember]
            public string mail;

            [DataMember]
            public string phone;

            [DataMember]
            public string office;

            [DataMember]
            public bool invalidAccount;
        }

        [DataMember]
        public Guid id;

        [DataMember]
        public string type;

        [DataMember]
        public Guid typeId;

        [DataMember]
        public string name;

        [DataMember]
        public string color;

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

        [DataMember]
        public string lastChange;

        [DataMember]
        public int version;

        [DataMember]
        public bool userIsResponsible;
    }
}
