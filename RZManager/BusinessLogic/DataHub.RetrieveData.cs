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

            //genericRackMountables = new List<GenericRackMountable>(500);

            ActiveWorkers = new List<Type>();

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lese Räume.");
            ReadRooms();

            if (InitializationCompleted != null)
                InitializationCompleted(this, new EventArgs());

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lese Racks.");
            ReadRacks();

            if (NextPhaseStarted != null)
                NextPhaseStarted(ctr++, "Lese ins Rack einbaubare Geräte.");
            ReadBladeEnclosures();

            ReadPDUs();

            ReadSanSwitches();

            ReadStoragesystems();

            ReadBackupsystems();

            ReadRackservers();

            ReadHardwareAppliances();

            ReadEsxHosts();

            bool connectionsForBladesStarted = false;

            while (!connectionsForBladesStarted || ActiveWorkers.Count() > 0)
            {
                if (!connectionsForBladesStarted && !ActiveWorkersContains(typeof(BladeEnclosure)) && !ActiveWorkersContains(typeof(EnclosureMountable)))
                {
                    if (NextPhaseStarted != null)
                        NextPhaseStarted(ctr++, "Erstelle Verknüpfungen zu den Blade Enclosures.");
                    connectionsForBladesStarted = true;
                    ReadBladeservers();

                    ReadBladeInterconnects();

                    ReadBladeAppliances();

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
        /// Löscht einen aktiven BackgroundWorker und feuert das Ereignis, dass der Schritt abgeschlossen ist.
        /// </summary>
        /// <param name="t"></param>
        private void TaskForTypeAccomplished(Type t)
        {
            lock (ActiveWorkers)
                ActiveWorkers.Remove(t);
            if (FillStepCompleted != null)
                FillStepCompleted(t.Name);
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
            Type t = typeof(AssetConnection);
            lock (ActiveWorkers)
                ActiveWorkers.Add(t);
            worker.DoWork += delegate (object obj, System.ComponentModel.DoWorkEventArgs args)
            {
                if (FillStepStarted != null)
                    FillStepStarted(t.Name);
                // Zuerst fehlende Items ermitteln und nachladen
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
                    */
                }
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
        /// Verbindet ein in ein Rack einbaubare Item mit dem zugehörigen Rack
        /// </summary>
        /// <param name="rackMountable">Das ins Rack eingebaute Item</param>
        /// <param name="connection">Die Verbindungsinformation</param>
        private void SetAssetToRack(RackMountable rackMountable, CmdbClient.CmsService.Connection connection)
        {
            if (connection != null)
            {
                if (assetsForItemId[connection.ConnLowerItem] is Rack r)
                {
                    rackMountable.ConnectionToRack = new AssetConnection()
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
        /// Verbindet ein in ein Blade-Enclosure einbaubares Item mit dem zugehörigen Blade-Enclosure
        /// </summary>
        /// <param name="encMountable">Das ins Enclosure eingebaute Item</param>
        /// <param name="connection">Die Verbindungsinformation</param>
        private void SetAssetToBladeEnclosure(EnclosureMountable encMountable, CmdbClient.CmsService.Connection connection)
        {
            if (connection != null)
            {
                if (assetsForItemId[connection.ConnLowerItem] is BladeEnclosure enc)
                {
                    encMountable.ConnectionToEnclosure = new AssetConnection()
                    {
                        id = connection.ConnId,
                        FirstItem = encMountable,
                        SecondItem = enc,
                        ConnectionType = connection.ConnType,
                        Content = connection.Description,
                    };
                }
            }
        }

        private void BuildConnectionToProvisionedSystems(IProvisioningSystem serverHardware, IEnumerable<CmdbClient.CmsService.Connection> connectionsToServer)
        {
            if (connectionsToServer.Count() > 1)
            {
                System.Windows.MessageBox.Show(string.Format("Fehler bei {0}: {1}. Es existieren {2} Verbindungen zu bereitgestellten Systemen, obwohl nur eine erlaubt ist.",
                    (serverHardware as Asset).TypeName, (serverHardware as Asset).Name, connectionsToServer.Count()));
            }
            if (connectionsToServer.Count() > 0)
            {
                CmdbClient.CmsService.Connection conn = connectionsToServer.First();
                CmdbClient.CmsService.ConfigurationItem serverItem = dataWrapper.GetConfigurationItem(conn.ConnUpperItem);
                ProvisionedSystem server = DataCenterFactory.CreateProvisionedSystem(serverItem, null);
                serverHardware.ConnectionToServer = new AssetConnection()
                {
                    ConnectionType = conn.ConnType,
                    Content = conn.Description,
                    FirstItem = server,
                    id = conn.ConnId,
                    SecondItem = serverHardware as Asset,
                };
                lock (provisionedSystems)
                    provisionedSystems.Add(server);
                lock (assetsForItemId)
                    assetsForItemId.Add(server.id, server);
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
                    SetAssetToRack(sanswitch, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.SANSwitchToRack.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
            };
            worker.RunWorkerAsync();
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.StorageSystem]))
                {
                    StorageSystem storageSystem = DataCenterFactory.CreateStorageSystem(item.ConfigurationItem, item.Attributes);
                    storageSystems.Add(storageSystem);
                    FillLookupTables(storageSystem);
                    SetAssetToRack(storageSystem, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.StorageSystemToRack.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.BackupSystem]))
                {
                    BackupSystem backupSystem = DataCenterFactory.CreateBackupSystem(item.ConfigurationItem, item.Attributes);
                    backupSystems.Add(backupSystem);
                    FillLookupTables(backupSystem);
                    SetAssetToRack(backupSystem, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.BackupSystemToRack.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.PDU]))
                {
                    PDU pdu = DataCenterFactory.CreatePDU(item.ConfigurationItem, item.Attributes);
                    pdus.Add(pdu);
                    FillLookupTables(pdu);
                    SetAssetToRack(pdu, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.PDUToRack.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.RackServerHardware]))
                {
                    RackServer rackServer = DataCenterFactory.CreateRackServer(item.ConfigurationItem, item.Attributes);
                    rackServers.Add(rackServer);
                    FillLookupTables(rackServer);
                    SetAssetToRack(rackServer, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.RackServerHardwareToRack.ConnectionRule.RuleId)));
                    IEnumerable<CmdbClient.CmsService.Connection> connectionsToServer = item.ConnectionsToUpper.Where(c =>
                        c.RuleId.Equals(ConnectionRuleSettings.Rules.ProvisioningRules.BareMetalHypervisorToRackserverHardware.ConnectionRule.RuleId) ||
                        c.RuleId.Equals(ConnectionRuleSettings.Rules.ProvisioningRules.ServerToRackserverHardware.ConnectionRule.RuleId) ||
                        c.RuleId.Equals(ConnectionRuleSettings.Rules.ProvisioningRules.SoftApplianceToRackserverHardware.ConnectionRule.RuleId));
                    BuildConnectionToProvisionedSystems(rackServer, connectionsToServer);

                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.BladeEnclosure]))
                {
                    string model = DataCenterFactory.GetAttributeValue(item.Attributes, Settings.Config.AttributeTypeNames.Model);
                    EnclosureType enctype = MetaData.EnclosureTypes.Single(et => !string.IsNullOrWhiteSpace(model) && 
                        et.Name.Equals(model, StringComparison.CurrentCultureIgnoreCase));
                    BladeEnclosure bladeEnclosure = DataCenterFactory.CreateBladeEnclosure(item.ConfigurationItem, enctype, item.Attributes);
                    bladeEnclosures.Add(bladeEnclosure);
                    FillLookupTables(bladeEnclosure);
                    SetAssetToRack(bladeEnclosure, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.BladeEnclosureToRack.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
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
                bladeServers = new List<BladeServer>();
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.BladeServerHardware]))
                {
                    BladeServer bladeServer = DataCenterFactory.CreateBladeServer(item.ConfigurationItem, item.Attributes);
                    bladeServers.Add(bladeServer);
                    FillLookupTables(bladeServer);
                    SetAssetToBladeEnclosure(bladeServer, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.EnclosureMountRules.BladeServerHardwareToBladeEnclosure.ConnectionRule.RuleId)));
                    IEnumerable<CmdbClient.CmsService.Connection> connectionsToServer = item.ConnectionsToUpper.Where(c =>
                        c.RuleId.Equals(ConnectionRuleSettings.Rules.ProvisioningRules.BareMetalHypervisorToBladeserverHardware.ConnectionRule.RuleId) ||
                        c.RuleId.Equals(ConnectionRuleSettings.Rules.ProvisioningRules.ServerToBladeserverHardware.ConnectionRule.RuleId) ||
                        c.RuleId.Equals(ConnectionRuleSettings.Rules.ProvisioningRules.SoftApplianceToBladeserverHardware.ConnectionRule.RuleId));
                    BuildConnectionToProvisionedSystems(bladeServer, connectionsToServer);
                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.HardwareAppliance]))
                {
                    HardwareAppliance hardwareAppliance = DataCenterFactory.CreateHardwareAppliance(item.ConfigurationItem, item.Attributes);
                    hardwareAppliances.Add(hardwareAppliance);
                    FillLookupTables(hardwareAppliance);
                    SetAssetToRack(hardwareAppliance, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RackMountRules.HardwareApplianceToRack.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.BladeAppliance]))
                {
                    BladeAppliance bladeAppliance = DataCenterFactory.CreateBladeAppliance(item.ConfigurationItem, item.Attributes);
                    bladeAppliances.Add(bladeAppliance);
                    FillLookupTables(bladeAppliance);
                    SetAssetToBladeEnclosure(bladeAppliance, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.EnclosureMountRules.BladeApplianceToBladeEnclosure.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.BladeInterconnect]))
                {
                    BladeInterconnect bladeInterconnect = DataCenterFactory.CreateBladeInterconnect(item.ConfigurationItem, item.Attributes);
                    bladeInterconnects.Add(bladeInterconnect);
                    FillLookupTables(bladeInterconnect);
                    SetAssetToBladeEnclosure(bladeInterconnect, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.EnclosureMountRules.BladeInterconnectToBladeEnclosure.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
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
                foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.BareMetalHypervisor]))
                {
                    ProvisionedSystem ESXHost = DataCenterFactory.CreateProvisionedSystem(item.ConfigurationItem, item.Attributes);
                    provisionedSystems.Add(ESXHost);
                    //FillLookupTables(ESXHost);
                    //MountAssetToBladeEnclosure(ESXHost, item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.EnclosureMountRules.ESXHostToBladeEnclosure.ConnectionRule.RuleId)));
                }
                TaskForTypeAccomplished(t);
            };
            worker.RunWorkerAsync();
        }

        /// <summary>
        /// Liest die Räume aus assyst
        /// </summary>
        private void ReadRooms()
        {
            rooms = new List<Room>();
            foreach (CompleteItem tmpItem in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.Room]))
            {
                rooms.Add(DataCenterFactory.CreateRoom(tmpItem.ConfigurationItem, tmpItem.Attributes));
            }
            //rooms = rooms.OrderBy(r => r.BuildingName).ThenBy(r => r.Name).ToList();
        }

        /// <summary>
        /// Liest die Racks aus assyst und sortiert sie alphabetisch
        /// </summary>
        private void ReadRacks()
        {
            System.ComponentModel.BackgroundWorker worker = new System.ComponentModel.BackgroundWorker();
            Type t = typeof(Rack);
            if (FillStepStarted != null)
                FillStepStarted(t.Name);
            racks = new List<Rack>(50);
            foreach (CompleteItem item in dataWrapper.GetCompleteItemsOfType(MetaData.ItemTypes[Settings.Config.ConfigurationItemTypeNames.Rack]))
            {
                Rack rack = DataCenterFactory.CreateRack(item.ConfigurationItem, item.Attributes);
                racks.Add(rack);
                FillLookupTables(rack);
                CmdbClient.CmsService.Connection connection = item.ConnectionsToLower.SingleOrDefault(c => c.RuleId.Equals(ConnectionRuleSettings.Rules.RoomInstallRules.RackToRoom.ConnectionRule.RuleId));
                if (connection != null)
                {
                    if (rooms.SingleOrDefault(room => room.id.Equals(connection.ConnLowerItem)) is Room r)
                    {
                        rack.ConnectionToRoom = new RoomConnection()
                        {
                            id = connection.ConnId,
                            Rack = rack,
                            Room = r,
                            ConnectionType = connection.ConnType,
                        };
                    }
                }

            }
            TaskForTypeAccomplished(t);
        }
    }
}
