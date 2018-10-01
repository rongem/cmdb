using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects
{
    /// <summary>
    /// Zuordnungen der Attributgruppen zu Attribut-Typen und Item-Typen
    /// </summary>
    public class AttributeSettings
    {
        public static AttributeSettings Config { get; } = new AttributeSettings();

        private AttributeSettings() { }

        public class AttributGroupMapping
        {
            public string AttributeGroupName { get; internal set; }
            public string[] AttributeTypeNames { get; internal set; }
            public string[] ItemTypeNames { get; internal set; }
        }

        /// <summary>
        /// Attributgruppe für Hardware-Attribute
        /// </summary>
        public AttributGroupMapping HardwareAttributes = new AttributGroupMapping()
        {
            AttributeGroupName = Settings.Config.AttributeGroupNames.HardwareAttributes,
            AttributeTypeNames = new string[]
            {
                    Settings.Config.AttributeTypeNames.Manufacturer,
                    Settings.Config.AttributeTypeNames.Model,
                    Settings.Config.AttributeTypeNames.SerialNumber,
            },
            ItemTypeNames = new string[]
            {
                    Settings.Config.ConfigurationItemTypeNames.BackupSystem,
                    Settings.Config.ConfigurationItemTypeNames.BladeAppliance,
                    Settings.Config.ConfigurationItemTypeNames.BladeEnclosure,
                    Settings.Config.ConfigurationItemTypeNames.BladeInterconnect,
                    Settings.Config.ConfigurationItemTypeNames.BladeServerHardware,
                    Settings.Config.ConfigurationItemTypeNames.HardwareAppliance,
                    Settings.Config.ConfigurationItemTypeNames.NetworkSwitch,
                    Settings.Config.ConfigurationItemTypeNames.PDU,
                    Settings.Config.ConfigurationItemTypeNames.Rack,
                    Settings.Config.ConfigurationItemTypeNames.RackServerHardware,
                    Settings.Config.ConfigurationItemTypeNames.SanSwitch,
                    Settings.Config.ConfigurationItemTypeNames.StorageSystem,
            },
        };

        /// <summary>
        /// Attributgruppe für Netzwerk-Attribute wie IP-Adresse, Hostname
        /// </summary>
        public AttributGroupMapping NetworkAttributes = new AttributGroupMapping()
        {
            AttributeGroupName = Settings.Config.AttributeGroupNames.NetworkAttributes,
            AttributeTypeNames = new string[]
            {
                    Settings.Config.AttributeTypeNames.Hostname,
                    Settings.Config.AttributeTypeNames.IpAddress,
            },
            ItemTypeNames = new string[]
            {
                    Settings.Config.ConfigurationItemTypeNames.BackupSystem,
                    Settings.Config.ConfigurationItemTypeNames.BareMetalHypervisor,
                    Settings.Config.ConfigurationItemTypeNames.BladeAppliance,
                    Settings.Config.ConfigurationItemTypeNames.BladeEnclosure,
                    Settings.Config.ConfigurationItemTypeNames.BladeInterconnect,
                    Settings.Config.ConfigurationItemTypeNames.BladeServerHardware,
                    Settings.Config.ConfigurationItemTypeNames.HardwareAppliance,
                    Settings.Config.ConfigurationItemTypeNames.NetworkSwitch,
                    Settings.Config.ConfigurationItemTypeNames.RackServerHardware,
                    Settings.Config.ConfigurationItemTypeNames.SanSwitch,
                    Settings.Config.ConfigurationItemTypeNames.Server,
                    Settings.Config.ConfigurationItemTypeNames.SoftAppliance,
                    Settings.Config.ConfigurationItemTypeNames.StorageSystem,
             }
        };

        /// <summary>
        /// Attributgruppe für Raum-Attribute wie Gebäudename
        /// </summary>
        public AttributGroupMapping RoomAttributes = new AttributGroupMapping()
        {
            AttributeGroupName = Settings.Config.AttributeGroupNames.RoomAttributes,
            AttributeTypeNames = new string[]
            {
                    Settings.Config.AttributeTypeNames.BuildingName,
            },
            ItemTypeNames = new string[]
            {
                Settings.Config.ConfigurationItemTypeNames.Room,
            }
        };

        /// <summary>
        /// Attributgruppe für Server-Attribute wie Betriebssysteme, Anzahl CPUs
        /// </summary>
        public AttributGroupMapping ServerAttributes = new AttributGroupMapping()
        {
            AttributeGroupName = Settings.Config.AttributeGroupNames.ServerAttributes,
            AttributeTypeNames = new string[] 
            {
                    Settings.Config.AttributeTypeNames.CpuCount,
                    Settings.Config.AttributeTypeNames.MemorySize,
                    Settings.Config.AttributeTypeNames.OperatingSystem,
                    Settings.Config.AttributeTypeNames.Purpose,
            },
            ItemTypeNames = new string[]
            {
                    Settings.Config.ConfigurationItemTypeNames.HardwareAppliance,
                    Settings.Config.ConfigurationItemTypeNames.Server,
                    Settings.Config.ConfigurationItemTypeNames.SoftAppliance,
             }
        };

        /// <summary>
        /// Attributgruppe für den Status
        /// </summary>
        public AttributGroupMapping StatusAttributes = new AttributGroupMapping()
        {
            AttributeGroupName = Settings.Config.AttributeGroupNames.StatusAttributes,
            AttributeTypeNames = new string[] 
            {
                    Settings.Config.AttributeTypeNames.Status,
            },
            ItemTypeNames = new string[]
            {
                    Settings.Config.ConfigurationItemTypeNames.BackupSystem,
                    Settings.Config.ConfigurationItemTypeNames.BareMetalHypervisor,
                    Settings.Config.ConfigurationItemTypeNames.BladeAppliance,
                    Settings.Config.ConfigurationItemTypeNames.BladeEnclosure,
                    Settings.Config.ConfigurationItemTypeNames.BladeInterconnect,
                    Settings.Config.ConfigurationItemTypeNames.BladeServerHardware,
                    Settings.Config.ConfigurationItemTypeNames.HardwareAppliance,
                    Settings.Config.ConfigurationItemTypeNames.NetworkSwitch,
                    Settings.Config.ConfigurationItemTypeNames.PDU,
                    Settings.Config.ConfigurationItemTypeNames.Rack,
                    Settings.Config.ConfigurationItemTypeNames.RackServerHardware,
                    Settings.Config.ConfigurationItemTypeNames.SanSwitch,
                    Settings.Config.ConfigurationItemTypeNames.Server,
                    Settings.Config.ConfigurationItemTypeNames.SoftAppliance,
                    Settings.Config.ConfigurationItemTypeNames.StorageSystem,
             }
        };


    }
}
