using assystConnector.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using RZManager.Objects;
using RZManager.Objects.Assets;
using assystConnector;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        #region Properties
        private static Properties.Settings s = Properties.Settings.Default; // Abkürzung zu den Settings

        private static DataHub hub;

        /// <summary>
        /// Die vom Hub verwendete Assyst-System-Url
        /// </summary>
        public string AssystSystemBaseUrl { get; private set; }

        /// <summary>
        /// Gibt an, ob die Basis-Initialisierung abgeschlossen ist
        /// </summary>
        private bool initFinished = false;

        private List<Objects.Assets.Room> rooms;
        private List<Rack> racks;
        private List<BladeEnclosure> bladeEnclosures;
        private List<RackServer> rackServers;
        private List<BladeServer> bladeServers;
        private List<BladeAppliance> bladeAppliances;
        private List<BladeInterconnect> bladeInterconnects;
        private List<ProvisionedSystem> provisionedSystems;
        private List<PDU> pdus;
        private List<SanSwitch> sanSwitches;
        private List<StorageSystem> storageSystems;
        private List<BackupSystem> backupSystems;
        private List<HardwareAppliance> hardwareAppliances;
        private List<BlockedUnit> blockedUnits;
        private List<GenericRackMountable> genericRackMountables;

        private List<ItemRelation> relationsToRack, relationsToBladeEnclosure, relationsToProvisionable;

        private List<string> runningThread = new List<string>(5);

        private Dictionary<string, int> itemStatusValues;
        private Dictionary<int, string> itemStatusNames;

        private List<Supplier> suppliers;
        private List<ProductClass> productClasses;
        /// <summary>
        /// Liste der vorhandenen Produkte
        /// </summary>
        public List<Product> Products { get; private set; }

        private int shippingNoteProductId, serviceContractProductId;

        private assystConnector.RestApiConnector assystRestConnector;

        private Dictionary<string, Asset> SerialLookup;

        /// <summary>
        /// Vorlagen für Enclosures aus der Konfigurationsdatei
        /// </summary>
        private List<EnclosureTypeTemplate> enclosureTypeTemplates = new List<EnclosureTypeTemplate>();

        /// <summary>
        /// Vorhandene Enclosure-Typen
        /// </summary>
        private List<EnclosureType> enclosureTypes = new List<EnclosureType>();

        /// <summary>
        /// Liste aller bekannten Enclosure-Types, die aus den entsprechenden Produkten generiert werden
        /// </summary>
        public IEnumerable<EnclosureTypeTemplate> EnclosureTypes { get { return enclosureTypes.OrderBy(t => t.Name); } }

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
        private Dictionary<int, Asset> assetsForItemId;

        /// <summary>
        /// Abteilung, die als Standard gesetzt wird, wenn keine Information zur Abteilung vorliegt
        /// </summary>
        public Department DefaultDepartment { get; private set; }

        /// <summary>
        /// Verbindungstypen
        /// </summary>
        public IEnumerable<RelationType> RelationTypes { get; private set; }

        /// <summary>
        /// Verbindungstypen
        /// </summary>
        private RelationType mountingRelType, provisioningRelType;
        private RelationDetail mountUpperItemDetail, mountLowerItemDetail, provisioningUpperItemDetail, provisioningLowerItemDetail;

        /// <summary>
        /// Liste aller Hardware-Typen
        /// </summary>
        private string[] DataCenterHardwareProductClasses = new string[] { s.HardwareApplianceProductClassName, s.BackupProductName, s.BladeEnclosureProductClassName, s.BladeInterconnectProductClassName,
            s.BladeServerHardwareProductClassName, s.PDUItemTypeName, s.RackProductClassName, s.RackServerHardwareProductClassName, s.SanSwitchProductClassName, s.StorageProductClassName };

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

        public delegate void ShipmentItemCreatedHandler(Item item);

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

            assystSystem sys = SystemSelector.GetSelectedSystem();

            if (sys == null)
                throw new Exception("Es wurde kein gültiges assyst-System ausgewählt.");

            AssystSystemBaseUrl = sys.Url;

            assystRestConnector = new assystConnector.RestApiConnector(sys.Url, sys.UserName, sys.Password);

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
                itemStatusValues = GetItemStatuses(out itemStatusNames);

                DefaultDepartment = assystRestConnector.GetDepartment(s.ownDepartmentId);

                RelationTypes = assystRestConnector.GetRelationTypes();

                mountingRelType = RelationTypes.Single(rt => rt.shortCode.Equals(s.MountingRelationType, StringComparison.CurrentCultureIgnoreCase));

                mountUpperItemDetail = assystRestConnector.GetRelationDetailsByRelationType(mountingRelType.id).Single(d => d.relationshipRole == 1);
                mountLowerItemDetail = assystRestConnector.GetRelationDetailsByRelationType(mountingRelType.id).Single(d => d.relationshipRole == 2);

                provisioningRelType = RelationTypes.Single(rt => rt.shortCode.Equals(s.ProvisioningRelationType, StringComparison.CurrentCultureIgnoreCase));

                provisioningUpperItemDetail = assystRestConnector.GetRelationDetailsByRelationType(provisioningRelType.id).Single(d => d.relationshipRole == 1);
                provisioningLowerItemDetail = assystRestConnector.GetRelationDetailsByRelationType(provisioningRelType.id).Single(d => d.relationshipRole == 2);

                assystConnector.Objects.Room room = assystRestConnector.GetRoom(s.StoreRoomId);
                DefaultStoreRoom = new Objects.Assets.Room() { id = room.id, BuildingName = room.buildingShortCode, Name = room.roomName, };

                shippingNoteProductId = assystRestConnector.GetProductByName(s.ShippingNoteProductName).id;

                serviceContractProductId = assystRestConnector.GetProductByName(s.ServiceContractProductName).id;

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

        /// <summary>
        /// Gibt einen Zulu-String für ein Datum zurück
        /// </summary>
        /// <param name="dt">Datum</param>
        /// <returns></returns>
        public string GetDateZuluString(DateTime dt)
        {
            return assystConnector.RestApiConnector.GetDateZuluString(dt);
        }
    }
}
