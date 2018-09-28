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
        public interface IRuleGroupSetting
        {
            Settings.ConnectionTypes.ConnectionType ConnectionType {  get; }
        }

        public interface IConnectionRuleSetting
        {
            string UpperItemType { get; }
            string LowerItemType { get; }
            int MaxConnectionsToLower { get; }
            int MaxConnectionsToUpper { get; }
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
        public class RackMount : IRuleGroupSetting
        {
            /// <summary>
            /// Verbindungstyp für alle Verbindungen
            /// </summary>
            public Settings.ConnectionTypes.ConnectionType ConnectionType { get { return Settings.Config.ConnectionTypeNames.BuiltIn; } }

            public class BackupSystemToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BackupSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Backup-System und Rack
            /// </summary>
            public BackupSystemToRackConnectionRule BackupSystemToRack = new BackupSystemToRackConnectionRule();

            public class BladeEnclosureToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Enclosure und Rack
            /// </summary>
            public BladeEnclosureToRackConnectionRule BladeEnclosureToRack = new BladeEnclosureToRackConnectionRule();

            public class HardwareApplianceToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.HardwareAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Hardware-Appliance und Rack
            /// </summary>
            public HardwareApplianceToRackConnectionRule HardwareApplianceToRack = new HardwareApplianceToRackConnectionRule();

            public class NetworkSwitchToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.NetworkSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Netzwerk-Switch und Rack
            /// </summary>
            public NetworkSwitchToRackConnectionRule NetworkSwitchToRack = new NetworkSwitchToRackConnectionRule();

            public class PDUToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.PDU; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen PDU und Rack
            /// </summary>
            public PDUToRackConnectionRule PDUToRack = new PDUToRackConnectionRule();

            public class RackServerHardwareToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.RackServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack-Server-Hardware und Rack
            /// </summary>
            public RackServerHardwareToRackConnectionRule RackServerHardwareToRack = new RackServerHardwareToRackConnectionRule();

            public class SANSwitchToRackConnectionRule
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.SanSwitch; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen SAN-Switch und Rack : IConnectionRuleSetting
            /// </summary>
            public SANSwitchToRackConnectionRule SANSwitchToRack = new SANSwitchToRackConnectionRule();

            public class StorageSystemToRackConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.StorageSystem; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Storage-System und Rack
            /// </summary>
            public StorageSystemToRackConnectionRule StorageSystemToRack = new StorageSystemToRackConnectionRule();

            public class RackToRoomConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.Rack; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.Room; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack und Raum
            /// </summary>
            public RackToRoomConnectionRule RackToRoom = new RackToRoomConnectionRule();

        }

        public RackMount RackMountRules = new RackMount();

        /// <summary>
        /// Verbindungsregeln für in ein Blade-Enclosure einzbauende Komponenten
        /// </summary>
        public class EnclosureMount : IRuleGroupSetting
        {
            /// <summary>
            /// Verbindungstyp für alle Verbindungen
            /// </summary>
            public Settings.ConnectionTypes.ConnectionType ConnectionType { get { return Settings.Config.ConnectionTypeNames.BuiltIn; } }

            public class BladeInterconnectToBladeEnclosureConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeInterconnect; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Interconnect und Blade-Enclosure
            /// </summary>
            public BladeInterconnectToBladeEnclosureConnectionRule BladeInterconnectToBladeEnclosure = new BladeInterconnectToBladeEnclosureConnectionRule();

            public class BladeServerHardwareToBladeEnclosureConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeServerHardware; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Blade-Server-Hardware und Blade-Enclosure
            /// </summary>
            public BladeServerHardwareToBladeEnclosureConnectionRule BladeServerHardwareToBladeEnclosure = new BladeServerHardwareToBladeEnclosureConnectionRule();

            public class BladeApplianceToBladeEnclosureConnectionRule : IConnectionRuleSetting
            {
                public string UpperItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeAppliance; } }
                public string LowerItemType { get { return Settings.Config.ConfigurationItemTypeNames.BladeEnclosure; } }
                public int MaxConnectionsToLower { get { return 1; } }
                public int MaxConnectionsToUpper { get { return 50; } }
                public CmdbClient.CmsService.ConnectionRule ConnectionRule { get; set; }
            }
            /// <summary>
            /// Verbindungsregel zwischen Rack-Server-Hardware und Blade-Enclosure
            /// </summary>
            public BladeApplianceToBladeEnclosureConnectionRule BladeApplianceToBladeEnclosure = new BladeApplianceToBladeEnclosureConnectionRule();
        }

        public EnclosureMount EnclosureMountRules = new EnclosureMount();
    }
}
