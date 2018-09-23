using assystConnector.Objects;
using RZManager.Objects;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        /// <summary>
        /// Füllt die Daten aus der CMDB (Langlaufende Funktion)
        /// </summary>
        public void Fill()
        {
            int ctr = 0;

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Warte auf Initialisierung");

            while (!initFinished) // Auf vollständige Initialisierung warten
            {
                System.Threading.Thread.Sleep(100);
            }

            assetsForItemId = new Dictionary<int, Asset>(500);

            relationsToProvisionable = new List<ItemRelation>(500);

            suppliers = new List<Supplier>(500);
            productClasses = new List<ProductClass>(500);

            SerialLookup = new Dictionary<string, Asset>(500);

            genericRackMountables = new List<GenericRackMountable>(500);

            ActiveWorkers = new List<Type>();

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lade Hersteller aus assyst");

            suppliers.AddRange(dataWrapper.GetSuppliers().OrderBy(s => s.name));

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lade Produktklassen aus assyst");

            productClasses.AddRange(dataWrapper.GetProductClassesByGenericClass(dataWrapper.GetGenericClassByName(s.DataCenterGenericClassName).id));

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lade Produkte aus assyst");
            ReadProducts(productClasses.Select(pc => pc.id));

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lese Räume aus assyst.");
            ReadRooms();

            if (InitializationCompleted != null)
                InitializationCompleted(this, new EventArgs());

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lese Racks, PDUs, Blade-System usw. aus assyst.");
            ReadRacks();

            ReadPDUs();

            ReadSanSwitches();

            ReadStoragesystems();

            ReadBackupsystems();

            ReadRackservers();

            ReadBladeEnclosures();

            ReadBladeservers();

            ReadBladeInterconnects();

            ReadBladeAppliances();

            ReadHardwareAppliances();

            ReadEsxHosts();

            bool connectionsToRackStarted = false, connectionsForBladesStarted = false, connectionsToProvisionedSystemsStarted = false;

            while (!connectionsToRackStarted || !connectionsForBladesStarted || !connectionsToProvisionedSystemsStarted || ActiveWorkers.Count() > 0)
            {
                if (!connectionsToRackStarted && !ActiveWorkersContains(typeof(Rack)) && !ActiveWorkersContains(typeof(RackMountable)))
                {
                    if (NextPhaseStarted != null)
                        NextPhaseStarted(ctr++, "Erstelle Verknüpfungen zu den Racks.");
                    SetConnectionsToRacks();
                    connectionsToRackStarted = true;
                }
                if (!connectionsForBladesStarted && !ActiveWorkersContains(typeof(BladeEnclosure)) && !ActiveWorkersContains(typeof(EnclosureMountable)))
                {
                    if (NextPhaseStarted != null)
                        NextPhaseStarted(ctr++, "Erstelle Verknüpfungen zu den Blade Enclosures.");
                    SetConnectionsToEnclosures();
                    connectionsForBladesStarted = true;
                }
                if (!connectionsToProvisionedSystemsStarted && !ActiveWorkersContains(typeof(IProvisioningSystem)) && !ActiveWorkersContains(typeof(ProvisionedSystem)))
                {
                    if (NextPhaseStarted != null)
                        NextPhaseStarted(ctr++, "Erstelle Verknüpfungen zu Server, ESX-Hosts usw.");
                    SetConnectionsToProvisionedSystems();
                    connectionsToProvisionedSystemsStarted = true;
                }
                System.Threading.Thread.Sleep(500);
            }

            // Verbindungen und Server müssen noch geladen werden

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Führe Berechnungen durch.");
            CalculateNumbers();

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lade belegte Einheiten.");

            RetrieveBlockingInformation();

            OnDataChanged();
        }

        /// <summary>
        /// Prüft, ob ein Aktiver Backgroundworker eines bestimmten Typs oder dessen Subtyps enthalten ist
        /// </summary>
        /// <param name="type">Typ, nach dem gesucht wird</param>
        /// <returns></returns>
        private bool ActiveWorkersContains(Type type)
        {
            foreach (Type t in ActiveWorkers)
            {
                if (type.IsAssignableFrom(t))
                    return true;
            }
            return false;
        }

        /// <summary>
        /// Setzt Verbindungen zu Server, ESX-Hosts und anderen bereitgestellten Systemen
        /// </summary>
        private void SetConnectionsToProvisionedSystems()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(ProvisionedSystem);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted("ConnectionsToServer");
                // Zuerst fehlende Items ermitteln und aus assyst nachladen
                List<int> missingIds = new List<int>(300);
                foreach (ItemRelation ir in relationsToProvisionable)
                {
                    if (!assetsForItemId.ContainsKey(ir.mainItemId))
                        missingIds.Add(ir.mainItemId);
                }
                foreach (Item item in GetMissingItems(missingIds))
                {
                    Product p = Products.SingleOrDefault(p1 => p1.id == item.productId);
                    ProvisionedSystem ps = new ProvisionedSystem() { id = item.id, Name = item.name, RoomId = item.roomId, Serialnumber = item.serialNumber, Status = StatusConverter.GetStatusFromText(item.statusName), TypeName = p.name };
                    lock (assetsForItemId)
                        assetsForItemId.Add(ps.id, ps);
                    lock (provisionedSystems)
                        provisionedSystems.Add(ps);
                }
                // Blade Server mit Servern verbinden
                foreach (BladeServer bs in bladeServers)
                {
                    ItemRelation ir = relationsToProvisionable.SingleOrDefault(r => r.relatedItemId == bs.id);
                    if (ir == null)
                        continue;
                    bs.ConnectionToServer = new Connection() { id = ir.id, FirstItem = assetsForItemId[ir.mainItemId], FirstDetail = ir.mainDetailId, SecondItem = bs, SecondDetail = ir.relatedDetailId, ConnectionType = ir.relationTypeId };
                }
                // Rack Server mit Servern verbinden
                foreach (RackServer rs in rackServers)
                {
                    ItemRelation ir = relationsToProvisionable.SingleOrDefault(r => r.relatedItemId == rs.id);
                    if (ir == null)
                        continue;
                    rs.ConnectionToServer = new Connection() { id = ir.id, FirstItem = assetsForItemId[ir.mainItemId], FirstDetail = ir.mainDetailId, SecondItem = rs, SecondDetail = ir.relatedDetailId, ConnectionType = ir.relationTypeId };
                }
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted("ConnectionsToServer");
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Setzt Verbindungen zu Racks
        /// </summary>
        private void SetConnectionsToRacks()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(Connection);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                // Zuerst fehlende Items ermitteln und aus assyst nachladen
                List<int> missingIds = new List<int>(300);
                foreach (Rack rack in racks)
                {
                    foreach (ItemRelation ir in relationsToRack.Where(r => r.relatedItemId == rack.id))
                    {
                        if (!assetsForItemId.ContainsKey(ir.mainItemId))
                            missingIds.Add(ir.mainItemId);
                    }
                }
                foreach (Item item in GetMissingItems(missingIds))
                {
                    Product p = Products.SingleOrDefault(p1 => p1.id == item.productId);
                    ProductClass pc = productClasses.SingleOrDefault(pc1 => pc1.id == p.productClassId);
                    GenericRackMountable rm = DataCenterFactory.CreateGenericRackMountable(item, pc.name, p.name);
                    lock (assetsForItemId)
                        assetsForItemId.Add(rm.id, rm);
                    lock (genericRackMountables)
                        genericRackMountables.Add(rm);
                    if (!string.IsNullOrWhiteSpace(rm.Serialnumber))
                    {
                        lock (SerialLookup)
                            SerialLookup.Add(rm.Serialnumber, rm);
                    }
                }
                // Racks mit ins Rack einbaubaren Elementen verbinden
                foreach (Rack rack in racks)
                {
                    foreach (ItemRelation ir in relationsToRack.Where(r => r.relatedItemId == rack.id))
                    {
                        RackMountable rm;
                        if (assetsForItemId[ir.mainItemId] is RackMountable)
                            rm = assetsForItemId[ir.mainItemId] as RackMountable;
                        else
                            continue;
                        rm.ConnectionToRack = new Connection() { id = ir.id, Content = ir.remarks, FirstItem = rm, FirstDetail = ir.mainDetailId, SecondItem = rack, SecondDetail = ir.relatedDetailId, ConnectionType = ir.relationTypeId };
                    }
                }
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Setzt Verbindungen zwischen Blade Enclosures und Blades
        /// </summary>
        private void SetConnectionsToEnclosures()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(BladeInterconnect);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted("ConnectionsToEnclosures");
                foreach (BladeEnclosure enc in bladeEnclosures)
                {
                    int ctr = 0;
                    foreach (ItemRelation ir in relationsToBladeEnclosure.Where(r => r.relatedItemId == enc.id))
                    {
                        EnclosureMountable bs;
                        if (assetsForItemId.ContainsKey(ir.mainItemId))
                        {
                            if (assetsForItemId[ir.mainItemId] is EnclosureMountable)
                            {
                                bs = assetsForItemId[ir.mainItemId] as EnclosureMountable;
                                ctr++;
                            }
                            else
                                continue;
                        }
                        else
                            continue;
                        bs.ConnectionToEnclosure = new Connection() { id = ir.id, Content = ir.remarks, FirstItem = bs, FirstDetail = ir.mainDetailId, SecondItem = enc, SecondDetail = ir.relatedDetailId, ConnectionType = ir.relationTypeId };
                    }
                }
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted("ConnectionsToEnclosures");
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liefert zu angegebenen Item-IDs die fehlenden Items zurück und füllt die Produkte und Produktklassen
        /// </summary>
        /// <param name="missingIds">Liste der Item-Ids, die gesucht werden</param>
        /// <returns></returns>
        private IEnumerable<Item> GetMissingItems(IEnumerable<int> missingIds)
        {
            List<int> missingProductIds = new List<int>();
            List<Item> missingItems = new List<Item>(dataWrapper.GetItemsByIds(missingIds));
            foreach (Item item in missingItems)
            {
                Product p = Products.SingleOrDefault(p1 => p1.id == item.productId);
                if (p == null && !missingProductIds.Contains(item.productId))
                    missingProductIds.Add(item.productId);

            }
            if (missingProductIds.Count > 0)
            {
                List<int> missingProductClassIds = new List<int>();
                IEnumerable<Product> missingProducts = dataWrapper.GetProducts(missingProductIds);
                foreach (Product p in missingProducts)
                {
                    ProductClass pc = productClasses.SingleOrDefault(pc1 => pc1.id == p.productClassId);
                    if (pc == null && !missingProductClassIds.Contains(p.productClassId))
                    {
                        missingProductClassIds.Add(p.productClassId);
                    }
                }
                if (missingProductClassIds.Count > 0)
                {
                    lock (productClasses)
                        productClasses.AddRange(dataWrapper.GetProductClasses(missingProductClassIds));
                }
                lock (Products)
                    Products.AddRange(missingProducts);
            }
            return missingItems;
        }

        /// <summary>
        /// Liest SAN-Switche aus der Datenbank
        /// </summary>
        private void ReadSanSwitches()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(SanSwitch);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                sanSwitches = new List<SanSwitch>(100);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.SanSwitchProductClassName, StringComparison.CurrentCultureIgnoreCase));
                IEnumerable<Item> items = dataWrapper.GetItemsByProductClass(pc.id);
                foreach (Item item in items)
                {
                    SanSwitch sanswitch = DataCenterFactory.CreateSanSwitch(item, Products.Single(p => p.id == item.productId));
                    sanSwitches.Add(sanswitch);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, sanswitch);
                    }
                    if (!string.IsNullOrWhiteSpace(sanswitch.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(sanswitch.Serialnumber, sanswitch);
                        }
                    }
                }
                sanSwitches = sanSwitches.OrderBy(s => s.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest alle Produkte zu den angegebenen Produktklassen
        /// </summary>
        /// <param name="productClassIds"></param>
        private void ReadProducts(IEnumerable<int> productClassIds)
        {
            ProductClass bladeEnclosureProductClass = productClasses.Single(pc => pc.name.Equals(s.BladeEnclosureProductClassName, StringComparison.CurrentCultureIgnoreCase));
            Products = new List<Product>();
            enclosureTypes.Clear();
            foreach (Product p in dataWrapper.GetProductsByProductClasses(productClassIds))
            {
                lock (Products)
                    Products.Add(p);
                if (p.productClassId == bladeEnclosureProductClass.id) // Blade-Enclosure-Typen aus den Vorlagen erstellen
                {
                    EnclosureTypeTemplate encTypeTemplate = GetEnclosureTypeTemplate(p.name);
                    EnclosureType encType = new EnclosureType()
                    {
                        Name = p.name,
                        TemplateName = encTypeTemplate.Name,
                        ApplianceCountVertical = encTypeTemplate.ApplianceCountVertical,
                        ApplianceCountHorizontal = encTypeTemplate.ApplianceCountHorizontal,
                        InterconnectCountVertical = encTypeTemplate.InterconnectCountVertical,
                        InterconnectCountHorizontal = encTypeTemplate.InterconnectCountHorizontal,
                        //InterFrameLinkCountVertical = encTypeTemplate.InterFrameLinkCountVertical,
                        //InterFrameLinkCountHorizontal = encTypeTemplate.InterFrameLinkCountHorizontal,
                        ServerCountVertical = encTypeTemplate.ServerCountVertical,
                        ServerCountHorizontal = encTypeTemplate.ServerCountHorizontal,
                        HeightUnits = p.stackingFactor,
                    };
                    enclosureTypes.Add(encType);
                }
            }
        }

        /// <summary>
        /// Liest Storage-Systeme aus der Datenbank
        /// </summary>
        private void ReadStoragesystems()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(StorageSystem);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                storageSystems = new List<StorageSystem>(50);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.StorageProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    StorageSystem storagesystem = DataCenterFactory.CreateStorageSystem(item, Products.Single(p => p.id == item.productId));
                    storageSystems.Add(storagesystem);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, storagesystem);
                    }
                    if (!string.IsNullOrWhiteSpace(storagesystem.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(storagesystem.Serialnumber, storagesystem);
                        }
                    }
                }
                storageSystems = storageSystems.OrderBy(s => s.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest Backup-Systeme aus der Datenbank
        /// </summary>
        private void ReadBackupsystems()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(BackupSystem);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                backupSystems = new List<BackupSystem>(50);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.BackupProductName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    BackupSystem Backupsystem = DataCenterFactory.CreateBackupSystem(item, Products.Single(p => p.id == item.productId));
                    backupSystems.Add(Backupsystem);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, Backupsystem);
                    }
                    if (!string.IsNullOrWhiteSpace(Backupsystem.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(Backupsystem.Serialnumber, Backupsystem);
                        }
                    }
                }
                backupSystems = backupSystems.OrderBy(s => s.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }


        /// <summary>
        /// Liest die PDUs aus assyst
        /// </summary>
        private void ReadPDUs()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(PDU);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                pdus = new List<PDU>(500);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.PDUItemTypeName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    PDU pdu = DataCenterFactory.CreatePDU(item, Products.Single(p => p.id == item.productId));
                    pdus.Add(pdu);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, pdu);
                    }
                }
                pdus = pdus.OrderBy(p => p.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest Rack-Server-Hardware aus der Datenbank
        /// </summary>
        private void ReadRackservers()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(RackServer);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                rackServers = new List<RackServer>(200);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.RackServerHardwareProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    RackServer rackserver = DataCenterFactory.CreateRackServer(item, Products.Single(p => p.id == item.productId));
                    rackServers.Add(rackserver);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, rackserver);
                    }
                    if (!string.IsNullOrWhiteSpace(rackserver.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(rackserver.Serialnumber, rackserver);
                        }
                    }
                }
                rackServers = rackServers.OrderBy(s => s.Name).ToList();
                IEnumerable<int> rackServerIds = rackServers.Select(r => r.id);
                lock (relationsToProvisionable)
                {
                    relationsToProvisionable.AddRange(dataWrapper.FilterItemRelationsOfType(dataWrapper.GetItemRelationsForItems(rackServerIds).Where(ir => rackServerIds.Contains(ir.relatedItemId)), provisioningRelType.id));
                }
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest Blade-Enclosures aus der Datenbank
        /// </summary>
        private void ReadBladeEnclosures()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(BladeEnclosure);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                bladeEnclosures = new List<BladeEnclosure>(100);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.BladeEnclosureProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    EnclosureType enctype = enclosureTypes.Single(et => et.Name.Equals(Products.Single(p => p.id == item.productId).name));
                    BladeEnclosure bladeEnclosure = DataCenterFactory.CreateBladeEnclosure(item, enctype, Products.Single(p => p.id == item.productId));
                    bladeEnclosures.Add(bladeEnclosure);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, bladeEnclosure);
                    }
                    if (!string.IsNullOrWhiteSpace(bladeEnclosure.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(bladeEnclosure.Serialnumber, bladeEnclosure);
                        }
                    }
                }
                bladeEnclosures = bladeEnclosures.OrderBy(s => s.Name).ToList();
                IEnumerable<int> encIds = bladeEnclosures.Select(en => en.id);
                relationsToBladeEnclosure = new List<ItemRelation>();
                relationsToBladeEnclosure.AddRange(dataWrapper.FilterItemRelationsOfType(dataWrapper.GetItemRelationsForItems(encIds).Where(ir => encIds.Contains(ir.relatedItemId)), mountingRelType.id));
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest Blade-Server-Hardware aus der Datenbank
        /// </summary>
        private void ReadBladeservers()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(BladeServer);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                bladeServers = new List<BladeServer>(500);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.BladeServerHardwareProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    BladeServer bladeserver = DataCenterFactory.CreateBladeServer(item, Products.Single(p => p.id == item.productId));
                    lock (bladeServers)
                        bladeServers.Add(bladeserver);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, bladeserver);
                    }
                    if (!string.IsNullOrWhiteSpace(bladeserver.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(bladeserver.Serialnumber, bladeserver);
                        }
                    }
                }
                bladeServers = bladeServers.OrderBy(s => s.Name).ToList();
                IEnumerable<int> bladeIds = bladeServers.Select(r => r.id);
                lock (relationsToProvisionable)
                {
                    relationsToProvisionable.AddRange(dataWrapper.FilterItemRelationsOfType(dataWrapper.GetItemRelationsForItems(bladeIds).ToList().Where(ir => bladeIds.Contains(ir.relatedItemId)), provisioningRelType.id));
                }
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest Hardware-Appliances aus der Datenbank
        /// </summary>
        private void ReadHardwareAppliances()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(HardwareAppliance);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                hardwareAppliances = new List<HardwareAppliance>(100);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.HardwareApplianceProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    HardwareAppliance appliance = DataCenterFactory.CreateHardwareAppliance(item, Products.Single(p => p.id == item.productId));
                    hardwareAppliances.Add(appliance);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, appliance);
                    }
                    if (!string.IsNullOrWhiteSpace(appliance.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(appliance.Serialnumber, appliance);
                        }
                    }
                }
                hardwareAppliances = hardwareAppliances.OrderBy(s => s.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest Blade-Appliances aus der Datenbank
        /// </summary>
        private void ReadBladeAppliances()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(BladeAppliance);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                bladeAppliances = new List<BladeAppliance>(100);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.BladeApplianceProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    BladeAppliance appliance = DataCenterFactory.CreateBladeAppliance(item, Products.Single(p => p.id == item.productId));
                    bladeAppliances.Add(appliance);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, appliance);
                    }
                    if (!string.IsNullOrWhiteSpace(appliance.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(appliance.Serialnumber, appliance);
                        }
                    }
                }
                bladeAppliances = bladeAppliances.OrderBy(s => s.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest Blade-Interconnects aus der Datenbank
        /// </summary>
        private void ReadBladeInterconnects()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(BladeInterconnect);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                bladeInterconnects = new List<BladeInterconnect>(500);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.BladeInterconnectProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    BladeInterconnect Interconnect = DataCenterFactory.CreateBladeInterconnect(item, Products.Single(p => p.id == item.productId));
                    bladeInterconnects.Add(Interconnect);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, Interconnect);
                    }
                    if (!string.IsNullOrWhiteSpace(Interconnect.Serialnumber))
                    {
                        lock (SerialLookup)
                        {
                            SerialLookup.Add(Interconnect.Serialnumber, Interconnect);
                        }
                    }
                }
                bladeInterconnects = bladeInterconnects.OrderBy(s => s.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest esxhosts aus der Datenbank
        /// </summary>
        private void ReadEsxHosts()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(ProvisionedSystem);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                provisionedSystems = new List<ProvisionedSystem>(500);
                Product p = Products.Single(p1 => p1.name.Equals(s.ESXHostProductName));
                foreach (Item item in dataWrapper.GetItemsByProduct(p.id))
                {
                    ProvisionedSystem esxhost = DataCenterFactory.CreateProvisionedSystem(item, s.ESXHostProductName);
                    lock (provisionedSystems)
                        provisionedSystems.Add(esxhost);
                    lock (assetsForItemId)
                        assetsForItemId.Add(item.id, esxhost);
                }
                lock (provisionedSystems)
                    provisionedSystems = provisionedSystems.OrderBy(s => s.Name).ToList();
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest die Räume aus assyst
        /// </summary>
        private void ReadRooms()
        {
            rooms = new List<Objects.Assets.Room>();
            foreach (assystConnector.Objects.Room tmpRoom in dataWrapper.GetRoomsByIdList(s.DataCenterRoomIds))
            {
                rooms.Add(new Objects.Assets.Room() { id = tmpRoom.id, Name = tmpRoom.roomName, BuildingName = tmpRoom.buildingShortCode });
            }
            rooms = rooms.OrderBy(r => r.Name).ToList();
        }

        /// <summary>
        /// Liest die Racks aus assyst und sortiert sie alphabetisch
        /// </summary>
        private void ReadRacks()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(Rack);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                racks = new List<Rack>(50);
                ProductClass pc = productClasses.Single(x => x.name.Equals(s.RackProductClassName, StringComparison.CurrentCultureIgnoreCase));
                foreach (Item item in dataWrapper.GetItemsByProductClass(pc.id))
                {
                    Rack rack = DataCenterFactory.CreateRack(item, Products.Single(p => p.id == item.productId));
                    racks.Add(rack);
                    lock (assetsForItemId)
                    {
                        assetsForItemId.Add(item.id, rack);
                    }
                }
                racks = racks.OrderBy(r => r.Name).ToList();
                IEnumerable<int> rackIds = racks.Select(r => r.id);
                relationsToRack = new List<ItemRelation>();
                relationsToRack.AddRange(dataWrapper.FilterItemRelationsOfType(dataWrapper.GetItemRelationsForItems(rackIds).Where(ir => rackIds.Contains(ir.relatedItemId)), mountingRelType.id));
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted(t.Name);
            };
            worker.RunWorkerAsync();
        }
    }
}
