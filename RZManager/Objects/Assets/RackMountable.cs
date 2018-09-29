using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public abstract class RackMountable : Asset
    {
        /// <summary>
        /// Verbindung zum Rack
        /// </summary>
        public AssetConnection ConnectionToRack { get; set; }
    }
}
