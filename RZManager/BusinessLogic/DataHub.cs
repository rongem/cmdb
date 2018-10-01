using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using RZManager.Objects;
using RZManager.Objects.Assets;
using CmdbClient;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        #region Properties
        private static DataHub hub;

        private SystemSelector.CmdbSystem cmdbSystem;

        /// <summary>
        /// Die vom Hub verwendete CMDB-System-Url
        /// </summary>
        public string CmdbSystemBaseUrl { get { return cmdbSystem.Uri.ToString(); } }

        /// <summary>
        /// Gibt an, ob die Basis-Initialisierung abgeschlossen ist
        /// </summary>
        private bool initFinished = false;

        private List<Room> rooms;
        private List<Rack> racks;
        private List<BladeEnclosure> bladeEnclosures;
        private List<RackServer> rackServers;
        private List<BladeServer> bladeServers;
        private List<BladeAppliance> bladeAppliances;
        private List<BladeInterconnect> bladeInterconnects;
        private List<ProvisionedSystem> provisionedSystems;
        private List<PDU> pdus;
        private List<SanSwitch> sanSwitches;
        private List<NetworkSwitch> networkSwitches;
        private List<StorageSystem> storageSystems;
        private List<BackupSystem> backupSystems;
        private List<HardwareAppliance> hardwareAppliances;
        private List<BlockedUnit> blockedUnits;
        //private List<GenericRackMountable> genericRackMountables;

        private List<string> runningThread = new List<string>(5);

        private DataWrapper dataWrapper;

        private Dictionary<string, Asset> SerialLookup;

        /// <summary>
        /// Vorlagen für Enclosures aus der Konfigurationsdatei
        /// </summary>
        private List<EnclosureTypeTemplate> enclosureTypeTemplates = new List<EnclosureTypeTemplate>();

        /// <summary>
        /// Gibt an, ob bei der Initialisierung festgestellt wurde, dass ein Enclosure-Typ nicht konfiguriert ist
        /// </summary>
        public bool EnclosureTypeMissing { get; private set; }

        /// <summary>
        /// Aktive Threads beim Füllen der Daten aus assyst
        /// </summary>
        private List<Type> ActiveWorkers;

        /// <summary>
        /// Nachschlagetabelle für das Item zur bekannten Id
        /// </summary>
        private Dictionary<Guid, Asset> assetsForItemId;

        /// <summary>
        /// Liste aller Hardware-Typen
        /// </summary>
        private string[] DataCenterHardwareProductClasses = new string[] { Settings.Config.ConfigurationItemTypeNames.HardwareAppliance,
            Settings.Config.ConfigurationItemTypeNames.BackupSystem,
            Settings.Config.ConfigurationItemTypeNames.BladeEnclosure,
            Settings.Config.ConfigurationItemTypeNames.BladeInterconnect,
            Settings.Config.ConfigurationItemTypeNames.BladeServerHardware,
            Settings.Config.ConfigurationItemTypeNames.NetworkSwitch,
            Settings.Config.ConfigurationItemTypeNames.PDU,
            Settings.Config.ConfigurationItemTypeNames.Rack,
            Settings.Config.ConfigurationItemTypeNames.RackServerHardware,
            Settings.Config.ConfigurationItemTypeNames.SanSwitch,
            Settings.Config.ConfigurationItemTypeNames.StorageSystem, };

        /// <summary>
        /// Gibt die Liste der zugelassenen Räume zurück
        /// </summary>
        public IEnumerable<Objects.Assets.Room> Rooms { get { return rooms; } }

        /// <summary>
        /// Gibt den Raum zurück, der zur Aufbewahrung von gelagerten Items verwendet wird.
        /// Ist für die Erfassung neuer Lieferungen relevant.
        /// </summary>
        public Objects.Assets.Room DefaultStoreRoom { get; private set; }

        #endregion

        #region Events
        public delegate void ProgressEventHandler(int step, string message);

        public delegate void StepStatusEventHandler(string type);

        public delegate void ShipmentItemCreatedHandler(Asset item);

        /// <summary>
        /// Wird ausgelöst, wenn ein Einzelschritt zum Füllen der internen Datenbank abgeschlossen ist
        /// </summary>
        public event StepStatusEventHandler FillStepCompleted;

        /// <summary>
        /// Wird ausgelöst, wenn ein Einzelschrit zum Füllen der internen Datenbank beginnt
        /// </summary>
        public event StepStatusEventHandler FillStepStarted;

        /// <summary>
        /// Wird ausgelöst, wenn eine neue Phase bei der Initialisierung beginnt
        /// </summary>
        public event ProgressEventHandler NextPhaseStarted;

        /// <summary>
        /// Wird ausgelöst, wenn sich die Datenbasis verändert hat
        /// </summary>
        public event EventHandler DataHasChanged;

        /// <summary>
        /// Wird ausgelöst, wenn die globalen Basis-Werte bei der Initialisierung vorhanden sind
        /// </summary>
        public event EventHandler InitializationCompleted;

        /// <summary>
        /// Wird ausgelöst, wenn ein Item erfolgreich in einer Lieferung angelegt wurde
        /// </summary>
        public event ShipmentItemCreatedHandler ShipmentItemCreated;
        #endregion

        /// <summary>
        /// Singleton-Konstruktor
        /// </summary>
        private DataHub()
        {
            RetrieveEnclosureTypeTemplates();

            cmdbSystem = SystemSelector.GetSelectedSystem();

            if (cmdbSystem == null)
                throw new Exception("Es wurde kein gültiges assyst-System ausgewählt.");

            dataWrapper = new DataWrapper(cmdbSystem.ToString());

            InitBaseValues();

        }

        /// <summary>
        /// Singleton-Aufruf
        /// </summary>
        /// <returns></returns>
        public static DataHub GetInstance()
        {
            if (hub == null)
            {
                hub = new DataHub();
            }
            return hub;
        }

        /// <summary>
        /// Liest die Basis-Werte aus assyst asynchron aus
        /// </summary>
        private void InitBaseValues()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                using (DataWrapper dw = new DataWrapper(cmdbSystem.ToString()))
                {
                    MetaData = new MetaDataCache(dw);
                }
                initFinished = true;
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Löst den Event-Trigger für die Signalisierung von Änderungen an den Daten aus, z. B. nach Neueinlesen
        /// </summary>
        private void OnDataChanged()
        {
            CalculateNumbers();

            if (DataHasChanged != null)
                DataHasChanged(this, EventArgs.Empty);
        }

        /// <summary>
        /// Erzeugt ein XML-Attribut
        /// </summary>
        /// <param name="xdoc">XML-Dokument</param>
        /// <param name="name">Name des XML-Attributs</param>
        /// <param name="value">Wert des XML-Attributs</param>
        /// <returns></returns>
        public static System.Xml.XmlAttribute CreateXmlAttribute(System.Xml.XmlDocument xdoc, string name, string value)
        {
            System.Xml.XmlAttribute att = xdoc.CreateAttribute(name);
            att.Value = value;
            return att;
        }

        /// <summary>
        /// Versucht einen XML-Attributwert zu parsen und das Ergebnis als int zurückzugeben. Gibt 0 zurück, falls das nicht gelingt
        /// </summary>
        /// <param name="att">XML-Attribut</param>
        /// <returns></returns>
        private int SafeIntParse(System.Xml.XmlAttribute att)
        {
            if (att != null)
            {
                int retval = 0;
                if (int.TryParse(att.Value, out retval))
                    return retval;
            }
            return 0;
        }

        /// <summary>
        /// Überladen: Erzeugt den vollen Namen für einen Rack-Server
        /// </summary>
        /// <param name="rackServer">Rackserver</param>
        /// <returns></returns>
        public string GetFullServerName(RackServer rackServer)
        {
            if (rackServer.ConnectionToServer == null)
                return rackServer.Name;
            return string.Format("Rack-Server: {0} ({1})", rackServer.Name, rackServer.ConnectionToServer.FirstItem.Name);
        }

        /// <summary>
        /// Überladen: Erzeugt den vollen Namen für einen Blade-Server
        /// </summary>
        /// <param name="bladeServer">Blade-Server</param>
        /// <returns></returns>
        public string GetFullServerName(BladeServer bladeServer)
        {
            if (bladeServer.ConnectionToServer == null)
                return bladeServer.Name;
            return string.Format("Blade: {0}\r\n{1}", bladeServer.Name, bladeServer.ConnectionToServer.FirstItem.Name);
        }
    }
}
