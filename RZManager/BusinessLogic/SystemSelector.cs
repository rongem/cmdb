using assystConnector;
using RZManager.BusinessLogic;
using RZManager.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    public static class SystemSelector
    {
        /// <summary>
        /// Liest die assyst-Systeme aus der konfigurierten Datei aus und gibt sie zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<assystSystem> GetConfiguredSystems()
        {
            System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
            if (System.IO.File.Exists(Properties.Settings.Default.SystemsFile))
            {
                try
                {
                    xdoc.Load(Properties.Settings.Default.SystemsFile);
                }
                catch
                {
                    yield break;
                }
                foreach (System.Xml.XmlNode node in xdoc.SelectNodes("//System"))
                {
                    yield return new assystSystem()
                    {
                        Name = node.Attributes["Name"].Value,
                        Url = node.Attributes["Url"].Value,
                        UserName = node.Attributes["User"].Value,
                        Password = node.Attributes["Password"].Value,
                    };
                }
            }
        }

        /// <summary>
        /// Liefert das einzige System zurück, wenn nur eines konfiguriert ist, und öffnet ansonsten den Auswahldialog.
        /// Sofern kein System gewählt wurde, wird null zurückgegeben.
        /// </summary>
        /// <returns></returns>
        public static assystSystem GetSelectedSystem()
        {
            IEnumerable<assystSystem> systems = GetConfiguredSystems();
            if (systems.Count() == 1)
                return systems.First();
            SystemsWindow w = new SystemsWindow(true);
            if (w.ShowDialog() == true)
            {
                return w.SelectedSystem;
            }
            return null;
        }

        /// <summary>
        /// Schreibt die Liste der assyst-Systeme als XML-Datei in die Konfiguration
        /// </summary>
        /// <param name="assystSystems"></param>
        /// <returns></returns>
        public static bool WriteConfiguredSystems(IEnumerable<assystSystem> assystSystems)
        {
            if (assystSystems == null || assystSystems.Count() == 0)
                return false;
            System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
            xdoc.AppendChild(xdoc.CreateXmlDeclaration("1.0", "UTF-8", "yes"));
            System.Xml.XmlNode root = xdoc.AppendChild(xdoc.CreateElement("Systems"));
            foreach (assystSystem s in assystSystems)
            {
                System.Xml.XmlNode node = xdoc.CreateElement("System");
                node.Attributes.Append(DataHub.CreateXmlAttribute(xdoc, "Name", s.Name));
                node.Attributes.Append(DataHub.CreateXmlAttribute(xdoc, "Url", s.Url));
                node.Attributes.Append(DataHub.CreateXmlAttribute(xdoc, "User", s.UserName));
                node.Attributes.Append(DataHub.CreateXmlAttribute(xdoc, "Password", s.Password));
                root.AppendChild(node);
            }
            try
            {
                xdoc.Save(Properties.Settings.Default.SystemsFile);
            }
            catch
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Überprüft, ob eine Systemkonfiguration funktioniert.
        /// </summary>
        /// <param name="system"></param>
        /// <returns></returns>
        public static bool TryAssystSystemValues(assystSystem system)
        {
            try
            {
                assystConnector.RestApiConnector rac = new assystConnector.RestApiConnector(system.Url, system.UserName, system.Password);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
