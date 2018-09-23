using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public abstract class Asset : NamedObject
    {
        /// <summary>
        /// Status
        /// </summary>
        public AssetStatus Status { get; set; }

        /// <summary>
        /// Seriennummer
        /// </summary>
        public string Serialnumber { get; set; }

        /// <summary>
        /// Hersteller
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// Modell (Gerätetyp)
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Typ des Asset
        /// </summary>
        public NamedObject AssetType { get; set; }

        /// <summary>
        /// Name des Typs
        /// </summary>
        public virtual string TypeName
        {
            get { return AssetType.Name; }
            set { }
        }
    }
}
