using assystConnector.Objects;
using RZManager.Objects;
using RZManager.Objects.Assets;
using System.Collections.Generic;
using System.Linq;

namespace RZManager.BusinessLogic
{
    public static class DataCenterFactory
    {
        /// <summary>
        /// Erzeugt ein Rack
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static Rack CreateRack(Item item, Product p)
        {
            return new Rack()
            {
                id = item.id,
                Name = item.name,
                MaxHeight = 42,
                RoomId = item.roomId,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt eine Power Distribution Unit
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static PDU CreatePDU(Item item, Product p)
        {
            return new PDU()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt einen SAN-Switch
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static SanSwitch CreateSanSwitch(Item item, Product p)
        {
            return new SanSwitch()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt ein Storage-System
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static StorageSystem CreateStorageSystem(Item item, Product p)
        {
            return new StorageSystem()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt ein Backup-System
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static BackupSystem CreateBackupSystem(Item item, Product p)
        {
            return new BackupSystem()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt ein BladeCenter
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static BladeEnclosure CreateBladeEnclosure(Item item, EnclosureTypeTemplate enclosureType, Product p)
        {
            return new BladeEnclosure()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
                EnclosureType = enclosureType,
            };
        }

        /// <summary>
        /// Erzeugt ein Blade-Interconnect
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static BladeInterconnect CreateBladeInterconnect(Item item, Product p)
        {
            return new BladeInterconnect()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt einen RackServer
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static RackServer CreateRackServer(Item item, Product p)
        {
            return new RackServer()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt einen BladeServer
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static BladeServer CreateBladeServer(Item item, Product p)
        {
            return new BladeServer()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }
        /// <summary>
        /// Erzeugt eine Hardware-Appliance
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static HardwareAppliance CreateHardwareAppliance(Item item, Product p)
        {
            return new HardwareAppliance()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt eine Blade-Appliance
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static BladeAppliance CreateBladeAppliance(Item item, Product p)
        {
            return new BladeAppliance()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                ProductName = p.name,
            };
        }

        /// <summary>
        /// Erzeugt ein generisches, in ein Rack einbaubares System
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <param name="productClassName">Name der Produktklasse</param>
        /// <param name="productName">Name des Produkts</param>
        /// <returns></returns>
        public static GenericRackMountable CreateGenericRackMountable(Item item, string productClassName, string productName)
        {
            return new GenericRackMountable()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                TypeName = string.Format("{0}: {1}", productClassName, productName),
                ProductName = productName,
            };
        }

        /// <summary>
        /// Erzeugt ein bereitgestelltes System (Appliance, ESX-Host oder Server
        /// </summary>
        /// <param name="item">assyst-Item</param>
        /// <returns></returns>
        public static ProvisionedSystem CreateProvisionedSystem(Item item, string type)
        {
            return new ProvisionedSystem()
            {
                id = item.id,
                Name = item.name,
                RoomId = item.roomId,
                Serialnumber = item.serialNumber,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                ProductId = item.productId,
                TypeName = type,
            };
        }

        /// <summary>
        /// Erzeugt einen Lieferschein, zusammen mit einem optionalen Dateianhang
        /// </summary>
        /// <param name="item">assysst-Item</param>
        /// <param name="attachment">assyst-Attachment</param>
        /// <returns></returns>
        public static ShippingNote CreateShippingNote(Item item, Attachment attachment)
        {
            return new ShippingNote()
            {
                id = item.id,
                Name = item.name,
                Status = AssetStatus.InProduction,
                SupplierId = item.supplierId,
                ShipmentDate = System.Convert.ToDateTime(item.acquiredDate),
                AttachmentId = attachment != null ? attachment.id : 0,
                AttachmentFileName = attachment != null ? attachment.fileName : string.Empty,
                AttachmentContent = attachment != null ? attachment.attachment : null,
            };
        }

        /// <summary>
        /// Erzeugt einen Wartungsvertrag, zusammen mit einem optionalen Dateianhang
        /// </summary>
        /// <param name="item">assysst-Item</param>
        /// <param name="attachments">Datei-Anhänge</param>
        /// <param name="connections">Verbindungen zu anderen Objekten</param>
        /// <returns></returns>
        public static ServiceContract CreateServiceContract(Item item, IEnumerable<Attachment> attachments, IEnumerable<ItemRelation> connections)
        {
            ServiceContract sc = new ServiceContract()
            {
                id = item.id,
                Name = item.name,
                Status = StatusConverter.GetStatusFromText(item.statusName),
                SupplierId = item.supplierId,
                SupplierReference = item.supplierRef,
                BeginningDate = System.Convert.ToDateTime(item.acquiredDate),
                ExpiryDate = System.Convert.ToDateTime(item.expiryDate),
            };
            if (attachments != null && attachments.Count() > 0)
                sc.AttachmentIds.AddRange(attachments.Select(a => a.id));
            if (connections != null && connections.Count() > 0)
                sc.ConnectionsIds.AddRange(connections.Select(c => c.id));
            return sc;
        }

        /// <summary>
        /// Erzeugt eine Verbindung zwischen zwei Items
        /// </summary>
        /// <param name="firstItem">Erstes Item</param>
        /// <param name="firstDetail">Relation-Detail-Id für das erste Item</param>
        /// <param name="secondItem">Zweites Item</param>
        /// <param name="secondDetail">Relation-Detail-Id für das zweite Item</param>
        /// <param name="relationType">RelationType-Id</param>
        /// <param name="content">Inhalt der Verbindung</param>
        /// <returns></returns>
        public static Connection CreateConnection(Asset firstItem, int firstDetail, Asset secondItem, int secondDetail, int relationType, string content)
        {
            return new Connection()
            {
                FirstItem = firstItem,
                FirstDetail = firstDetail,
                SecondItem = secondItem,
                SecondDetail = secondDetail,
                RelationType = relationType,
                Content = content,
            };
        }
    }
}
