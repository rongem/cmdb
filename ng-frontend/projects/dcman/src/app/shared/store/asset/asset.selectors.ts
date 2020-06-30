import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors, ItemType } from 'backend-access';

import * as fromApp from '../../store/app.reducer';
import * as fromAsset from './asset.reducer';
import * as fromSelectBasics from '../../store/basics/basics.selectors';

import { Room } from '../../objects/asset/room.model';
import { Rack } from '../../objects/asset/rack.model';
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { ExtendedAppConfigService as AppConfig } from '../../app-config.service';
import { Asset } from '../../objects/prototypes/asset.model';
import { Model } from '../../objects/model.model';
import { EnclosureMountable } from '../../objects/asset/enclosure-mountable.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';
import { Mappings } from '../../objects/appsettings/mappings.model';
import { AssetStatus } from '../../objects/asset/asset-status.enum';

export const selectState = createFeatureSelector<fromAsset.State>(fromApp.ASSET);
export const selectRacks = createSelector(selectState, state => state.racks);
export const selectEnclosures = createSelector(selectState, state => state.enclosures);
export const selectRackServers = createSelector(selectState, state => state.rackMountables.filter(r =>
    r.type === AppConfig.objectModel.ConfigurationItemTypeNames.RackServerHardware.toLocaleLowerCase()));
const selectGenericRackMountables = createSelector(selectState, state => state.rackMountables);
export const selectBladeServers = createSelector(selectState, state => state.enclosureMountables.filter(r =>
    r.type === AppConfig.objectModel.ConfigurationItemTypeNames.BladeServerHardware.toLocaleLowerCase()) as BladeServerHardware[]
);
export const selectEnclosureMountables = createSelector(selectState, state => state.enclosureMountables);

export const selectEnclosureMountableItemTypes = createSelector(MetaDataSelectors.selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.enclosureMountables.includes(t.name.toLocaleLowerCase()))
);

export const selectEnclosureMountableFrontSideItemTypes = createSelector(selectEnclosureMountableItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => !Mappings.enclosureBackSideMountables.includes(t.name.toLocaleLowerCase()))
);

export const selectEnclosureMountableBackSideItemTypes = createSelector(selectEnclosureMountableItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.enclosureBackSideMountables.includes(t.name.toLocaleLowerCase()))
);

export const selectRackMountableItemTypes = createSelector(MetaDataSelectors.selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.rackMountables.includes(t.name.toLocaleLowerCase()))
);

const selectRackMountablesReady = createSelector(selectState, state =>
    !Object.keys(state.rackMountablesReady).some(key => state.rackMountablesReady[key] === false));

const selectEnclosureMountablesReady = createSelector(selectState, state =>
    !Object.keys(state.enclosureMountablesReady).some(key => state.enclosureMountablesReady[key] === false));

const selectReady = createSelector(selectState, selectRackMountablesReady, selectEnclosureMountablesReady,
    (state, rackMountablesReady, enclosureMountablesReady) =>
        state.racksReady && state.enclosuresReady && rackMountablesReady && enclosureMountablesReady
);

export const ready = createSelector(fromSelectBasics.ready, selectReady, (previousReady, thisReady) => previousReady && thisReady);

export const selectRacksInRoom = createSelector(selectRacks, (racks: Rack[], room: Room) =>
    racks.filter(r => r.connectionToRoom && r.connectionToRoom.roomId === room.id)
);

// const selectUnmountedRacks = createSelector(selectRacks, (racks: Rack[]) =>
//     racks.filter(r => !r.connectionToRoom)
// );

export const selectRacksWithoutModel = createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => !r.model)
);

export const selectRacksForModel = createSelector(selectRacks, (racks: Rack[], model: Model) =>
    racks.filter(r => r.model && r.model.id === model.id)
);

export const selectEnclosuresInRack = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], rack: Rack) =>
    enclosures.filter(e => e.assetConnection && e.assetConnection.containerItemId === rack.id)
);

// const selectUnmountedEnclosures = createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
//     enclosures.filter(e => !e.assetConnection)
// );
// export const selectEnclosuresWithoutModel = createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
//     enclosures.filter(e => !e.model)
// );
// const selectEnclosuresForModel = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], model: Model) =>
//     enclosures.filter(e => e.model && e.model.id === model.id)
// );

export const selectServersInRack = createSelector(selectRackServers, (servers: RackMountable[], rack: Rack) =>
    servers.filter(s => s.assetConnection && s.assetConnection.containerItemId === rack.id)
);

// const selectUnmountedRackServers = createSelector(selectRackServers, (servers: RackMountable[]) =>
//     servers.filter(s => !s.assetConnection)
// );
// const selectRackServersWithoutModel = createSelector(selectRackServers, (servers: RackMountable[]) =>
//     servers.filter(s => !s.model)
// );

export const selectServersInEnclosure = createSelector(selectBladeServers, (servers: BladeServerHardware[], enclosure: BladeEnclosure) =>
    servers.filter(s => s.connectionToEnclosure && s.connectionToEnclosure.containerItemId === enclosure.id)
);
export const selectNonServerMountablesInEnclosure = createSelector(selectEnclosureMountables,
    (assets: EnclosureMountable[], enclosure: BladeEnclosure) => assets.filter(asset => !(asset instanceof BladeServerHardware) &&
        asset.connectionToEnclosure && asset.connectionToEnclosure.containerItemId === enclosure.id)
);
export const selectAllMountablesInEnclosure = createSelector(selectEnclosureMountables,
    (assets: EnclosureMountable[], enclosure: BladeEnclosure) => assets.filter(asset => asset.connectionToEnclosure &&
        asset.connectionToEnclosure.containerItemId === enclosure.id)
);

export const selectUnmountedBladeServers = createSelector(selectBladeServers, (servers: BladeServerHardware[], enclosure: BladeEnclosure) =>
    servers.filter(s => !s.connectionToEnclosure)
);

export const selectRack = createSelector(selectRacks, (racks: Rack[], id: string) => racks.find(r => r.id === id));
// const selectEnclosure = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], id: string) =>
//     enclosures.find(e => e.id === id)
// );
// const selectRackServer = createSelector(selectRackServers, (servers: RackMountable[], id: string) => servers.find(s => s.id === id));

export const selectRackMountables = createSelector(selectEnclosures, selectGenericRackMountables,
    (s1, s2) => [...s1, ...s2]
);

const selectEnclosuresForRack = createSelector(selectEnclosures, selectRack,
    (enclosures: BladeEnclosure[], rack: Rack, id: string) =>
    enclosures.filter(e => e.assetConnection?.containerItemId === id)
);

const selectGenericRackMountablesForRack = createSelector(selectGenericRackMountables, selectRack,
    (rackMountables: RackMountable[], rack: Rack, id: string) =>
        rackMountables.filter(rm =>
            rm.assetConnection?.containerItemId === id)
);

const selectEnclosureMountablesForRack = createSelector(selectEnclosuresForRack, selectBladeServers, selectEnclosureMountables,
    (enclosures: BladeEnclosure[], bladeServers: BladeServerHardware[], mountables: EnclosureMountable[], id: string) => {
        const enclosureIds = enclosures.map(e => e.id);
        return [bladeServers.filter(s => s.connectionToEnclosure && enclosureIds.includes(s.connectionToEnclosure.containerItemId)),
            mountables.filter(m => m.connectionToEnclosure && enclosureIds.includes(m.connectionToEnclosure.containerItemId))];
    }
);

export const selectCompleteRack = createSelector(selectRack, selectEnclosuresForRack, selectGenericRackMountablesForRack,
    selectEnclosureMountablesForRack, ready, (rack: Rack, enclosures: BladeEnclosure[], rackMountables: RackMountable[],
                                              [bladeServers, enclosureMountables],
                                              isReady: boolean, id: string) => ({
        bladeServers,
        enclosureMountables,
        enclosures,
        rack,
        rackMountables,
        ready: isReady,
    })
);

const selectAllAssets = createSelector(selectRacks, selectRackMountables, selectEnclosureMountables,
    (s1, s2, s3) => [...s1 as Asset[], ...s2 as Asset[], ...s3 as Asset[]]
);

const selectAssetsForItemType = createSelector(selectAllAssets, (assets: Asset[], itemTypeId: string) =>
    assets.filter(a => !!a.item && a.item.typeId === itemTypeId)
);

export const selectAssetsForModel = createSelector(selectAllAssets, (assets: Asset[], model: Model) =>
    assets.filter(a => !!a.model && a.model.id === model.id)
);

// const selectSingleAsset = createSelector(selectAllAssets, (assets: Asset[], id: string) => assets.find(a => a.id === id));

export const selectAssetsWithoutModel = createSelector(selectAllAssets, (assets) => assets.filter(a => !a.model));

export const selectAssetsWithoutModelForItemType = createSelector(selectAssetsForItemType, (assets: Asset[], itemTypeId: string) =>
    assets.filter(a => !a.model)
);

export const selectAssetNamesForType = createSelector(selectAssetsForItemType, (assets: Asset[], itemTypeId: string) =>
    assets.map(a => a.name.toLocaleLowerCase())
);

const selectUnmountedRackMountables = createSelector(selectRackMountables, (rackMountables: RackMountable[]) =>
    rackMountables.filter(rm => rm.model && !rm.assetConnection && rm.status !== AssetStatus.Scrapped)
);

export const selectUnmountedRackMountablesOfHeight = createSelector(selectUnmountedRackMountables,
    (rackMountables: RackMountable[], maxHeightUnits: number) =>
    rackMountables.filter(rm => rm.model.heightUnits <= maxHeightUnits)
);

export const selectUnmountedRackMountablesOfTypeAndHeight = createSelector(selectUnmountedRackMountables,
    (rackMountables: RackMountable[], search: {typeId: string, maxHeightUnits: number, modelId?: string}) =>
    rackMountables.filter(rm => rm.item.typeId === search.typeId && rm.model && rm.model.heightUnits <= search.maxHeightUnits)
);

export const selectUnmountedRackMountableModelsForTypeAndHeight = createSelector(selectUnmountedRackMountablesOfTypeAndHeight,
    (rackMountables: RackMountable[], search: {typeId: string, maxHeightUnits: number, modelId?: string}) =>
    [...new Set(rackMountables.map(rm => rm.model))].sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnmountedRackMountablesOfModelAndHeight = createSelector(selectUnmountedRackMountablesOfTypeAndHeight,
    (rackMountables: RackMountable[], search: {typeId: string, maxHeightUnits: number, modelId: string}) =>
    rackMountables.filter(rm => rm.model.id === search.modelId)
);

export const selectUnmountedEnclosureMountables = createSelector(selectEnclosureMountables, (enclosureMountables: EnclosureMountable[]) =>
    enclosureMountables.filter(em => em.model && !em.connectionToEnclosure && em.status !== AssetStatus.Scrapped)
);

export const selectUnMountedFrontEndEnclosureMountablesForSize = createSelector(selectUnmountedEnclosureMountables,
    selectEnclosureMountableFrontSideItemTypes,
    (enclosureMountables: EnclosureMountable[], itemTypes: ItemType[], search: {maxWidth: number, maxHeight: number}) =>
    enclosureMountables.filter(em => itemTypes.map(t => t.id).includes(em.item.typeId) &&
        em.model.width <= search.maxWidth && em.model.height <= search.maxHeight)
);

export const selectUnMountedEnclosureMountablesForTypeAndSize = createSelector(selectUnmountedEnclosureMountables,
    (enclosureMountables: EnclosureMountable[], search: {typeId: string, maxWidth: number, maxHeight: number, modelId?: string}) =>
    enclosureMountables.filter(em => em.item.typeId === search.typeId && em.model.width <= search.maxWidth &&
        em.model.height <= search.maxHeight)
);

export const selectUnMountedEnclosureMountableModelsForTypeAndSize = createSelector(selectUnMountedEnclosureMountablesForTypeAndSize,
    (enclosureMountables: EnclosureMountable[], search: {typeId: string, maxWidth: number, maxHeight: number, modelId?: string}) =>
    [...new Set(enclosureMountables.map(em => em.model))].sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnmountedEnclosureMountablesOfModelAndSize = createSelector(selectUnMountedEnclosureMountablesForTypeAndSize,
    (enclosureMountables: EnclosureMountable[], search: {typeId: string, maxWidth: number, maxHeight: number, modelId: string}) =>
    enclosureMountables.filter(em => em.model.id === search.modelId)
);
