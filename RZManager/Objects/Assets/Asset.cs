using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public abstract class Asset
    {
        /// <summary>
        /// assyst-Id
        /// </summary>
        public int id { get; set; }

        /// <summary>
        /// Name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Status
        /// </summary>
        public AssetStatus Status { get; set; }

        /// <summary>
        /// Seriennummer
        /// </summary>
        public string Serialnumber { get; set; }

        /// <summary>
        /// assyst-Id des Raums
        /// </summary>
        public int RoomId { get; set; }

        /// <summary>
        /// assyst-Id des Produkts
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Produktbezeichnung
        /// </summary>
        public string ProductName { get; set; }

        /// <summary>
        /// Name des Typs
        /// </summary>
        public virtual string TypeName
        {
            get { return this.GetType().Name; }
            set { }
        }
    }
}
