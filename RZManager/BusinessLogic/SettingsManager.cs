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
        /// <param name="assystGuiPath">Pfad zur WebGui zur Anzeige eines Objekts</param>
        /// <param name="departmentId">ID der Abteilung, die als Standard gesetzt werden soll</param>
        internal static void ChangeSettings(int MinimumHeight, string assystGuiPath, int departmentId)
        {
            bool changed = false;
            if (Properties.Settings.Default.MinimumHeight != MinimumHeight)
            {
                Properties.Settings.Default.MinimumHeight = MinimumHeight;
                changed = true;
            }
            if (Properties.Settings.Default.assystWebGuiPath != assystGuiPath)
            {
                Properties.Settings.Default.assystWebGuiPath = assystGuiPath;
                changed = true;
            }
            if (Properties.Settings.Default.ownDepartmentId != departmentId)
            {
                Properties.Settings.Default.ownDepartmentId = departmentId;
                changed = true;
            }
            if (changed)
                Properties.Settings.Default.Save();
        }
    }
}
