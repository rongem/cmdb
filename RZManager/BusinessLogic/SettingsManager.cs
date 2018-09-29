using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    internal static class SettingsManager
    {
        /// <summary>
        /// Speichert die Einstellungen
        /// </summary>
        /// <param name="MinimumHeight">Minimale Höhe einer Höheneinheit im Rack</param>
        internal static void ChangeSettings(int MinimumHeight)
        {
            bool changed = false;
            if (Properties.Settings.Default.MinimumHeight != MinimumHeight)
            {
                Properties.Settings.Default.MinimumHeight = MinimumHeight;
                changed = true;
            }
            if (changed)
                Properties.Settings.Default.Save();
        }
    }
}
