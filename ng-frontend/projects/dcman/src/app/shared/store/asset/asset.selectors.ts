import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as fromAsset from './asset.reducer';
import * as fromSelectBasics from '../../store/basics/basics.selectors';

import { Room } from '../../objects/asset/room.model';
import { Rack } from '../../objects/asset/rack.model';
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { ExtendedAppConfigService } from '../../app-config.service';
import { Asset } from '../../objects/prototypes/asset.model';
import { Model } from '../../objects/model.model';

export const selectState = createFeatureSelector<fromAsset.State>(fromApp.ASSET);
export const selectRacks = createSelector(selectState, state => state.racks);
export const selectEnclosures = createSelector(selectState, state => state.enclosures);
export const selectRackServers = createSelector(selectState, state => state.rackServers);
export const selectBackupSystems = createSelector(selectState, state => state.rackMountables.filter(r =>
    r.assetType.name === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem));
export const selectStorageSystems = createSelector(selectState, state => state.rackMountables.filter(r =>
    r.assetType.name === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem));
export const selectNetworkSwitches = createSelector(selectState, state => state.rackMountables.filter(r =>
    r.assetType.name === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch));
export const selectSANSwitches = createSelector(selectState, state => state.rackMountables.filter(r =>
    r.assetType.name === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch));
export const selectHardwareAppliances = createSelector(selectState, state => state.rackMountables.filter(r =>
    r.assetType.name === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance));
export const selectPDUs = createSelector(selectState, state => state.rackMountables.filter(r =>
    r.assetType.name === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.PDU));
const selectGenericRackMountables = createSelector(selectState, state => state.rackMountables);
export const selectBladeServers = createSelector(selectState, state => state.bladeServers);
const selectGenericEnclosureMountables = createSelector(selectState, state => state.enclosureMountables);

export const selectReady = createSelector(selectState, state =>
    state.racksReady && state.enclosuresReady && state.rackServersReady);

export const ready = createSelector(fromSelectBasics.ready, selectReady, (previousReady, thisReady) => previousReady && thisReady);

export const selectRacksInRoom = createSelector(selectRacks, (racks: Rack[], room: Room) =>
    racks.filter(r => r.connectionToRoom && r.connectionToRoom.roomId === room.id)
);
export const selectUnmountedRacks = createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => !r.connectionToRoom)
);
export const selectRacksWithoutModel = createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => !r.model)
);
export const selectRacksForModel = createSelector(selectRacks, (racks: Rack[], model: Model) =>
    racks.filter(r => r.model && r.model.id === model.id)
);

export const selectEnclosuresInRack = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], rack: Rack) =>
    enclosures.filter(e => e.assetConnection && e.assetConnection.containerItemId === rack.id)
);
export const selectUnmountedEnclosures = createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
    enclosures.filter(e => !e.assetConnection)
);
export const selectEnclosuresWithoutModel = createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
    enclosures.filter(e => !e.model)
);
export const selectEnclosuresForModel = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], model: Model) =>
    enclosures.filter(e => e.model && e.model.id === model.id)
);

export const selectServersInRack = createSelector(selectRackServers, (servers: RackMountable[], rack: Rack) =>
    servers.filter(s => s.assetConnection && s.assetConnection.containerItemId === rack.id)
);
export const selectUnmountedRackServers = createSelector(selectRackServers, (servers: RackMountable[]) =>
    servers.filter(s => !s.assetConnection)
);
export const selectRackServersWithoutModel = createSelector(selectRackServers, (servers: RackMountable[]) =>
    servers.filter(s => !s.model)
);

export const selectRack = createSelector(selectRacks, (racks: Rack[], id: string) => racks.find(r => r.id === id));
export const selectEnclosure = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], id: string) =>
    enclosures.find(e => e.id === id)
);
export const selectRackServer = createSelector(selectRackServers, (servers: RackMountable[], id: string) => servers.find(s => s.id === id));

export const selectRackMountables = createSelector(selectEnclosures, selectRackServers, selectGenericRackMountables,
    (s1, s2, s3) => [...s1, ...s2, ...s3]
);

export const selectRackMountablesForRack = createSelector(selectRackMountables, (items: RackMountable[], rack: Rack) =>
    items.filter(i => i.assetConnection?.containerItemId === rack.id || rack.item.connectionsToUpper?.map(c => c.targetId).includes(i.id))
);

export const selectEnclosureMountables = createSelector(selectBladeServers, selectGenericEnclosureMountables,
    (s1, s2) => [...s1, ...s2]
);

export const selectAllAssets = createSelector(selectRacks, selectRackMountables, selectEnclosureMountables,
    (s1, s2, s3) => [...s1 as Asset[], ...s2 as Asset[], ...s3 as Asset[]]
);

export const selectAssetsForItemType = createSelector(selectAllAssets, (assets: Asset[], itemTypeId: string) =>
    assets.filter(a => !!a.item && a.item.typeId === itemTypeId)
);

export const selectAssetsForModel = createSelector(selectAllAssets, (assets: Asset[], model: Model) =>
    assets.filter(a => !!a.model && a.model.id === model.id)
);

export const selectAsset = createSelector(selectAllAssets, (assets: Asset[], id: string) => assets.find(a => a.id === id));

export const selectAssetsWithoutModel = createSelector(selectAllAssets, (assets) => assets.filter(a => !a.model));

export const selectAssetsWithoutModelForItemType = createSelector(selectAssetsForItemType, (assets: Asset[], itemTypeId: string) =>
    assets.filter(a => !a.model)
);

export const selectAssetNamesForType = createSelector(selectAssetsForItemType, (assets: Asset[], itemTypeId: string) =>
    assets.map(a => a.name.toLocaleLowerCase())
);
