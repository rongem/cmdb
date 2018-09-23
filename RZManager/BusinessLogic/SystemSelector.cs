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
        /// Enthält einen Endpunkt für die Kommunikation mit der CMDB
        /// </summary>
        public class CmdbSystem
        {
            /// <summary>
            /// Name der CMDB
            /// </summary>
            public string Name { get; set; }

            /// <summary>
            /// URL der CMDB
            /// </summary>
            public Uri Uri { get; set; }
        }
        /// <summary>
        /// Liest die assyst-Systeme aus der konfigurierten Datei aus und gibt sie zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<CmdbSystem> GetConfiguredSystems()
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
                    Uri uri;
                    if (Uri.TryCreate(node.Attributes["Url"].Value, UriKind.Absolute, out uri))
                    {
                        yield return new CmdbSystem()
                        {
                            Name = node.Attributes["Name"].Value,
                            Uri = uri,
                        };
                    }
                }
            }
        }

        /// <summary>
        /// Liefert das einzige System zurück, wenn nur eines konfiguriert ist, und öffnet ansonsten den Auswahldialog.
        /// Sofern kein System gewählt wurde, wird null zurückgegeben.
        /// </summary>
        /// <returns></returns>
        public static CmdbSystem GetSelectedSystem()
        {
            IEnumerable<CmdbSystem> systems = GetConfiguredSystems();
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
        /// <param name="cmdbSystems"></param>
        /// <returns></returns>
        public static bool WriteConfiguredSystems(IEnumerable<CmdbSystem> cmdbSystems)
        {
            if (cmdbSystems == null || cmdbSystems.Count() == 0)
                return false;
            System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
            xdoc.AppendChild(xdoc.CreateXmlDeclaration("1.0", "UTF-8", "yes"));
            System.Xml.XmlNode root = xdoc.AppendChild(xdoc.CreateElement("Systems"));
            foreach (CmdbSystem s in cmdbSystems)
            {
                System.Xml.XmlNode node = xdoc.CreateElement("System");
                node.Attributes.Append(DataHub.CreateXmlAttribute(xdoc, "Name", s.Name));
                node.Attributes.Append(DataHub.CreateXmlAttribute(xdoc, "Url", s.Uri.ToString()));
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
        public static bool TryAssystSystemValues(CmdbSystem system)
        {
            try
            {
                CmdbClient.DataWrapper dw = new CmdbClient.DataWrapper(system.Uri.ToString());
                dw.GetRoleForUser();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
