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
    public class HistoricConfigurationItem
    {
        [DataContract]
        public class HistoricItem
        {
            [DataMember]
            public Guid TypeId { get; set; }

            [DataMember]
            public string TypeName { get; set; }

            [DataMember]
            public string OldName { get; set; }

            [DataMember]
            public string NewName { get; set; }

            [DataMember]
            public string ChangeDate { get; set; }

            [DataMember]
            public string ChangedByToken { get; set; }

        }

        [DataContract]
        public class HistoricAttribute
        {
            [DataMember]
            public Guid Id { get; set; }

            [DataMember]
            public Guid TypeId { get; set; }

            [DataMember]
            public string TypeName { get; set; }

            [DataMember]
            public Guid ItemId { get; set; }

            [DataMember]
            public string OldValue { get; set; }

            [DataMember]
            public string NewValue { get; set; }

            [DataMember]
            public string ChangeDate { get; set; }

            [DataMember]
            public string ChangedByToken { get; set; }
        }

        [DataContract]
        public class HistoricConnection
        {
            [DataMember]
            public Guid Id { get; set; }

            [DataMember]
            public Guid TypeId { get; set; }

            [DataMember]
            public string TypeName { get; set; }

            [DataMember]
            public Guid RuleId { get; set; }

            [DataMember]
            public Guid TargetItemId { get; set; }

            [DataMember]
            public string Description { get; set; }

            [DataMember]
            public string Action { get; set; }

            [DataMember]
            public string ChangeDate { get; set; }

            [DataMember]
            public string ChangedByToken { get; set; }
        }

        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string CurrentTypeName { get; set; }

        [DataMember]
        public bool activeItemPresent { get; set; }

        [DataMember]
        public ConfigurationItem activeItem { get; set; }

        [DataMember]
        public HistoricItem[] ItemChanges { get; set; }

        [DataMember]
        public HistoricAttribute[] Attributes { get; set; }

        [DataMember]
        public HistoricConnection[] Connections { get; set; }

    }
}
