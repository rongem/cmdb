using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class NamedObject
    {
        /// <summary>
        /// Id des Objekts
        /// </summary>
        public Guid id { get; set; }

        /// <summary>
        /// Name
        /// </summary>
        public string Name { get; set; }

    }
}
