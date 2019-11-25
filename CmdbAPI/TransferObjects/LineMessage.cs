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
    public class LineMessage
    {
        [DataMember]
        public int index;

        [DataMember]
        public string message;

        [DataMember]
        public string subject;

        [DataMember]
        public string details;
        public enum Severity
        {
            info = 0,
            warning,
            error,
            fatal,
        }

        [DataMember]
        public Severity severity;
    }
}
