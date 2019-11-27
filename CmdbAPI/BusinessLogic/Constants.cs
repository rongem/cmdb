using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.BusinessLogic
{
    public static class Constants
    {
        /// <summary>
        /// Gibt den String zurück, der zum MIME-Typ für Excel-Arbeitsmappen (XSLX) passt.
        /// </summary>
        public static readonly string Excel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        /// <summary>
        /// Gibt den String zurück, der zum MIME-Typ für CSV passt
        /// </summary>
        public static readonly string Csv = "text/comma-separated-value";

        /// <summary>
        /// Gibt den STring zurück, der zum MIME-Typ für GraphML passt
        /// </summary>
        public static readonly string GraphML = "application/graphml+xml";

        /// <summary>
        /// Gibt den String zurück, nach dem Datumswerte formatiert bzw. deserialisiert werden
        /// </summary>
        public static readonly string JSONFormatString = "yyyy-MM-dd HH:mm:ss zz";

    }
}
