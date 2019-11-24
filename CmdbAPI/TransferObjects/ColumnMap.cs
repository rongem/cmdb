using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.TransferObjects
{
    [DataContract]
    [Serializable]
    public class ColumnMap
    {
        [DataMember]
        public int number;

        [DataMember]
        public string name;

        [DataMember]
        public string caption;
    }
}
