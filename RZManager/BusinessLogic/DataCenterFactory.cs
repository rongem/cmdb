using CmdbClient.CmsService;
using RZManager.Objects;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RZManager.BusinessLogic
{
    public static class DataCenterFactory
    {
        private static void SetAssetProperties(Asset asset, ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            asset.AssetType = new NamedObject() { id = item.ItemType, Name = item.TypeName };
            asset.id = item.ItemId;
            asset.Manufacturer = GetAttributeValue(itemAttributes, Settings.Config.AttributeTypeNames.Manufacturer);
            asset.Model = GetAttributeValue(itemAttributes, Settings.Config.AttributeTypeNames.Model);
            asset.Name = item.ItemName;
            asset.Serialnumber = GetAttributeValue(itemAttributes, Settings.Config.AttributeTypeNames.SerialNumber);
            asset.Status = StatusConverter.GetStatusFromText(GetAttributeValue(itemAttributes, Settings.Config.AttributeTypeNames.Status));
        }

        public static string GetAttributeValue(IEnumerable<ItemAttribute> itemAttributes, string typeName)
        {
            ItemAttribute attribute = itemAttributes.SingleOrDefault(a => a.AttributeTypeName.Equals(typeName, StringComparison.CurrentCultureIgnoreCase));
            return attribute == null ? string.Empty : attribute.AttributeValue;
        }

        /// <summary>
        /// Erzeugt einen Raum
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static Room CreateRoom(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            Room room = new Room()
            {
                id = item.ItemId,
                Name = item.ItemName,
                BuildingName = GetAttributeValue(itemAttributes, Settings.Config.AttributeTypeNames.BuildingName),
            };
            return room;
        }

        /// <summary>
        /// Erzeugt ein Rack
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static Rack CreateRack(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            Rack rack = new Rack();
            SetAssetProperties(rack, item, itemAttributes);
            rack.MaxHeight = 42;
            return rack;
        }

        /// <summary>
        /// Erzeugt eine Power Distribution Unit
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static PDU CreatePDU(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            PDU pdu = new PDU();
            SetAssetProperties(pdu, item, itemAttributes);
            return pdu;
        }

        /// <summary>
        /// Erzeugt einen SAN-Switch
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static SanSwitch CreateSanSwitch(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            SanSwitch sanSwitch = new SanSwitch();
            SetAssetProperties(sanSwitch, item, itemAttributes);
            return sanSwitch;
        }

        /// <summary>
        /// Erzeugt ein Storage-System
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static StorageSystem CreateStorageSystem(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            StorageSystem storage = new StorageSystem();
            SetAssetProperties(storage, item, itemAttributes);
            return storage;
        }

        /// <summary>
        /// Erzeugt ein Backup-System
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static BackupSystem CreateBackupSystem(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            BackupSystem backupSystem = new BackupSystem();
            SetAssetProperties(backupSystem, item, itemAttributes);
            return backupSystem;
        }

        /// <summary>
        /// Erzeugt ein BladeCenter
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static BladeEnclosure CreateBladeEnclosure(ConfigurationItem item, EnclosureTypeTemplate enclosureType, IEnumerable<ItemAttribute> itemAttributes)
        {
            BladeEnclosure enclosure = new BladeEnclosure();
            SetAssetProperties(enclosure, item, itemAttributes);
            enclosure.EnclosureType = enclosureType;
            return enclosure;
        }

        /// <summary>
        /// Erzeugt ein Blade-Interconnect
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static BladeInterconnect CreateBladeInterconnect(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            BladeInterconnect interconnect = new BladeInterconnect();
            SetAssetProperties(interconnect, item, itemAttributes);
            return interconnect;
        }

        /// <summary>
        /// Erzeugt einen RackServer
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static RackServer CreateRackServer(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            RackServer rackServer = new RackServer();
            SetAssetProperties(rackServer, item, itemAttributes);
            return rackServer;
        }

        /// <summary>
        /// Erzeugt einen BladeServer
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static BladeServer CreateBladeServer(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            BladeServer blade = new BladeServer();
            SetAssetProperties(blade, item, itemAttributes);
            return blade;
        }
        /// <summary>
        /// Erzeugt eine Hardware-Appliance
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static HardwareAppliance CreateHardwareAppliance(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            HardwareAppliance appliance = new HardwareAppliance();
            SetAssetProperties(appliance, item, itemAttributes);
            return appliance;
        }

        /// <summary>
        /// Erzeugt eine Blade-Appliance
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static BladeAppliance CreateBladeAppliance(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            BladeAppliance appliance = new BladeAppliance();
            SetAssetProperties(appliance, item, itemAttributes);
            return appliance;
        }

        /// <summary>
        /// Erzeugt ein generisches, in ein Rack einbaubares System
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static GenericRackMountable CreateGenericRackMountable(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            GenericRackMountable mountable = new GenericRackMountable();
            SetAssetProperties(mountable, item, itemAttributes);
            return mountable;
        }

        /// <summary>
        /// Erzeugt ein bereitgestelltes System (Appliance, ESX-Host oder Server
        /// </summary>
        /// <param name="item">ConfigurationItem</param>
        /// <param name="itemAttributes">Attribut-Liste zum Configuration Item</param>
        /// <returns></returns>
        public static ProvisionedSystem CreateProvisionedSystem(ConfigurationItem item, IEnumerable<ItemAttribute> itemAttributes)
        {
            ProvisionedSystem system = new ProvisionedSystem();
            SetAssetProperties(system, item, itemAttributes);
            system.TypeName = item.TypeName;
            return system;
        }

        /// <summary>
        /// Erzeugt eine Verbindung zwischen zwei Items
        /// </summary>
        /// <param name="firstItem">Erstes Item</param>
        /// <param name="secondItem">Zweites Item</param>
        /// <param name="connection">Verbindung zwischen den Items</param>
        /// <returns></returns>
        public static AssetConnection CreateConnection(Asset firstItem, Asset secondItem, CmdbClient.CmsService.Connection connection)
        {
            AssetConnection conn = new AssetConnection()
            {
                id = connection.ConnId,
                FirstItem = firstItem,
                SecondItem = secondItem,
                ConnectionType = connection.ConnType,
                Content = connection.Description,
            };
            return conn;
        }
    }
}
