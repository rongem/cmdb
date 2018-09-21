using System;

namespace RZManager.Objects
{
    /// <summary>
    /// Stellt die Namen der Objekttypen zur Verfügung, die in der CMDB für bestimmte Elemente vorhanden sein müssen
    /// </summary>
    [Serializable]
    public class Settings
    {
        /// <summary>
        /// Stellt die Einstellungen global als statische Klasse bereit
        /// </summary>
        public static Settings Config = (Settings)(new System.Xml.Serialization.XmlSerializer(typeof(Settings))).Deserialize(
            new System.IO.FileStream(Properties.Settings.Default.SettingsFile, System.IO.FileMode.Open));

        /// <summary>
        /// Stellt die Namen der ConfigurationItem-Tyen zur Verfügung
        /// </summary>
        [Serializable]
        public class ConfigurationItems
        {
            /// <summary>
            /// Bezeichnung des Item-Typs für Backup-Systeme (Bandlaufwerke, VTL usw.)
            /// </summary>
            public string BackupSystem { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für BladeAppliances (Composer, Image Streamer usw.)
            /// </summary>
            public string BladeAppliance { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für Blade Enclosures
            /// </summary>
            public string BladeEnclosure { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für Blade-Interconnects (Blade-Switche, Virtual-Connect-Module, Blade-SAN-Switche usw.)
            /// </summary>
            public string BladeInterconnect { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für Blade-Server-Hardware
            /// </summary>
            public string BladeServerHardware { get; set; }

            /// <summary>
            /// Bezeichnug für Bare-Metal-Hypervisoren (ESX-Hosts)
            /// </summary>
            public string BareMetalHypervisor { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für in ein Rack einbaubare Appliances
            /// </summary>
            public string HardwareAppliance { get; set; }

            /// <summary>
            /// Bezeichnung für Netzwerk-Switche
            /// </summary>
            public string NetworkSwitch { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für in ein Rack einbaubare Power Distribution Units (intelligente Steckdosenleisten)
            /// </summary>
            public string PDU { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für 19-Zoll-Racks
            /// </summary>
            public string Rack { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für in ein Rack einbaubare Server-Hardware
            /// </summary>
            public string RackServerHardware { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für Räume
            /// </summary>
            public string Room { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für SAN-Switches
            /// </summary>
            public string SanSwitch { get; set; }

            /// <summary>
            /// Bezeichnung für Server (installierte Betriebssysteminstanzen)
            /// </summary>
            public string Server { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für Wartungsverträge
            /// </summary>
            public string ServiceContract { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für Lieferscheine
            /// </summary>
            public string ShippingNote { get; set; }

            /// <summary>
            /// Bezeichnung für Software-Appliances (die in einer Server-Hardware installiert werden)
            /// </summary>
            public string SoftAppliance { get; set; }

            /// <summary>
            /// Bezeichnung des Item-Typs für in ein Rack einbaubare Storage-Systeme (SAN, NAS usw.)
            /// </summary>
            public string StorageSystem { get; set; }
        }

        /// <summary>
        /// Stellt die Namen der Verbindungstypen zur Verfügung
        /// </summary>
        [Serializable]
        public class ConnectionTypes
        {
            /// <summary>
            /// Stellt Vorwärts- und Rückwärtsnamen für Verbindungstypen bereit
            /// </summary>
            public class ConnectionType
            {
                /// <summary>
                /// Verbindungsname, der vom oberen zum unteren Item verwendet wird
                /// </summary>
                public string TopDownName { get; set; }
                /// <summary>
                /// Verbindungsname, der vom unteren zum oberen Item verwendet wird
                /// </summary>
                public string BottomUpName { get; set; }
            }
            /// <summary>
            /// Bezeichnung des Verbindungstyps für den Einbau
            /// </summary>
            public ConnectionType BuiltIn { get; set; } = new ConnectionType();
            /// <summary>
            /// Bezeichnung des Verbindungstyps für Vertragsbestandteile oder Liefergegenstände
            /// </summary>
            public ConnectionType PartOf { get; set; } = new ConnectionType();

            /// <summary>
            /// Bezeichung des Verbindungstyps für die Bereitstellung von Configuration Items in Server-Hardware
            /// </summary>
            public ConnectionType Provisions { get; set; } = new ConnectionType();
        }

        /// <summary>
        /// Stellt die Namen der Attributtypen zur Verfügung
        /// </summary>
        [Serializable]
        public class AttributeTypes
        {
            /// <summary>
            /// Bezeichnung des Attribut-Typs für die Herstellerbezeichnung
            /// </summary>
            public string Manufacturer { get; set; }

            /// <summary>
            /// Bezeichnung des Attribut-Typs für die Modellbezeichnung
            /// </summary>
            public string Model { get; set; }

            /// <summary>
            /// Bezeichnung des Attribut-Typs für die Seriennummer
            /// </summary>
            public string SerialNumber { get; set; }
        }

        /// <summary>
        /// Stellt die Namen von Attributgruppen zur Verfügung
        /// </summary>
        [Serializable]
        public class AttributeGroups
        {
            /// <summary>
            /// Bezeichnung der Attributgruppe für Hardware-Attribute wie Hersteller, Modell und Seriennummer
            /// </summary>
            public string HardwareAttributes { get; set; }
        }

        /// <summary>
        /// Enthält die Namen der Typen von Configuration Items
        /// </summary>
        public ConfigurationItems ConfigurationItemNames = new ConfigurationItems();

        /// <summary>
        /// Enthält die Namen der Verbindungstypen
        /// </summary>
        public ConnectionTypes ConnectionTypeNames = new ConnectionTypes();

        /// <summary>
        /// Enthält die Namen der Attribut-Typen
        /// </summary>
        public AttributeTypes AttributeTypeNames = new AttributeTypes();

        /// <summary>
        /// Enthält die Namen der Attributgruppen
        /// </summary>
        public AttributeGroups AttributeGroupNames = new AttributeGroups();

        /// <summary>
        /// Verbindungsregeln, die für die Konfiguration benötigt werden
        /// </summary>
        public static class ConnectionRules
        {
            public static class RackMount
            {
                /// <summary>
                /// Verbindungstyp für alle Verbindungen
                /// </summary>
                public static ConnectionTypes.ConnectionType ConnectionType { get { return Config.ConnectionTypeNames.BuiltIn; } }

                /// <summary>
                /// Verbindungsregel zwischen Backup-System und Rack
                /// </summary>
                public static class BackupSystemToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BackupSystem; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Blade-Enclosure und Rack
                /// </summary>
                public static class BladeEnclosureToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeEnclosure; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Hardware-Appliance und Rack
                /// </summary>
                public static class HardwareApplianceToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.HardwareAppliance; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Netzwerk-Switch und Rack
                /// </summary>
                public static class NetworkSwitchToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.NetworkSwitch; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen PDU und Rack
                /// </summary>
                public static class PDUToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.PDU; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Rack-Server-Hardware und Rack
                /// </summary>
                public static class RackServerHardwareToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.RackServerHardware; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen SAN-Switch und Rack
                /// </summary>
                public static class SANSwitchToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.SanSwitch; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Storage-System und Rack
                /// </summary>
                public static class StorageSystemToRackConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.StorageSystem; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Rack und Raum
                /// </summary>
                public static class RackToRoomConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.Room; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }
            }

            /// <summary>
            /// In ein Blade-Enclosure einzbauende Komponenten
            /// </summary>
            public static class EnclosureMount
            {
                /// <summary>
                /// Verbindungstyp für alle Verbindungen
                /// </summary>
                public static ConnectionTypes.ConnectionType ConnectionType { get { return Config.ConnectionTypeNames.BuiltIn; } }

                /// <summary>
                /// Verbindungsregel zwischen Blade-Interconnect und Blade-Enclosure
                /// </summary>
                public static class BladeInterconnectToBladeEnclosureConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeInterconnect; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.BladeEnclosure; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Blade-Server-Hardware und Blade-Enclosure
                /// </summary>
                public static class BladeServerHardwareToBladeEnclosureConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeServerHardware; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.BladeEnclosure; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Rack-Server-Hardware und Blade-Enclosure
                /// </summary>
                public static class BladeApplianceToBladeEnclosureConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeAppliance; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.BladeEnclosure; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }
            }

            public static class Maintainance
            {
                /// <summary>
                /// Verbindungstyp für alle Verbindungen
                /// </summary>
                public static ConnectionTypes.ConnectionType ConnectionType { get { return Config.ConnectionTypeNames.PartOf; } }


                /// <summary>
                /// Verbindungsregel zwischen Backup-System und ServiceContract
                /// </summary>
                public static class BackupSystemToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BackupSystem; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Blade-Enclosure und ServiceContract
                /// </summary>
                public static class BladeEnclosureToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeEnclosure; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Hardware-Appliance und ServiceContract
                /// </summary>
                public static class HardwareApplianceToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.HardwareAppliance; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Netzwerk-Switch und ServiceContract
                /// </summary>
                public static class NetworkSwitchToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.NetworkSwitch; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen PDU und ServiceContract
                /// </summary>
                public static class PDUToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.PDU; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen ServiceContract-Server-Hardware und ServiceContract
                /// </summary>
                public static class ServiceContractServerHardwareToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.ServiceContractServerHardware; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen SAN-Switch und ServiceContract
                /// </summary>
                public static class SANSwitchToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.SanSwitch; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Storage-System und ServiceContract
                /// </summary>
                public static class StorageSystemToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.StorageSystem; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Rack und Raum
                /// </summary>
                public static class RackToRoomConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }
                /// <summary>
                /// Verbindungsregel zwischen Blade-Interconnect und Blade-Enclosure
                /// </summary>
                public static class BladeInterconnectToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeInterconnect; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Blade-Server-Hardware und Blade-Enclosure
                /// </summary>
                public static class BladeServerHardwareToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeServerHardware; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Rack-Server-Hardware und Blade-Enclosure
                /// </summary>
                public static class BladeApplianceToServiceContractConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeAppliance; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ServiceContract; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }
            }

            public static class Shipment
            {
                /// <summary>
                /// Verbindungstyp für alle Verbindungen
                /// </summary>
                public static ConnectionTypes.ConnectionType ConnectionType { get { return Config.ConnectionTypeNames.PartOf; } }


                /// <summary>
                /// Verbindungsregel zwischen Backup-System und ShippingNote
                /// </summary>
                public static class BackupSystemToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BackupSystem; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Blade-Enclosure und ShippingNote
                /// </summary>
                public static class BladeEnclosureToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeEnclosure; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Hardware-Appliance und ShippingNote
                /// </summary>
                public static class HardwareApplianceToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.HardwareAppliance; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Netzwerk-Switch und ShippingNote
                /// </summary>
                public static class NetworkSwitchToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.NetworkSwitch; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen PDU und ShippingNote
                /// </summary>
                public static class PDUToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.PDU; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen ShippingNote-Server-Hardware und ShippingNote
                /// </summary>
                public static class ShippingNoteServerHardwareToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.ShippingNoteServerHardware; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen SAN-Switch und ShippingNote
                /// </summary>
                public static class SANSwitchToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.SanSwitch; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Storage-System und ShippingNote
                /// </summary>
                public static class StorageSystemToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.StorageSystem; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Rack und Raum
                /// </summary>
                public static class RackToRoomConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.Rack; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }
                /// <summary>
                /// Verbindungsregel zwischen Blade-Interconnect und Blade-Enclosure
                /// </summary>
                public static class BladeInterconnectToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeInterconnect; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Blade-Server-Hardware und Blade-Enclosure
                /// </summary>
                public static class BladeServerHardwareToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeServerHardware; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

                /// <summary>
                /// Verbindungsregel zwischen Rack-Server-Hardware und Blade-Enclosure
                /// </summary>
                public static class BladeApplianceToShippingNoteConnectionRule
                {
                    public static string UpperItemType { get { return Config.ConfigurationItemNames.BladeAppliance; } }
                    public static string LowerItemType { get { return Config.ConfigurationItemNames.ShippingNote; } }
                    public static CmdbClient.CmsService.ConnectionRule ConnectionRule { get; private set; }
                }

            }
        }
    }
}
