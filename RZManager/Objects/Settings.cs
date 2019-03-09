﻿using System;

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
        public static Settings Config = GetConfig();

        private static Settings GetConfig()
        {
            using (System.IO.FileStream fileStream = new System.IO.FileStream(Properties.Settings.Default.SettingsFile, System.IO.FileMode.Open))
            {
                Settings settings = (Settings)(new System.Xml.Serialization.XmlSerializer(typeof(Settings))).Deserialize(fileStream);
                fileStream.Close();
                return settings;
            }
        }

        private Settings() { }

        /// <summary>
        /// Stellt die Namen der ConfigurationItem-Tyen zur Verfügung
        /// </summary>
        [Serializable]
        public class ConfigurationItemTypes
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
            /// Bezeichnung des Gebäudes
            /// </summary>
            public string BuildingName { get; set; }

            /// <summary>
            /// Bezeichnung für die Anzahl der CPUs
            /// </summary>
            public string CpuCount { get; set; }

            /// <summary>
            /// Bezeichnung für den Hostnamen
            /// </summary>
            public string Hostname { get; set; }

            /// <summary>
            /// Bezeichnung für die IP-Adresse
            /// </summary>
            public string IpAddress { get; set; }

            /// <summary>
            /// Bezeichnung des Attribut-Typs für die Herstellerbezeichnung
            /// </summary>
            public string Manufacturer { get; set; }

            /// <summary>
            /// Bezeichnung für die Größe des Arbeitsspeichers
            /// </summary>
            public string MemorySize { get; set; }

            /// <summary>
            /// Bezeichnung des Attribut-Typs für die Modellbezeichnung
            /// </summary>
            public string Model { get; set; }

            /// <summary>
            /// Bezeichnung für das Betriebssystem
            /// </summary>
            public string OperatingSystem { get; set; }

            /// <summary>
            /// Bezeichnung für die Aufgabe
            /// </summary>
            public string Purpose { get; set; }

            /// <summary>
            /// Bezeichnung des Attribut-Typs für die Seriennummer
            /// </summary>
            public string SerialNumber { get; set; }

            /// <summary>
            /// Bezeichnung des Attribut-Typs für den Status des Assets
            /// </summary>
            public string Status { get; set; }
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

            /// <summary>
            /// Bezeichnung der Attributgruppe für Netzwerk-Attribute wie IP-Adresse, Hostname
            /// </summary>
            public string NetworkAttributes { get; set; }

            /// <summary>
            /// Bezeichnung der Attributgruppe für Raum-Attribute wie Gebäudename
            /// </summary>
            public string RoomAttributes { get; set; }

            /// <summary>
            /// Bezeichnung der Attributgruppe für Server-Attribute wie Betriebssysteme, Anzahl CPUs
            /// </summary>
            public string ServerAttributes { get; set; }

            /// <summary>
            /// Bezeichnung der Attributgruppe für den Status
            /// </summary>
            public string StatusAttributes { get; set; }
        }

        /// <summary>
        /// Enthält die Namen der Typen von Configuration Items
        /// </summary>
        public ConfigurationItemTypes ConfigurationItemTypeNames = new ConfigurationItemTypes();

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

    }
}