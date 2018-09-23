using assystConnector.Objects;
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
                item.roomId = s.StoreRoomId;
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
                if (!SetAssetStatus(em, targetStatus, s.StoreRoomId, out errorMessage))
                    return false;

                em.RoomId = s.StoreRoomId;
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
                SetAssetStatus(asset, AssetStatus.Scrap, s.StoreRoomId, out errorMessage);

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
                    if (!SetAssetStatus(server, AssetStatus.Scrap, s.StoreRoomId, out errorMessage))
                        return false;
                    dataWrapper.DeactivateObject(dataWrapper.GetItemById(server.id));
                    dataWrapper.DeleteItemRelation(dataWrapper.GetItemRelation(hardware.ConnectionToServer.id));
                    hardware.ConnectionToServer = null;
                }
            }
            return SetAssetStatus(asset, AssetStatus.Free, s.StoreRoomId, out errorMessage);
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
        private bool SetAssetStatus(Asset asset, AssetStatus status, int roomId, out string errorMessage)
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
                if (roomId > 0)
                    item.roomId = roomId;
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
        /// Legt eine Liste von Items zusammen mit dem Lieferschein in assyst und in der CMDB an.
        /// </summary>
        /// <param name="items">Liste der Items</param>
        /// <param name="shippingNote">Lieferschein-Objekt</param>
        /// <param name="errorMessage">Ausgabe von Fehlermeldungen</param>
        /// <param name="showWorkingProgress">Delegat für die Übermittlung des Fortschritts</param>
        /// <returns></returns>
        public bool CreateShipment(Item[] items, ShippingNote shippingNote, out string errorMessage, Action<int> showWorkingProgress)
        {
            try
            {
                errorMessage = string.Empty;
                StringBuilder sb = new StringBuilder();

                RelationType shippingNoteRelType = RelationTypes.Single(rt => rt.shortCode.Equals(s.ShippingNoteRelationType, StringComparison.CurrentCultureIgnoreCase));
                RelationDetail shippingNoteRelDetail = dataWrapper.GetRelationDetailsByRelationType(shippingNoteRelType.id).Single(d => d.relationshipRole == 2),
                    itemRelDetail = dataWrapper.GetRelationDetailsByRelationType(shippingNoteRelType.id).Single(d => d.relationshipRole == 1);

                for (int i = 0; i < items.Length; i++)
                {
                    showWorkingProgress(i + 1);
                    Item item = items[i];
                    try
                    {
                        Item newItem = hub.CreateStoredItem(item);
                        if (newItem != null)
                        {
                            if (ShipmentItemCreated != null)
                                ShipmentItemCreated(item);
                            dataWrapper.CreateItemRelation(shippingNote.id, shippingNoteRelDetail, newItem.id, itemRelDetail, string.Empty);
                        }
                        else
                            sb.AppendLine(string.Format("Konnte Item {0} (S/N {1}) nicht anlegen.", item.name, item.serialNumber));

                    }
                    catch (Exception ex)
                    {
                        sb.AppendLine(string.Format("Fehler bei Item {0} (S/N {1}): {2}", item.name, item.serialNumber, ex.Message));
                    }
                } // Ende foreach Items

                if (sb.Length > 0)
                    errorMessage = sb.ToString();

                return string.IsNullOrEmpty(errorMessage);

            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        /// <summary>
        /// Erzeugt einen Wartungsvertrag in assyst
        /// </summary>
        /// <param name="serviceContract">Zu erzeugender Wartungsvertrag</param>
        /// <param name="attachment">Optionaler Dateianhang</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns></returns>
        public bool CreateServiceContract(ServiceContract serviceContract, FileAttachment attachment, out string errorMessage, out int itemId)
        {
            errorMessage = string.Empty;
            itemId = -1;
            try
            {
                StringBuilder sb = new StringBuilder();

                Item item = new Item()
                {
                    acquiredDate = assystConnector.RestApiConnector.GetDateZuluString(serviceContract.BeginningDate),
                    expiryDate = assystConnector.RestApiConnector.GetDateZuluString(serviceContract.ExpiryDate),
                    name = serviceContract.Name,
                    shortCode = serviceContract.Name.ToUpper(),
                    discontinued = false,
                    statusId = itemStatusValues[StatusConverter.GetTextForStatus(serviceContract.Status).ToLower()],
                    roomId = s.StoreRoomId,
                    departmentId = s.ownDepartmentId,
                    supplierId = serviceContract.SupplierName,
                    remarks = serviceContract.Remarks,
                    productId = serviceContractProductId,
                    supplierRef = serviceContract.SupplierReference,
                    causeChange = false,
                    causeIncident = false,
                    causeProblem = false,
                    logChange = false,
                    logIncident = false,
                    logProblem = false,
                };

                item = dataWrapper.CreateItem(item);

                if (item == null)
                    sb.Append("Item konnte nicht angelegt werden");
                else
                {
                    itemId = item.id;
                    if (attachment != null && !string.IsNullOrEmpty(attachment.Name))
                    {
                        if (dataWrapper.CreateAttachment(attachment.Name, item.id, attachment.Content) == null)
                        {
                            sb.Append("Datei konnte nicht angehängt werden");
                        }
                    }
                }


                if (sb.Length > 0)
                    errorMessage = sb.ToString();
                return string.IsNullOrEmpty(errorMessage);

            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        /// <summary>
        /// Erzeugt einen Dateianhang für einen Wartungsvertrag
        /// </summary>
        /// <param name="serviceContract">Wartungsvertrag</param>
        /// <param name="attachment">Dateianhang</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <param name="attachmentId">ID des neu erzeugten Anhangs</param>
        /// <returns></returns>
        public bool CreateServiceContractAttachment(ServiceContract serviceContract, FileAttachment attachment, out string errorMessage, out int attachmentId)
        {
            errorMessage = string.Empty;
            attachmentId = -1;
            try
            {
                if (attachment != null && !string.IsNullOrEmpty(attachment.Name))
                {
                    Attachment att = dataWrapper.CreateAttachment(attachment.Name, serviceContract.id, attachment.Content);
                    if (att == null)
                    {
                        errorMessage = "Datei konnte nicht angehängt werden";
                        return false;
                    }
                    attachmentId = att.id;
                    return true;
                }
                else
                {
                    errorMessage = "Keine gültige Datei angegeben";
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }

        }

        /// <summary>
        /// Erzeugt einen Lieferschein in assyst
        /// </summary>
        /// <param name="shippingNote">Lieferscheinobjekt</param>
        /// <returns></returns>
        private Item GetOrCreateAssystItemFromShippingNoteItem(ShippingNote shippingNote)
        {
            Item item;
            if (shippingNote.id == 0)
                item = dataWrapper.GetItemByShortCode(shippingNote.Name);
            else
                item = dataWrapper.GetItemById(shippingNote.id);
            if (item == null)
            {
                item = new Item()
                {
                    name = shippingNote.Name,
                    shortCode = shippingNote.Name.ToUpper(),
                    productId = shippingNoteProductId,
                    roomId = Properties.Settings.Default.StoreRoomId,
                    acquiredDate = assystConnector.RestApiConnector.GetDateZuluString(shippingNote.ShipmentDate),
                    statusId = dataWrapper.GetItemStatusByName(StatusConverter.GetTextForStatus(shippingNote.Status)).id,
                    supplierId = shippingNote.Supplier,
                    departmentId = s.ownDepartmentId,
                    causeChange = false,
                    causeIncident = false,
                    causeProblem = false,
                    logChange = false,
                    logIncident = false,
                    logProblem = false,
                    discontinued = false,
                };
                item = dataWrapper.CreateItem(item);
                if (item != null)
                {
                    shippingNote.id = item.id;
                    if (shippingNote.AttachmentId == 0 && shippingNote.AttachmentContent != null)
                    {
                        Attachment attachment = dataWrapper.CreateAttachment(shippingNote.AttachmentFileName, item.id, shippingNote.AttachmentContent);
                        if (attachment != null)
                            shippingNote.AttachmentId = attachment.id;
                    }
                }
            }
            return item;
        }

        /// <summary>
        /// Sucht einen existierenden Lieferschein in der CMDB oder legt einen neuen an
        /// </summary>
        /// <param name="supplierId">Id des Herstellers</param>
        /// <param name="shipmentId">Nummer des Lieferscheins</param>
        /// <param name="shipmentDate">Datum des Lieferscheins</param>
        /// <returns></returns>
        private ShippingNote CreateShippingNoteObject(int supplierId, string shipmentId, DateTime shipmentDate)
        {
            ShippingNote sn = new ShippingNote()
            {
                Name = CreateShipmentName(shipmentId, shipmentDate),
                Status = AssetStatus.InProduction,
                Supplier = supplierId,
                ShipmentDate = shipmentDate,
            };
            return sn;
        }

        /// <summary>
        /// Prüft, ob ein Lieferschein vorhanden ist, falls nicht, wird er angelegt.
        /// </summary>
        /// <param name="shippingNote"></param>
        /// <returns></returns>
        public bool CreateShippingNote(ShippingNote shippingNote)
        {
            return GetOrCreateAssystItemFromShippingNoteItem(shippingNote) != null;
        }

        /// <summary>
        /// Liest einen Lieferschein aus assyst, oder gibt Null zurück, falls keiner gefunden wird
        /// </summary>
        /// <param name="date">Lieferdatum</param>
        /// <param name="shipmentId">Lieferscheinnummer</param>
        /// <returns></returns>
        public ShippingNote GetShippingNote(DateTime date, string shipmentId)
        {
            Item item = dataWrapper.GetItemByShortCode(CreateShipmentName(shipmentId, date));
            if (item == null)
                return CreateShippingNoteObject(0, shipmentId, date);
            Attachment attachment = null;
            foreach (Attachment att in dataWrapper.GetAttachmentsForItem(item.id))
            {
                if (att.fileName.EndsWith(".pdf", StringComparison.CurrentCultureIgnoreCase))
                {
                    attachment = dataWrapper.GetAttachmentForItem(item.id, att.id);
                    break;
                }
            }
            return DataCenterFactory.CreateShippingNote(item, attachment);
        }

        /// <summary>
        /// Erzeugt einen Namen für einen Lieferschein aus Lieferscheinnummer und Lieferdatum
        /// </summary>
        /// <param name="shipmentId">Lieferscheinnummer</param>
        /// <param name="shipmentDate">Lieferdatum</param>
        /// <returns></returns>
        private static string CreateShipmentName(string shipmentId, DateTime shipmentDate)
        {
            return string.Format("{0:yyyyMMdd}-{1}", shipmentDate, shipmentId);
        }

        /// <summary>
        /// Erzeugt ein auf Lager liegendes Item
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public Item CreateStoredItem(Item item)
        {
            // Standardwerte setzen
            item.roomId = Properties.Settings.Default.StoreRoomId;
            item.statusId = GetStatusId(StatusConverter.GetTextForStatus(AssetStatus.Stored));
            item.departmentId = Properties.Settings.Default.ownDepartmentId;
            item.causeChange = true;
            item.causeIncident = true;
            item.causeProblem = true;
            return dataWrapper.CreateItem(item);
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
                int productId = Products.Single(p => p.name.Equals(s.ServerProductClassName, StringComparison.CurrentCultureIgnoreCase)).id;
                int supplierId = suppliers.Single(sp => sp.name.Equals(s.UnknownName, StringComparison.CurrentCultureIgnoreCase)).id;
                Item item = new Item()
                {
                    name = name,
                    acquiredDate = GetDateZuluString(DateTime.Today),
                    departmentId = s.ownDepartmentId,
                    discontinued = false,
                    productId = productId,
                    remarks = purpose,
                    roomId = s.StoreRoomId,
                    shortCode = name.ToUpper(),
                    statusId = itemStatusValues[StatusConverter.GetTextForStatus(AssetStatus.InProduction).ToLower()],
                    supplierId = supplierId,
                    causeChange = true,
                    causeIncident = true,
                    causeProblem = true,
                    logChange = false,
                    logIncident = false,
                    logProblem = false,
                };
                item = dataWrapper.CreateItem(item);
                if (item == null)
                    return false;
                server = DataCenterFactory.CreateProvisionedSystem(item, s.ServerProductClassName);
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

        #region Wartungsverträge

        /// <summary>
        /// Liefert alle Wartungsverträge mit dem Status ausgesondert zurück, inklusive eventuell vorhandener Attachment- oder ItemRelation-Ids
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ServiceContract> GetServiceContractsToDeactivate()
        {
            Product p = dataWrapper.GetProductByName(s.ServiceContractProductName);
            foreach (Item item in dataWrapper.GetItemsByProductAndStatus(p.id, itemStatusValues[StatusConverter.GetTextForStatus(AssetStatus.Scrap).ToLower()]))
            {
                yield return DataCenterFactory.CreateServiceContract(item, dataWrapper.GetAttachmentsForItem(item.id), dataWrapper.GetItemRelationsForItem(item.id));
            }
        }

        /// <summary>
        /// Liefert alle Wartungsverträge zurück, die nicht deaktiviert sind, und die im Feld Lieferanten-Referenz den gesuchten Eintrag besitzen
        /// </summary>
        /// <param name="mark">Gesuchter Eintrag</param>
        /// <returns></returns>
        public IEnumerable<ServiceContract> GetServiceContractsMarkedBy(string mark)
        {
            Product p = dataWrapper.GetProductByName(s.ServiceContractProductName);
            foreach (Item item in dataWrapper.GetItemsByProduct(p.id))
            {
                if (!string.IsNullOrEmpty(item.supplierRef) && item.supplierRef.Equals(mark, StringComparison.CurrentCultureIgnoreCase))
                    yield return DataCenterFactory.CreateServiceContract(item, dataWrapper.GetAttachmentsForItem(item.id), dataWrapper.GetItemRelationsForItem(item.id));
            }
        }

        /// <summary>
        /// Liefert alle Wartungsverträge zurück, die nicht deaktiviert sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ServiceContract> GetServiceContracts()
        {
            Product p = dataWrapper.GetProductByName(s.ServiceContractProductName);
            foreach (Item item in dataWrapper.GetItemsByProduct(p.id))
            {
                yield return DataCenterFactory.CreateServiceContract(item, null, null);
            }
        }

        /// <summary>
        /// Löscht alle Attachments zu einem Wartungsvertrag
        /// </summary>
        /// <param name="serviceContract">Wartungsvertrag, der betroffen ist.</param>
        public void DeleteAttachments(ServiceContract serviceContract)
        {
            foreach (int id in serviceContract.AttachmentIds)
            {
                dataWrapper.DeleteAttachment(new Attachment() { id = id, linkedObjectId = serviceContract.id });
            }
            serviceContract.AttachmentIds.Clear();
        }

        /// <summary>
        /// Löscht alle Verbindungen zu einem Wartungsvertrag
        /// </summary>
        /// <param name="serviceContract"></param>
        public void DeleteConnections(ServiceContract serviceContract)
        {
            System.Threading.Tasks.Parallel.ForEach(serviceContract.ConnectionsIds, idToDelete =>
            {
                dataWrapper.DeleteItemRelation(new ItemRelation() { id = idToDelete });
            });
            serviceContract.ConnectionsIds.Clear();
        }

        /// <summary>
        /// Deaktiviert einen Wartungsvertrag
        /// </summary>
        /// <param name="serviceContract">Wartungsvertrag zum Deaktivieren</param>
        public void DeleteServiceContract(ServiceContract serviceContract)
        {
            Item item = dataWrapper.GetItemById(serviceContract.id);
            dataWrapper.DeactivateObject(item);
        }

        /// <summary>
        /// Liefert alle Lieferscheine zurück, deren Namen mit dem angegebenen Datumsteil beginnt
        /// </summary>
        /// <param name="year">Datumsteil im Format yyyyMM</param>
        /// <returns></returns>
        public IEnumerable<ShippingNote> GetShippingNotesForDate(string year)
        {
            foreach (Item item in dataWrapper.GetItemsByShortCodeAndProductId(year, shippingNoteProductId))
            {
                yield return DataCenterFactory.CreateShippingNote(item, null);
            }
        }

        /// <summary>
        /// Fügt alle Items, die mit einem Lieferschein verbunden sind, dem Wartungsvertrag hinzu
        /// </summary>
        /// <param name="shippingNote">Lieferschein</param>
        /// <param name="serviceContract">Wartungsvertrag</param>
        /// <param name="errorMessage">Fehlermeldung</param>
        /// <returns>Gibt false zurück, falls etwas fehlgeschlagen ist</returns>
        public bool ConnectShippingNoteObjectsToServiceContract(ShippingNote shippingNote, ServiceContract serviceContract, out string errorMessage)
        {
            errorMessage = string.Empty;
            try
            {
                RelationType shippingNoteRelType = RelationTypes.Single(rt => rt.shortCode.Equals(s.ShippingNoteRelationType, StringComparison.CurrentCultureIgnoreCase));
                IEnumerable<ItemRelation> relations = dataWrapper.GetItemRelationsForItem(shippingNote.id).Where(r => r.relationTypeId == shippingNoteRelType.id);
                foreach (ItemRelation relation in relations)
                {
                    dataWrapper.CreateItemRelation(relation.mainItemId, dataWrapper.GetRelationDetail(relation.relatedDetailId), serviceContract.id, dataWrapper.GetRelationDetail(relation.mainDetailId), string.Empty);
                }
                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        #endregion

    }
}
