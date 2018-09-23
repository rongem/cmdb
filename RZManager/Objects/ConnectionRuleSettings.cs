using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects
{
    /// <summary>
    /// Verbindungsregeln, die für die Konfiguration benötigt werden
    /// </summary>
    public class ConnectionRuleSettings
    {
        interface IConnectionRuleSetting
        {
            string UpperItemType { get; }
            string LowerItemType { get; }
            CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
        }

        public static ConnectionRuleSettings Rules = new ConnectionRuleSettings();

        private ConnectionRuleSettings() { Retrievetypes(); }

        public static void Retrievetypes()
        {
            IEnumerable<Type> types = typeof(ConnectionRuleSettings).Assembly.GetTypes().Where
                (t => t.IsClass && t.IsSealed && t.IsAbstract);
        }

        /// <summary>
        /// Verbindungsregeln für in ein Rack einzubauende Komponenten
        /// </summary>
        public static class RackMount
        {
            /// <summary>
            /// Verbindungstyp für alle Verbindungen
            /// </summary>
            public static Settings.ConnectionTypes.ConnectionType ConnectionType { get { return Settings.Config.ConnectionTypeNames.BuiltIn; } }

            public class BackupSystemToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BackupSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Backup-System und Rack
            /// </summary>
            public static BackupSystemToRackConnectionRule BackupSystemToRack = new BackupSystemToRackConnectionRule();

            public class BladeEnclosureToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Enclosure und Rack
            /// </summary>
            public static BladeEnclosureToRackConnectionRule BladeEnclosureToRack = new BladeEnclosureToRackConnectionRule();

            public class HardwareApplianceToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.HardwareAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Hardware-Appliance und Rack
            /// </summary>
            public static HardwareApplianceToRackConnectionRule HardwareApplianceToRack = new HardwareApplianceToRackConnectionRule();

            public class NetworkSwitchToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.NetworkSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Netzwerk-Switch und Rack
            /// </summary>
            public static NetworkSwitchToRackConnectionRule NetworkSwitchToRack = new NetworkSwitchToRackConnectionRule();

            public class PDUToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.PDU; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen PDU und Rack
            /// </summary>
            public static PDUToRackConnectionRule PDUToRack = new PDUToRackConnectionRule();

            public class RackServerHardwareToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.RackServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack-Server-Hardware und Rack
            /// </summary>
            public static RackServerHardwareToRackConnectionRule RackServerHardwareToRack = new RackServerHardwareToRackConnectionRule();

            public class SANSwitchToRackConnectionRule
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.SanSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen SAN-Switch und Rack : IConnectionRuleSetting
            /// </summary>
            public static SANSwitchToRackConnectionRule SANSwitchToRack = new SANSwitchToRackConnectionRule();

            public class StorageSystemToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.StorageSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Storage-System und Rack
            /// </summary>
            public static StorageSystemToRackConnectionRule StorageSystemToRack = new StorageSystemToRackConnectionRule();

            public class RackToRoomConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Room; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack und Raum
            /// </summary>
            public static RackToRoomConnectionRule RackToRoom = new RackToRoomConnectionRule();

        }

        /// <summary>
        /// Verbindungsregeln für in ein Blade-Enclosure einzbauende Komponenten
        /// </summary>
        public static class EnclosureMount
        {
            /// <summary>
            /// Verbindungstyp für alle Verbindungen
            /// </summary>
            public static Settings.ConnectionTypes.ConnectionType ConnectionType { get { return Settings.Config.ConnectionTypeNames.BuiltIn; } }

            public class BladeInterconnectToBladeEnclosureConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeInterconnect; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Interconnect und Blade-Enclosure
            /// </summary>
            public static BladeInterconnectToBladeEnclosureConnectionRule BladeInterconnectToBladeEnclosure = new BladeInterconnectToBladeEnclosureConnectionRule();

            public class BladeServerHardwareToBladeEnclosureConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Server-Hardware und Blade-Enclosure
            /// </summary>
            public static BladeServerHardwareToBladeEnclosureConnectionRule BladeServerHardwareToBladeEnclosure = new BladeServerHardwareToBladeEnclosureConnectionRule();

            public class BladeApplianceToBladeEnclosureConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack-Server-Hardware und Blade-Enclosure
            /// </summary>
            public static BladeApplianceToBladeEnclosureConnectionRule BladeApplianceToBladeEnclosure = new BladeApplianceToBladeEnclosureConnectionRule();
        }

        /// <summary>
        /// Verbindungsregeln für Wartungsverträge
        /// </summary>
        public static class Maintainance
        {
            /// <summary>
            /// Verbindungstyp für alle Verbindungen
            /// </summary>
            public static Settings.ConnectionTypes.ConnectionType ConnectionType { get { return Settings.Config.ConnectionTypeNames.PartOf; } }

            public class BackupSystemToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BackupSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Backup-System und Wartungsvertrag
            /// </summary>
            public static BackupSystemToServiceContractConnectionRule BackupSystemToServiceContract = new BackupSystemToServiceContractConnectionRule();

            public class BladeEnclosureToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Enclosure und Wartungsvertrag
            /// </summary>
            public static BladeEnclosureToServiceContractConnectionRule BladeEnclosureToServiceContract = new BladeEnclosureToServiceContractConnectionRule();

            public class HardwareApplianceToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.HardwareAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Hardware-Appliance und Wartungsvertrag
            /// </summary>
            public static HardwareApplianceToServiceContractConnectionRule HardwareApplianceToServiceContract = new HardwareApplianceToServiceContractConnectionRule();

            public class NetworkSwitchToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.NetworkSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Netzwerk-Switch und Wartungsvertrag
            /// </summary>
            public static NetworkSwitchToServiceContractConnectionRule NetworkSwitchToServiceContract = new NetworkSwitchToServiceContractConnectionRule();

            public class PDUToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.PDU; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen PDU und Wartungsvertrag
            /// </summary>
            public static PDUToServiceContractConnectionRule PDUToServiceContract = new PDUToServiceContractConnectionRule();

            public class RackServerHardwareToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.RackServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen ServiceContract-Server-Hardware und Wartungsvertrag
            /// </summary>
            public static RackServerHardwareToServiceContractConnectionRule RackServerHardwareToServiceContract = new RackServerHardwareToServiceContractConnectionRule();

            public class SANSwitchToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.SanSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen SAN-Switch und Wartungsvertrag
            /// </summary>
            public static SANSwitchToServiceContractConnectionRule SANSwitchToServiceContract = new SANSwitchToServiceContractConnectionRule();

            public class StorageSystemToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.StorageSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Storage-System und Wartungsvertrag
            /// </summary>
            public static StorageSystemToServiceContractConnectionRule StorageSystemToServiceContract = new StorageSystemToServiceContractConnectionRule();

            public class RackToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack und Wartungsvertrag
            /// </summary>
            public static RackToServiceContractConnectionRule RackToServiceContract = new RackToServiceContractConnectionRule();

            public class BladeApplianceToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack-Server-Hardware und Wartungsvertrag
            /// </summary>
            public static BladeApplianceToServiceContractConnectionRule BladeApplianceToServiceContract = new BladeApplianceToServiceContractConnectionRule();

            public class BladeInterconnectToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeInterconnect; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Interconnect und Wartungsvertrag
            /// </summary>
            public static BladeInterconnectToServiceContractConnectionRule BladeInterconnectToServiceContract = new BladeInterconnectToServiceContractConnectionRule();

            public class BladeServerHardwareToServiceContractConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ServiceContract; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Server-Hardware und Wartungsvertrag
            /// </summary>
            public static BladeServerHardwareToServiceContractConnectionRule BladeServerHardwareToServiceContract = new BladeServerHardwareToServiceContractConnectionRule();
        }

        /// <summary>
        /// Verbindungsregeln für Lieferscheine
        /// </summary>
        public class Shipment
        {
            /// <summary>
            /// Verbindungstyp für alle Verbindungen
            /// </summary>
            public static Settings.ConnectionTypes.ConnectionType ConnectionType { get { return Settings.Config.ConnectionTypeNames.PartOf; } }

            public class BackupSystemToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BackupSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Backup-System und Lieferschein
            /// </summary>
            public static BackupSystemToShippingNoteConnectionRule BackupSystemToShippingNote = new BackupSystemToShippingNoteConnectionRule();

            public class BladeEnclosureToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Enclosure und Lieferschein
            /// </summary>
            public static BladeEnclosureToShippingNoteConnectionRule BladeEnclosureToShippingNote = new BladeEnclosureToShippingNoteConnectionRule();

            public class HardwareApplianceToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.HardwareAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Hardware-Appliance und Lieferschein
            /// </summary>
            public static HardwareApplianceToShippingNoteConnectionRule HardwareApplianceToShippingNote = new HardwareApplianceToShippingNoteConnectionRule();

            public class NetworkSwitchToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.NetworkSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Netzwerk-Switch und Lieferschein
            /// </summary>
            public static NetworkSwitchToShippingNoteConnectionRule NetworkSwitchToShippingNote = new NetworkSwitchToShippingNoteConnectionRule();

            public class PDUToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.PDU; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen PDU und Lieferschein
            /// </summary>
            public static PDUToShippingNoteConnectionRule PDUToShippingNote = new PDUToShippingNoteConnectionRule();

            public class RackServerHardwareToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.RackServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen ShippingNote-Server-Hardware und Lieferschein
            /// </summary>
            public static RackServerHardwareToShippingNoteConnectionRule RackServerHardwareToShippingNote = new RackServerHardwareToShippingNoteConnectionRule();

            public class SANSwitchToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.SanSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen SAN-Switch und Lieferschein
            /// </summary>
            public static SANSwitchToShippingNoteConnectionRule SANSwitchToShippingNote = new SANSwitchToShippingNoteConnectionRule();

            public class StorageSystemToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.StorageSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Storage-System und Lieferschein
            /// </summary>
            public static StorageSystemToShippingNoteConnectionRule StorageSystemToShippingNote = new StorageSystemToShippingNoteConnectionRule();

            public class RackToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack und Lieferschein
            /// </summary>
            public static RackToShippingNoteConnectionRule RackToShippingNote = new RackToShippingNoteConnectionRule();

            public class BladeApplianceToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack-Server-Hardware und Lieferschein
            /// </summary>
            public static BladeApplianceToShippingNoteConnectionRule BladeApplianceToShippingNote = new BladeApplianceToShippingNoteConnectionRule();

            public class BladeInterconnectToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeInterconnect; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Interconnect und Lieferschein
            /// </summary>
            public static BladeInterconnectToShippingNoteConnectionRule BladeInterconnectToShippingNote = new BladeInterconnectToShippingNoteConnectionRule();

            public class BladeServerHardwareToShippingNoteConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.ShippingNote; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Server-Hardware und Lieferschein
            /// </summary>
            public static BladeServerHardwareToShippingNoteConnectionRule BladeServerHardwareToShippingNote = new BladeServerHardwareToShippingNoteConnectionRule();
        }
    }
}
