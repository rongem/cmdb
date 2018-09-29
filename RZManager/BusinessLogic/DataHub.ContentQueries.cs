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
        /// Anzahl der Enclosures, die auf Lager liegen
        /// </summary>
        public int UnmountedEnclosuresCount { get; private set; }

        /// <summary>
        /// Anzahl der Rack-Server, die auf Lager liegen
        /// </summary>
        public int UnmountedRackServersCount { get; private set; }

        /// <summary>
        /// Anzahl der Blade-Server, die auf Lager liegen
        /// </summary>
        public int UnmountedMountedBladeServersCount { get; private set; }

        /// <summary>
        /// Anzahl der Storage-Systeme, die auf Lager liegen
        /// </summary>
        public int UnmountedStorageSystemsCount { get; private set; }

        /// <summary>
        /// Anzahl der Backup-Systeme, die auf Lager liegen
        /// </summary>
        public int UnmountedBackupSystemsCount { get; private set; }

        /// <summary>
        /// Anzahl der SAN-Switche, die auf Lager liegen
        /// </summary>
        public int UnmountedSanSwitchesCount { get; private set; }

        /// <summary>
        /// Anzahl der PDUs, die auf Lager liegen
        /// </summary>
        public int UnmountedPDUsCount { get; private set; }

        /// <summary>
        /// Anzahl der Blade-Server, die auf Lager liegen
        /// </summary>
        public int UnmountedBladeServersCount { get; private set; }

        /// <summary>
        /// Anzahl der Blade-Appliances, die auf Lager liegen
        /// </summary>
        public int UnmountedBladeAppliancesCount { get; private set; }

        /// <summary>
        /// Anzahl der Blade-Interconnects, die auf Lager liegen
        /// </summary>
        public int UnmountedBladeInterconnectsCount { get; private set; }

        /// <summary>
        /// Setzt die Count-Werte aller Listen in einen Zwischenspeicher, um den Abruf zu beschleunigen
        /// </summary>
        private void CalculateNumbers()
        {
            UnmountedEnclosuresCount = GetUnmountedEnclosures().Count();
            UnmountedRackServersCount = GetUnmountedRackServers().Count();
            UnmountedBladeServersCount = GetUnmountedBladeServers().Count();
            UnmountedMountedBladeServersCount = GetUnmountedBladeServers().Count();
            UnmountedStorageSystemsCount = GetUnmountedStorageSystems().Count();
            UnmountedBackupSystemsCount = GetUnmountedBackupSystems().Count();
            UnmountedSanSwitchesCount = GetUnmountedSanSwitches().Count();
            UnmountedPDUsCount = GetUnmountedPDUs().Count();
            UnmountedBladeAppliancesCount = GetUnmountedBladeAppliances().Count();
            UnmountedBladeInterconnectsCount = GetUnmountedBladeInterconnects().Count();
        }

        /// <summary>
        /// Liefert ein Rack zurück
        /// </summary>
        /// <param name="rackId">Id des Racks</param>
        /// <returns></returns>
        public Rack GetRack(int rackId)
        {
            return racks.SingleOrDefault(r => r.id.Equals(rackId));
        }

        /// <summary>
        /// Liefert ein Enclosure zurück
        /// </summary>
        /// <param name="enclosureId">Id des Enclosures</param>
        /// <returns></returns>
        public BladeEnclosure GetEnclosure(int enclosureId)
        {
            return bladeEnclosures.SingleOrDefault(enc => enc.id.Equals(enclosureId));
        }

        /// <summary>
        /// Erzeugt alle Racks, die zu einem Raum gehören
        /// </summary>
        /// <param name="roomId">Id des Raums</param>
        /// <returns></returns>
        public IEnumerable<Rack> GetRacksInRoom(Guid roomId)
        {
            return racks.Where(r => r.ConnectionToRoom != null && r.ConnectionToRoom.Room.id.Equals(roomId));
        }

        /// <summary>
        /// Holt alle Enclosures, die zu einem Rack gehören
        /// </summary>
        /// <param name="rack">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BladeEnclosure> GetEnclosuresInRack(Guid rackId)
        {
            return bladeEnclosures.Where(e => e.ConnectionToRack != null && e.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Holt alle Enclosures, die in ein Rack eingebaut sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<BladeEnclosure> GetMountedEnclosures()
        {
            return bladeEnclosures.Where(e => e.ConnectionToRack != null);
        }

        /// <summary>
        /// Gibt alle BladeCenter zurück, die in kein Rack eingebaut sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<BladeEnclosure> GetUnmountedEnclosures()
        {
            return bladeEnclosures.Where(e => e.ConnectionToRack == null && (e.Status == AssetStatus.Stored || e.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Holt alle RackServer, die zu einem Rack gehören
        /// </summary>
        /// <param name="rackId">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<RackServer> GetRackServersInRack(int rackId)
        {
            return rackServers.Where(s => s.ConnectionToRack != null && s.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Gibt alle RackServer zurück, die nicht in ein Rack eingebaut sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<RackServer> GetUnmountedRackServers()
        {
            return rackServers.Where(s => s.ConnectionToRack == null && (s.Status == AssetStatus.Stored || s.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Holt alle Storage-Systeme, die zu einem Rack gehören
        /// </summary>
        /// <param name="rackId">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<StorageSystem> GetStorageSystemsInRack(int rackId)
        {
            return storageSystems.Where(s => s.ConnectionToRack != null && s.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Holt alle Storage-Systeme, die keinem Rack zugeordnet sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<StorageSystem> GetUnmountedStorageSystems()
        {
            return storageSystems.Where(s => s.ConnectionToRack == null && (s.Status == AssetStatus.Stored || s.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Holt alle Backup-Systeme, die zu einem Rack gehören
        /// </summary>
        /// <param name="rackId">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BackupSystem> GetBackupSystemsInRack(int rackId)
        {
            return backupSystems.Where(s => s.ConnectionToRack != null && s.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Holt alle Backup-Systeme, die keinem Rack zugeordnet sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<BackupSystem> GetUnmountedBackupSystems()
        {
            return backupSystems.Where(s => s.ConnectionToRack == null && (s.Status == AssetStatus.Stored || s.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Holt alle SAN-Switche, die zu einem Rack gehören
        /// </summary>
        /// <param name="rackId">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<SanSwitch> GetSanSwitchesInRack(int rackId)
        {
            return sanSwitches.Where(s => s.ConnectionToRack != null && s.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Holt alle SAN-Switche, die keinem Rack zugeordnet sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<SanSwitch> GetUnmountedSanSwitches()
        {
            return sanSwitches.Where(s => s.ConnectionToRack == null && (s.Status == AssetStatus.Stored || s.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Holt alle Power Distribution Units, die zu einem Rack gehören
        /// </summary>
        /// <param name="rackId">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<PDU> GetPDUsInRack(int rackId)
        {
            return pdus.Where(s => s.ConnectionToRack != null && s.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Holt alle Power Distribution Units, die keinem Rack zugeordnet sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<PDU> GetUnmountedPDUs()
        {
            return pdus.Where(s => s.ConnectionToRack == null && (s.Status == AssetStatus.Stored || s.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Holt alle HardwareAppliances, die zu einem Rack gehören
        /// </summary>
        /// <param name="rackId">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<HardwareAppliance> GetHardwareAppliancesInRack(int rackId)
        {
            return hardwareAppliances.Where(s => s.ConnectionToRack != null && s.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Liefert alle sonstigen, mit dem Rack verbundenen Systeme zurück
        /// </summary>
        /// <param name="rackId">Rack, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<GenericRackMountable> GetGenericRackMountablesInRack(int rackId)
        {
            return genericRackMountables.Where(rm => rm.ConnectionToRack != null && rm.ConnectionToRack.SecondItem.id.Equals(rackId));
        }

        /// <summary>
        /// Holt alle Bladeserver, die sich in einem Enclosure befinden
        /// </summary>
        /// <param name="enclosureId">BladeCenter, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BladeServer> GetBladeServersInEnclosure(int enclosureId)
        {
            return bladeServers.Where(s => s.ConnectionToEnclosure != null && s.ConnectionToEnclosure.SecondItem.id.Equals(enclosureId));
        }

        /// <summary>
        /// Gibt alle Bladeserver zurück, die keinem BladeCenter zugeordnet sind
        /// </summary>
        /// <returns></returns>
        public IEnumerable<BladeServer> GetUnmountedBladeServers()
        {
            return bladeServers.Where(s => s.ConnectionToEnclosure == null && (s.Status == AssetStatus.Stored || s.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Gibt alle Blade-Appliances zurück, die sich im angegebenen Enclosure befinden
        /// </summary>
        /// <param name="encId">BladeCenter, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BladeAppliance> GetBladeAppliancesInEnclosure(int encId)
        {
            return bladeAppliances.Where(a => a.ConnectionToEnclosure != null && a.ConnectionToEnclosure.SecondItem.id.Equals(encId));
        }

        /// <summary>
        /// Gibt alle Blade-Appliances zurück, die sich nicht in einem Enclosure befinden
        /// </summary>
        /// <returns></returns>
        public IEnumerable<BladeAppliance> GetUnmountedBladeAppliances()
        {
            return bladeAppliances.Where(a => a.ConnectionToEnclosure == null && (a.Status == AssetStatus.Stored || a.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Gibt alle Blade-Interconnects zurück, die sich im angegebenen Enclosure befinden
        /// </summary>
        /// <param name="encId">BladeCenter, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BladeInterconnect> GetBladeInterconnectsInEnclosure(int encId)
        {
            return bladeInterconnects.Where(a => a.ConnectionToEnclosure != null && a.ConnectionToEnclosure.SecondItem.id.Equals(encId));
        }

        /// <summary>
        /// Gibt alle Blade-Interconnects zurück, die sich nicht in einem Enclosure befinden
        /// </summary>
        /// <returns></returns>
        public IEnumerable<BladeInterconnect> GetUnmountedBladeInterconnects()
        {
            return bladeInterconnects.Where(a => a.ConnectionToEnclosure == null && (a.Status == AssetStatus.Stored || a.Status == AssetStatus.Unknown));
        }

        /// <summary>
        /// Gibt alle nicht mit einer Hardware verbundenen ESX-Hosts zurück
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ProvisionedSystem> GetUnmountedEsxHosts()
        {
            return provisionedSystems.Where(p => p.TypeName.Equals(Settings.Config.ConfigurationItemTypeNames.BareMetalHypervisor, StringComparison.CurrentCultureIgnoreCase) && p.Status == AssetStatus.Free);
        }

        /*
        /// <summary>
        /// Gibt alle Blade-FrameInterlinks zurück, die sich im angegebenen Enclosure befinden
        /// </summary>
        /// <param name="encId">BladeCenter, für das gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BladeFrameInterlink> GetBladeFrameInterlinksInEnclosure(int encId)
        {
            return bladeFrameInterlinks.Where(a => a.ConnectionToEnclosure != null && a.ConnectionToEnclosure.SecondItem.id.Equals(encId));
        }

        /// <summary>
        /// Gibt alle Blade-FrameInterlinks zurück, die sich nicht in einem Enclosure befinden
        /// </summary>
        /// <returns></returns>
        public IEnumerable<BladeFrameInterlink> GetUnmountedBladeFrameInterlinks()
        {
            return bladeFrameInterlinks.Where(a => a.ConnectionToEnclosure == null && (a.Status == AssetStatus.Stored || a.Status == AssetStatus.Unknown));
        }*/


        /// <summary>
        /// Gibt alle in einer Server-Hardware laufenden Server zurück
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ProvisionedSystem> GetProvisionedSystems()
        {
            return provisionedSystems;
        }

        /// <summary>
        /// Gibt alle in einer Server-Hardware laufenden Server zurück
        /// </summary>
        /// <param name="namepart">Namensbestandteil</param>
        /// <returns></returns>
        public IEnumerable<ProvisionedSystem> GetProvisionedSystems(string namepart)
        {
            return GetProvisionedSystems().Where(s => s.Name.IndexOf(namepart, StringComparison.CurrentCultureIgnoreCase) > -1);
        }

        /// <summary>
        /// Gibt alle in einer Server-Hardware laufenden Server zurück
        /// </summary>
        /// <param name="namepart">Namensbestandteil</param>
        /// <param name="typename">Typ des provisionierten Systems</param>
        /// <returns></returns>
        public IEnumerable<ProvisionedSystem> GetProvisionedSystems(string namepart, string typename)
        {
            if (typename == string.Empty)
                return GetProvisionedSystems(namepart);
            return GetProvisionedSystems(namepart).Where(s => s.TypeName.Equals(typename, StringComparison.CurrentCultureIgnoreCase));
        }

        /// <summary>
        /// Liefert zu einem angegebenen Server das Rack zurück
        /// </summary>
        /// <param name="provisionedSystem">Server, nach dem gesucht wird</param>
        /// <returns></returns>
        public Rack GetRackForProvisionedSystem(ProvisionedSystem provisionedSystem)
        {
            RackServer rs = rackServers.SingleOrDefault(s => s.ConnectionToServer != null && s.ConnectionToServer.FirstItem.id.Equals(provisionedSystem.id));
            if (rs == null) // Blade-Server
            {
                BladeServer bs = bladeServers.SingleOrDefault(s => s.ConnectionToServer != null && s.ConnectionToServer.FirstItem.id.Equals(provisionedSystem.id));
                if (bs != null && bs.ConnectionToEnclosure != null)
                {
                    BladeEnclosure enc = bladeEnclosures.SingleOrDefault(e => e.id.Equals(bs.ConnectionToEnclosure.SecondItem.id));
                    if (enc != null && enc.ConnectionToRack != null)
                        return racks.SingleOrDefault(r => r.id.Equals(enc.ConnectionToRack.SecondItem.id));
                }
            }
            else
            {
                if (rs.ConnectionToRack != null)
                    return racks.SingleOrDefault(r => r.id.Equals(rs.ConnectionToRack.SecondItem.id));
            }
            return null;
        }

        /// <summary>
        /// Gibt das Rack zu einem Asset zurück
        /// </summary>
        /// <param name="selectedItem"></param>
        /// <returns></returns>
        public Rack GetRackForAsset(Asset selectedItem)
        {
            if (selectedItem is RackMountable)
            {
                RackMountable rm = selectedItem as RackMountable;
                if (rm.ConnectionToRack != null)
                    return rm.ConnectionToRack.SecondItem as Rack;
            }
            if (selectedItem is BladeServer)
            {
                BladeServer bs = selectedItem as BladeServer;
                if (bs.ConnectionToEnclosure != null)
                {
                    BladeEnclosure enc = bs.ConnectionToEnclosure.SecondItem as BladeEnclosure;
                    if (enc.ConnectionToRack != null)
                        return enc.ConnectionToRack.SecondItem as Rack;
                }
            }
            return null;
        }

        /// <summary>
        /// Liefert zu einem angegebenen Server das Rack zurück
        /// </summary>
        /// <param name="server">Server, nach dem gesucht wird</param>
        /// <returns></returns>
        public Asset GetHardware(ProvisionedSystem server)
        {
            RackServer rs = rackServers.SingleOrDefault(s => s.ConnectionToServer != null && s.ConnectionToServer.FirstItem.id.Equals(server.id));
            if (rs == null) // Blade-Server
            {
                return bladeServers.SingleOrDefault(s => s.ConnectionToServer != null && s.ConnectionToServer.FirstItem.id.Equals(server.id));
            }
            else
            {
                return rs;
            }
        }

        /// <summary>
        /// Gibt alle Assets zurück, deren Seriennummer den angegebenen String enthält
        /// </summary>
        /// <param name="serial">Teil der Seriennummer, nach der gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<Asset> GetAssetForSerialPart(string serial)
        {
            foreach (string key in SerialLookup.Keys.Where(k => k.StartsWith(serial, StringComparison.CurrentCultureIgnoreCase) || k.EndsWith(serial, StringComparison.CurrentCultureIgnoreCase)))
            {
                if (SerialLookup[key] is RackMountable && (SerialLookup[key] as RackMountable).ConnectionToRack == null)
                    continue;
                if (SerialLookup[key] is EnclosureMountable && (SerialLookup[key] as EnclosureMountable).ConnectionToEnclosure == null)
                    continue;
                yield return SerialLookup[key];
            }
        }


    }
}
