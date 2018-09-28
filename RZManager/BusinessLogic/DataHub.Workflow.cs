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
            rackmountable.ConnectionToRack = DataCenterFactory.CreateConnection(rackmountable, mountUpperItemDetail.id, rack, mountLowerItemDetail.id, mountingRelType.id,
                string.Format("HE: " + (numberofHeightUnits == 1 ? "{0}" : "{0}-{1}"), lowestHeightUnit, lowestHeightUnit - 1 + numberofHeightUnits));

            try
            {
                // Verbindung herstellen, muss umgedreht werden wegen assyst-Fehler
                ItemRelation rel = dataWrapper.CreateItemRelation(rackmountable.id, mountUpperItemDetail, rack.id, mountLowerItemDetail, rackmountable.ConnectionToRack.Content);

                if (rel == null)
                {
                    rackmountable.ConnectionToRack = null;
                    errorMessage = "Konnte Verbindung nicht anlegen.";
                    return false;
                }

                rackmountable.ConnectionToRack.id = rel.id;

                Item assystItem = dataWrapper.GetItemById(rackmountable.id);

                if (!SetAssetStatus(rackmountable, AssetStatus.Free, rack.RoomId, out errorMessage))
                    return false;

                if (rackmountable is GenericRackMountable)
                {
                    if (!genericRackMountables.Contains(rackmountable))
                        genericRackMountables.Add(rackmountable as GenericRackMountable);
                    if (!SerialLookup.ContainsKey(rackmountable.Serialnumber))
                        SerialLookup.Add(rackmountable.Serialnumber, rackmountable);
                    if (!assetsForItemId.ContainsKey(rackmountable.id))
                        assetsForItemId.Add(rackmountable.id, rackmountable);
                }

                rackmountable.Status = AssetStatus.Free;
                rackmountable.RoomId = rack.RoomId;

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
            hardware.ConnectionToServer = DataCenterFactory.CreateConnection(server, provisioningUpperItemDetail.id, hardware as Asset, provisioningLowerItemDetail.id, provisioningRelType.id, string.Empty);
            try
            {
                ItemRelation rel = dataWrapper.CreateItemRelation(server.id, provisioningUpperItemDetail, (hardware as Asset).id, provisioningLowerItemDetail, string.Empty);
                if (rel == null)
                {
                    hardware.ConnectionToServer = null;
                    errorMessage = "Konnte Verbindung nicht anlegen.";
                    return false;
                }

                hardware.ConnectionToServer.id = rel.id;

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
            em.ConnectionToEnclosure = DataCenterFactory.CreateConnection(em, mountUpperItemDetail.id, enclosure, mountLowerItemDetail.id, mountingRelType.id, slot);

            try
            {
                ItemRelation rel = dataWrapper.CreateItemRelation(em.id, mountUpperItemDetail, enclosure.id, mountLowerItemDetail, slot);

                if (rel == null)
                {
                    em.ConnectionToEnclosure = null;
                    errorMessage = "Konnte Verbindung nicht anlegen.";
                    return false;
                }

                em.ConnectionToEnclosure.id = rel.id;

                em.Status = targetStatus;
                em.RoomId = enclosure.RoomId;

                SetAssetStatus(em, targetStatus, enclosure.RoomId, out errorMessage);

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
                rackmountable.Status = targetStatus;
                ItemRelation ir = dataWrapper.GetItemRelation(rackmountable.ConnectionToRack.id);
                dataWrapper.DeleteItemRelation(ir);
                Item item = dataWrapper.GetItemById(rackmountable.id);
                item.statusId = itemStatusValues[StatusConverter.GetTextForStatus(targetStatus).ToLower()];
                dataWrapper.ChangeItem(item);
                rackmountable.ConnectionToRack = null;
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
                ItemRelation ir = dataWrapper.GetItemRelation(em.ConnectionToEnclosure.id);
                dataWrapper.DeleteItemRelation(ir);
                if (!SetAssetStatus(em, targetStatus, out errorMessage))
                    return false;

                em.Status = targetStatus;
                em.ConnectionToEnclosure = null;
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
            foreach (ItemRelation itemRelation in dataWrapper.GetItemRelationsForItem(asset.id))
            {
                dataWrapper.DeleteItemRelation(itemRelation);
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
            if (!SetAssetStatus(asset, AssetStatus.PendingScrap, asset.RoomId, out errorMessage))
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
            if (!SetAssetStatus(asset, AssetStatus.SwitchedOff, asset.RoomId, out errorMessage))
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
                    SetAssetStatus(bic, enclosure.Status, enclosure.RoomId, out errorMessage);
            }
            foreach (BladeAppliance ba in bladeAppliances.Where(b => b.ConnectionToEnclosure.SecondItem.id == enclosure.id))
            {
                if (deleteConnections)
                    RemoveConnectionToEnclosure(ba, enclosure.Status, out errorMessage);
                else
                    SetAssetStatus(ba, enclosure.Status, enclosure.RoomId, out errorMessage);
            }
        }

        /// <summary>
        /// Setzt den Status eines Assets von Frei auf Reserviert
        /// </summary>
        /// <param name="asset">Betroffenes Asset</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool ReserveAsset(Asset asset, string additionalInformation, out string errorMessage)
        {
            errorMessage = string.Empty;
            try
            {
                if (!SetAssetStatus(asset, AssetStatus.Reserved, 0, out errorMessage))
                    return false;
                if (!string.IsNullOrEmpty(additionalInformation))
                {
                    Item item = dataWrapper.GetItemById(asset.id);
                    if (item == null)
                    {
                        errorMessage = "Item nicht gefunden";
                        return false;
                    }
                    if (string.IsNullOrWhiteSpace(item.remarks))
                        item.remarks = "Reserviert für " + additionalInformation;
                    else
                        item.remarks += "\r\nReserviert für " + additionalInformation;
                    dataWrapper.ChangeItem(item);
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false; ;
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
                    dataWrapper.DeactivateObject(dataWrapper.GetItemById(server.id));
                    dataWrapper.DeleteItemRelation(dataWrapper.GetItemRelation(hardware.ConnectionToServer.id));
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
            if (!SetAssetStatus(asset, AssetStatus.InProduction, asset.RoomId, out errorMessage))
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
                Item item = dataWrapper.GetItemById(asset.id);
                if (item == null)
                {
                    errorMessage = "Item nicht gefunden";
                    return false;
                }
                item.statusId = itemStatusValues[StatusConverter.GetTextForStatus(status).ToLower()];
                if (dataWrapper.ChangeItem(item) == null)
                {
                    errorMessage = "Konnte Item nicht ändern.";
                    return false;
                }

                asset.Status = status;
                asset.RoomId = roomId;
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
            try
            {
                Item item = new Item()
                {
                    name = name,
                    productId = productId,
                    status = itemStatusValues[StatusConverter.GetTextForStatus(AssetStatus.InProduction).ToLower()],
                };
                item = dataWrapper.CreateItem(item);
                if (item == null)
                    return false;
                server = DataCenterFactory.CreateProvisionedSystem(item);
                Dictionary<string, string> info = new Dictionary<string, string>();
                info.Add("IP-Adresse", ip);
                info.Add("Hostname", hostname);
                info.Add("Arbeitsspeicher", ram);
                info.Add("Betriebssystem", operatingSystem);
                info.Add("CPUs", cpus);
                assystConnector.JsonHelper.PutAttributeValuesToNotes(info, item, dataWrapper);

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
