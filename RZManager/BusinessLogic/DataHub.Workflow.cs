using CmdbClient.CmsService;
using RZManager.Objects;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        #region Connections
        /// <summary>
        /// Stelle eine Verbindung zwischen einem rack-montierbaren System und einem Rack her
        /// </summary>
        /// <param name="rackmountable">rack-montierbares System</param>
        /// <param name="rack">Rack</param>
        /// <param name="lowestHeightUnit">Untere HE</param>
        /// <param name="numberofHeightUnits">Anzahl HEs</param>
        /// <param name="errorMessage">Ausgabe einer Fehlermeldung</param>
        /// <returns>true, wenn alles geklappt hat, sonst false</returns>
        public bool CreateConnectionToRack(RackMountable rackmountable, Rack rack, int lowestHeightUnit, int numberofHeightUnits, out string errorMessage)
        {
            errorMessage = string.Empty;
            ConnectionRule rule;
            switch (rackmountable.GetType().Name)
            {
                case "BackupSystem":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.BackupSystemToRack.ConnectionRule;
                    break;
                case "BladeEnclosure":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.BladeEnclosureToRack.ConnectionRule;
                    break;
                case "HardwareAppliance":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.HardwareApplianceToRack.ConnectionRule;
                    break;
                case "NetworkSwitch":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.NetworkSwitchToRack.ConnectionRule;
                    break;
                case "PDU":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.PDUToRack.ConnectionRule;
                    break;
                case "Rackserver":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.RackServerHardwareToRack.ConnectionRule;
                    break;
                case "SanSwitch":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.SANSwitchToRack.ConnectionRule;
                    break;
                case "StorageSystem":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.StorageSystemToRack.ConnectionRule;
                    break;
                default:
                    errorMessage = "Konnte keine Regel zum Typ " + rackmountable.GetType().Name + " finden.";
                    return false;
            }
            Connection conn = new Connection()
            {
                ConnId = Guid.NewGuid(),
                ConnUpperItem = rackmountable.id,
                ConnLowerItem = rack.id,
                ConnType = rule.ConnType,
                RuleId = rule.RuleId,
                Description = string.Format("HE: " + (numberofHeightUnits == 1 ? "{0}" : "{0}-{1}"), lowestHeightUnit, lowestHeightUnit - 1 + numberofHeightUnits),
            };

            try
            {
                // Verbindung herstellen
                dataWrapper.CreateConnection(conn);
                conn = dataWrapper.GetConnection(conn.ConnId);
                rackmountable.ConnectionToRack = DataCenterFactory.CreateConnection(rackmountable, rack, conn);

                if (!SetAssetStatus(rackmountable, AssetStatus.Free, out errorMessage))
                    return false;

                /*if (rackmountable is GenericRackMountable)
                {
                    if (!genericRackMountables.Contains(rackmountable))
                        genericRackMountables.Add(rackmountable as GenericRackMountable);
                    if (!SerialLookup.ContainsKey(rackmountable.Serialnumber))
                        SerialLookup.Add(rackmountable.Serialnumber, rackmountable);
                    if (!assetsForItemId.ContainsKey(rackmountable.id))
                        assetsForItemId.Add(rackmountable.id, rackmountable);
                }*/
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }

            OnDataChanged();

            return true;
        }

        /// <summary>
        /// Erzeugt eine Verbindung von einem Server zu einer Hardware
        /// </summary>
        /// <param name="server">Server</param>
        /// <param name="hardware">Hardware</param>
        /// <param name="errorMessage">Ggf. Fehlermeldung</param>
        /// <returns></returns>
        public bool CreateConnectionToProvisionable(ProvisionedSystem server, IProvisioningSystem hardware, out string errorMessage)
        {
            errorMessage = string.Empty;
            ConnectionRule rule;
            switch (server.GetType().Name)
            {
                case "StorageSystem":
                    rule = ConnectionRuleSettings.Rules.RackMountRules.StorageSystemToRack.ConnectionRule;
                    break;
                default:
                    errorMessage = "Konnte keine Regel zum Typ " + server.GetType().Name + " finden.";
                    return false;
            }
            Connection conn = new Connection()
            {
                ConnId = Guid.NewGuid(),
                ConnUpperItem = server.id,
                ConnLowerItem = (hardware as Asset).id,
                RuleId = rule.RuleId,
                Description = string.Empty,
            };
            try
            {
                dataWrapper.CreateConnection(conn);
                conn = dataWrapper.GetConnection(conn.ConnId);
                hardware.ConnectionToServer = DataCenterFactory.CreateConnection(server, hardware as Asset, conn);

                SetAssetToProduction(server, out errorMessage);
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
            return true;
        }

        /// <summary>
        /// Erzeugt einer Verbindung zwischen einem in ein Enclosure einbaubaren Item und einem Enclosure
        /// </summary>
        /// <param name="em">Ins Enclosure einbaubare System</param>
        /// <param name="enclosure">Blade-Enclosure</param>
        /// <param name="targetStatus">Status, den das Asset erhalten soll</param>
        /// <param name="slot">Slot im Format Slot: 0</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool CreateConnectionToEnclosure(EnclosureMountable em, BladeEnclosure enclosure, AssetStatus targetStatus, string slot, out string errorMessage)
        {
            errorMessage = string.Empty;
            ConnectionRule rule;
            switch (em.GetType().Name)
            {
                case "BladeAppliance":
                    rule = ConnectionRuleSettings.Rules.EnclosureMountRules.BladeApplianceToBladeEnclosure.ConnectionRule;
                    break;
                case "BladeInterconnect":
                    rule = ConnectionRuleSettings.Rules.EnclosureMountRules.BladeInterconnectToBladeEnclosure.ConnectionRule;
                    break;
                case "BladeServer":
                    rule = ConnectionRuleSettings.Rules.EnclosureMountRules.BladeServerHardwareToBladeEnclosure.ConnectionRule;
                    break;
                default:
                    errorMessage = "Konnte keine Regel zum Typ " + em.GetType().Name + " finden.";
                    return false;
            }
            Connection conn = new Connection()
            {
                ConnId = Guid.NewGuid(),
                ConnUpperItem = em.id,
                ConnLowerItem = enclosure.id,
                RuleId = rule.RuleId,
                Description = string.Format("Slot: {0}", slot),
            };

            try
            {
                dataWrapper.CreateConnection(conn);
                conn = dataWrapper.GetConnection(conn.ConnId);
                em.ConnectionToEnclosure = DataCenterFactory.CreateConnection(em, enclosure, conn);

                SetAssetStatus(em, targetStatus, out errorMessage);

            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }

            OnDataChanged();

            return true;
        }

        /// <summary>
        /// Löscht die Verbindung eines rack-montierbaren Systems mit dem Rack und legt es ins Lager
        /// </summary>
        /// <param name="rackmountable">Rack-montierbares System</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool RemoveConnectionToRack(RackMountable rackmountable, AssetStatus targetStatus, out string errorMessage)
        {
            errorMessage = string.Empty;
            bool success = true;
            try
            {
                Connection conn = dataWrapper.GetConnection(rackmountable.ConnectionToRack.id);
                OperationResult or = dataWrapper.DeleteConnection(conn);
                if (!or.Success)
                    throw new Exception(or.Message);
                rackmountable.ConnectionToRack = null;
                if (!SetAssetStatus(rackmountable, targetStatus, out errorMessage))
                    return false;
                rackmountable.Status = targetStatus;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
            OnDataChanged();

            return success;
        }

        /// <summary>
        /// Löscht eine Verbindung eines Blade-Servers, Interconnects oder anderen ins Enclosure einbaubare Item zum Blade Enclosure
        /// </summary>
        /// <param name="em">In ein Enclosure einbaubares System</param>
        /// <param name="errorMessage">Ausgabe der Fehlermeldung</param>
        /// <returns></returns>
        public bool RemoveConnectionToEnclosure(EnclosureMountable em, AssetStatus targetStatus, out string errorMessage)
        {
            errorMessage = string.Empty;
            try
            {
                Connection conn = dataWrapper.GetConnection(em.ConnectionToEnclosure.id);
                OperationResult or = dataWrapper.DeleteConnection(conn);
                if (!or.Success)
                    throw new Exception(or.Message);
                em.ConnectionToEnclosure = null;

                if (!SetAssetStatus(em, targetStatus, out errorMessage))
                    return false;
                em.Status = targetStatus;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
            OnDataChanged();

            return true;
        }

        #endregion

        #region Asset
        /// <summary>
        /// Sondert ein Asset aus und kappt alle Verbindungen von und zu dem Item. Gibt bei Fehler false zurück
        /// </summary>
        /// <param name="asset">Asset, das ausgesondert werden soll</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool ScrapAsset(Asset asset, out string errorMessage)
        {
            errorMessage = string.Empty;
            bool success = true;
            if (asset is RackMountable)
            {
                success &= RemoveConnectionToRack(asset as RackMountable, AssetStatus.Scrap, out errorMessage);
                if (asset is BladeEnclosure)
                {
                    // Blade Interconnects ebenfalls berücksichtigen
                    SetStatusForEnclosureMountables(asset as BladeEnclosure, true);
                }
            }
            else if (asset is EnclosureMountable)
            {
                success &= RemoveConnectionToEnclosure(asset as EnclosureMountable, AssetStatus.Scrap, out errorMessage);
            }
            else
                SetAssetStatus(asset, AssetStatus.Scrap, out errorMessage);

            //Letzte Verbindungen löschen
            foreach (Connection conn in dataWrapper.GetConnectionsForItem(asset.id))
            {
                dataWrapper.DeleteConnection(conn);
            }

            OnDataChanged();

            return success;
        }

        /// <summary>
        /// Setzt den Status eines Assets auf "Zur Aussonderung vorzubereiten"
        /// </summary>
        /// <param name="asset">Asset</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool PrepareAssetForScrap(Asset asset, out string errorMessage)
        {
            if (!SetAssetStatus(asset, AssetStatus.PendingScrap, out errorMessage))
                return false;
            if (asset is BladeEnclosure)
            {
                // Blade Interconnects ebenfalls berücksichtigen
                SetStatusForEnclosureMountables(asset as BladeEnclosure, false);
            }
            return true;
        }

        /// <summary>
        /// Setzt den Status eines Assets auf Abgeschaltet
        /// </summary>
        /// <param name="asset">Asset</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool InactivateAssetForScrap(Asset asset, out string errorMessage)
        {
            if (!SetAssetStatus(asset, AssetStatus.SwitchedOff, out errorMessage))
                return false;
            if (asset is BladeEnclosure)
            {
                // Blade Interconnects ebenfalls berücksichtigen
                SetStatusForEnclosureMountables(asset as BladeEnclosure, false);
            }
            return true;
        }

        /// <summary>
        /// Setzt alle Blade-Interconnects zu einem Blade-Enclosure auf den angegebenen Status
        /// </summary>
        /// <param param name="enclosure">Blade Enclosure</param>
        /// <param name="deleteConnections">Gibt an, ob die Verbindung beim Status gekappt werden soll</param>
        private void SetStatusForEnclosureMountables(BladeEnclosure enclosure, bool deleteConnections)
        {
            string errorMessage;
            foreach (BladeInterconnect bic in bladeInterconnects.Where(b => b.ConnectionToEnclosure.SecondItem.id == enclosure.id))
            {
                if (deleteConnections)
                    RemoveConnectionToEnclosure(bic, enclosure.Status, out errorMessage);
                else
                    SetAssetStatus(bic, enclosure.Status, out errorMessage);
            }
            foreach (BladeAppliance ba in bladeAppliances.Where(b => b.ConnectionToEnclosure.SecondItem.id == enclosure.id))
            {
                if (deleteConnections)
                    RemoveConnectionToEnclosure(ba, enclosure.Status, out errorMessage);
                else
                    SetAssetStatus(ba, enclosure.Status, out errorMessage);
            }
        }

        /// <summary>
        /// Setzt den Status eines Assets von Frei auf Reserviert
        /// </summary>
        /// <param name="asset">Betroffenes Asset</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool ReserveAsset(Asset asset, out string errorMessage)
        {
            errorMessage = string.Empty;
            try
            {
                if (!SetAssetStatus(asset, AssetStatus.Reserved, out errorMessage))
                    return false;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
            return true;
        }

        /// <summary>
        /// Setzt den Status eines Assets auf Frei
        /// </summary>
        /// <param name="asset">Asset</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool FreeAsset(Asset asset, out string errorMessage)
        {
            // Server löschen, falls vorhanden
            if (asset is IProvisioningSystem)
            {
                IProvisioningSystem hardware = asset as IProvisioningSystem;
                if (hardware.ConnectionToServer != null)
                {
                    ProvisionedSystem server = hardware.ConnectionToServer.FirstItem as ProvisionedSystem;
                    provisionedSystems.Remove(server);
                    if (!SetAssetStatus(server, AssetStatus.Scrap, out errorMessage))
                        return false;
                    Connection conn = dataWrapper.GetConnection(hardware.ConnectionToServer.id);
                    OperationResult or = dataWrapper.DeleteConnection(conn);
                    if (!or.Success)
                        throw new Exception(or.Message);
                    dataWrapper.DeleteConfigurationItem(dataWrapper.GetConfigurationItem(server.id));
                    hardware.ConnectionToServer = null;
                }
            }
            return SetAssetStatus(asset, AssetStatus.Free, out errorMessage);
        }

        /// <summary>
        /// Setzt den STatus eines Assets auf "In Produktion".
        /// Bei Blade-Enclosures werden auch die Statuswerte der verbundenen Geräte mit geändert.
        /// </summary>
        /// <param name="asset">Asset, das geändert werden soll</param>
        /// <param name="errorMessage">Ggf. Fehlermeldung</param>
        /// <returns></returns>
        public bool SetAssetToProduction(Asset asset, out string errorMessage)
        {
            if (!SetAssetStatus(asset, AssetStatus.InProduction, out errorMessage))
                return false;
            if (asset is BladeEnclosure)
                SetStatusForEnclosureMountables(asset as BladeEnclosure, false);
            return true;
        }

        /// <summary>
        /// Setzt den Status eines Assets
        /// </summary>
        /// <param name="asset">Asset, das verändert werden soll</param>
        /// <param name="status">Statuswert</param>
        /// <param name="errorMessage">Ggf. Fehlermeldung</param>
        /// <returns></returns>
        private bool SetAssetStatus(Asset asset, AssetStatus status, out string errorMessage)
        {
            errorMessage = string.Empty;
            try
            {
                ConfigurationItem item = dataWrapper.GetConfigurationItem(asset.id);
                if (item == null)
                {
                    errorMessage = "Item nicht gefunden";
                    return false;
                }
                dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.Status],
                    StatusConverter.GetTextForStatus(status), null);
                asset.Status = status;
                OnDataChanged();
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
            return true;
        }
        #endregion

        #region Lieferungen

        /// <summary>
        /// Erzeugt ein auf Lager liegendes Asset
        /// </summary>
        /// <param name="asset"></param>
        /// <returns></returns>
        public ConfigurationItem CreateStoredItem(Asset asset)
        {
            // Standardwerte setzen
            asset.Status = AssetStatus.Stored;
            ConfigurationItem item = dataWrapper.EnsureConfigurationItem(asset.Name, MetaData.ItemTypes[asset.TypeName], null);
            dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.Manufacturer],
                asset.Manufacturer, null);
            dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.Model],
                asset.Model, null);
            dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.SerialNumber],
                asset.Serialnumber, null);
            dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.Status],
                StatusConverter.GetTextForStatus(asset.Status), null);
            return item;
        }
        #endregion

        #region Server
        /// <summary>
        /// Erzeugt einen Server in assyst
        /// </summary>
        /// <param name="name">Name des Items</param>
        /// <param name="purpose">Aufgabe des Items</param>
        /// <param name="operatingSystem">Betriebssystem</param>
        /// <param name="ip">IP-Adresse</param>
        /// <param name="hostname">Hostname</param>
        /// <param name="cpus">Anzahl der CPUs</param>
        /// <param name="ram">Arbeitsspeicher</param>
        /// <param name="errorMessage">Fehlermeldungen</param>
        /// <param name="server">Server, der erzeugt wurde</param>
        /// <returns></returns>
        public bool CreateServer(string name, string purpose, string operatingSystem, string ip, string hostname, string cpus, string ram, out string errorMessage, out ProvisionedSystem server)
        {
            errorMessage = string.Empty;
            server = null;
            StringBuilder sb = new StringBuilder();
            try
            {
                ConfigurationItem item = new ConfigurationItem()
                {
                    ItemId = Guid.NewGuid(),
                    ItemName = name,
                    ItemType = MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.Server].TypeId,
                };
                OperationResult or = dataWrapper.CreateConfigurationItem(item);
                if (!or.Success)
                    throw new Exception(or.Message);
                List<ItemAttribute> itemAttributes = new List<ItemAttribute>();
                itemAttributes.Add(dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.Status],
                    StatusConverter.GetTextForStatus(AssetStatus.InProduction), sb));
                itemAttributes.Add(dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.CpuCount],
                    cpus, sb));
                itemAttributes.Add(dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.Hostname],
                    hostname, sb));
                itemAttributes.Add(dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.IpAddress],
                    ip, sb));
                itemAttributes.Add(dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.MemorySize],
                    ram, sb));
                itemAttributes.Add(dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.OperatingSystem],
                    operatingSystem, sb));
                itemAttributes.Add(dataWrapper.EnsureItemAttribute(item, MetaData.AttributeTypes[Settings.Config.AttributeTypeNames.Purpose],
                    purpose, sb));
                item = dataWrapper.GetConfigurationItem(item.ItemId);
                DataCenterFactory.CreateProvisionedSystem(item, itemAttributes);
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
            return true;
        }
        #endregion

    }
}
