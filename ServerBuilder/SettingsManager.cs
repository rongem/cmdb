using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerBuilder
{
    internal static class SettingsManager
    {
        /// <summary>
        /// Gibt die URL zurück, die zusammen mit der ID zur Ansicht der CMDB aufgerufen wird
        /// </summary>
        internal static string CmdbUrl
        {
            get { return Properties.Settings.Default["CmdbUrl"].ToString(); }
            set
            {
                Properties.Settings.Default["CmdbUrl"] = value;
                Properties.Settings.Default.Save();
            }
        }
    }
}
