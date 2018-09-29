using CmdbClient;
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

            assetsForItemId = new Dictionary<Guid, Asset>(500);

            SerialLookup = new Dictionary<string, Asset>(500);

            genericRackMountables = new List<GenericRackMountable>(500);

            ActiveWorkers = new List<Type>();

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lese Räume.");
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
                // Zuerst fehlende Items ermitteln und aus der CMDB nachladen
                // Blade Server mit Servern verbinden
                 // Rack Server mit Servern verbinden
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
                // Racks mit ins Rack einbaubaren Elementen verbinden
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
/*                    foreach (ItemRelation ir in relationsToBladeEnclosure.Where(r => r.relatedItemId == enc.id))
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
*/                }
                lock (ActiveWorkers)
                    ActiveWorkers.Remove(t);
                if (FillStepCompleted != null)
                    FillStepCompleted("ConnectionsToEnclosures");
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Fügt den internen Nachschlagetabellen ein Asset hinzu
        /// </summary>
        /// <param name="asset">Asset, das hinzugefügt werden soll</param>
        private void FillLookupTables(Asset asset)
        {
            lock (assetsForItemId)
            {
                assetsForItemId.Add(asset.id, asset);
            }
            if (!string.IsNullOrWhiteSpace(asset.Serialnumber))
            {
                lock (SerialLookup)
                {
                    SerialLookup.Add(asset.Serialnumber, asset);
                }
            }
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.SanSwitch]))
                {
                    SanSwitch sanswitch = DataCenterFactory.CreateSanSwitch(item.ConfigurationItem, item.Attributes);
                    sanSwitches.Add(sanswitch);
                    FillLookupTables(sanswitch);
                    MountAssetToRack(sanswitch, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.SANSwitchToRack.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
            };
            worker.RunWorkerAsync();
        }

        private void TaskForTypeAccomplished(Type t)
        {
            lock (ActiveWorkers)
                ActiveWorkers.Remove(t);
            if (FillStepCompleted != null)
                FillStepCompleted(t.Name);
        }

        /// <summary>
        /// Verbindet ein in ein Rack einbaubare Item mit dem zugehörigen Rack
        /// </summary>
        /// <param name="rackMountable">Das ins Rack eingebaute Item</param>
        /// <param name="connection">Die Verbindungsinformation</param>
        private void MountAssetToRack(RackMountable rackMountable, CmdbClient.CmsService.Connection connection)
        {
            if (connection != null)
            {
                if (assetsForItemId[connection.ConnLowerItem] is Rack r)
                {
                    rackMountable.ConnectionToRack = new Connection()
                    {
                        id = connection.ConnId,
                        FirstItem = rackMountable,
                        SecondItem = r,
                        ConnectionType = connection.ConnType,
                        Content = connection.Description,
                    };
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
