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
    /// <summary>
    /// Liefert ein Objekt zurück, dass Benutzerinformationen aus dem AD liest
    /// </summary>
    public class UserInfo
    {
        [DataMember]
        /// <summary>
        /// Anzeigename
        /// </summary>
        public string DisplayName;

        [DataMember]
        /// <summary>
        /// Kontoname
        /// </summary>
        public string AccountName;

        [DataMember]
        /// <summary>
        /// eMail-Adresse
        /// </summary>
        public string Mail;

        [DataMember]
        /// <summary>
        /// Telefonnummern
        /// </summary>
        public string Phone;

        [DataMember]
        /// <summary>
        /// Büroadresse
        /// </summary>
        public string Office;
    }
}
