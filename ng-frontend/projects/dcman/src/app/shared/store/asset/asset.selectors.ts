import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors, ItemType } from 'backend-access';

import * as fromApp from '../../store/app.reducer';
import * as fromAsset from './asset.reducer';
import * as fromSelectBasics from '../../store/basics/basics.selectors';

import { Room } from '../../objects/asset/room.model';
import { Rack } from '../../objects/asset/rack.model';
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { ExtendedAppConfigService as AppConfig, ExtendedAppConfigService } from '../../app-config.service';
import { Asset } from '../../objects/prototypes/asset.model';
import { Model } from '../../objects/model.model';
import { EnclosureMountable } from '../../objects/asset/enclosure-mountable.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';
import { Mappings } from '../../objects/appsettings/mappings.model';
import { AssetStatus } from '../../objects/asset/asset-status.enum';
import { SlotInformation } from '../../objects/position/slot-information.model';
import { llc, llcc } from '../functions';
import { RackServerHardware } from '../../objects/asset/rack-server-hardware.model';

export const selectState = createFeatureSelector<fromAsset.State>(fromApp.ASSET);
export const selectRacks = createSelector(selectState, state => state.racks);
export const selectEnclosures = createSelector(selectState, state => state.enclosures);
export const selectRackServers = createSelector(selectState, state => state.rackMountables.filter(r =>
    llcc(r.type, AppConfig.objectModel.ConfigurationItemTypeNames.RackServerHardware)) as RackServerHardware[]);
const selectGenericRackMountables = createSelector(selectState, state => state.rackMountables);
export const selectBladeServers = createSelector(selectState, state => state.enclosureMountables.filter(r =>
    llcc(r.type, AppConfig.objectModel.ConfigurationItemTypeNames.BladeServerHardware)) as BladeServerHardware[]
);
export const selectEnclosureMountables = createSelector(selectState, state => state.enclosureMountables);

export const selectAssetTypes = createSelector(MetaDataSelectors.selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => (Mappings.rackMountables.includes(llc(t.name)) ||
        Mappings.enclosureMountables.includes(llc(t.name)) ||
        llcc(t.name, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack)))
);

export const selectEnclosureMountableItemTypes = createSelector(MetaDataSelectors.selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.enclosureMountables.includes(llc(t.name)))
);

export const selectEnclosureMountableFrontSideItemTypes = createSelector(selectEnclosureMountableItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => !Mappings.enclosureBackSideMountables.includes(llc(t.name)))
);

export const selectEnclosureMountableBackSideItemTypes = createSelector(selectEnclosureMountableItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.enclosureBackSideMountables.includes(llc(t.name)))
);

export const selectRackMountableItemTypes = createSelector(MetaDataSelectors.selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.rackMountables.includes(llc(t.name)))
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

export const selectRacksInRoom = (room: Room) => createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => r.connectionToRoom && r.connectionToRoom.roomId === room.id)
);

export const selectRacksWithoutModel = createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => !r.model)
);

export const selectRacksForModel = (model: Model) => createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => r.model && r.model.id === model.id)
);

export const selectEnclosuresInRack = (rack: Rack) => createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
    enclosures.filter(e => e.assetConnection && e.assetConnection.containerItemId === rack.id)
);

export const selectServersInRack = (rack: Rack) => createSelector(selectRackServers, (servers: RackMountable[]) =>
    servers.filter(s => s.assetConnection && s.assetConnection.containerItemId === rack.id)
);

export const selectServersInEnclosure = (enclosure: BladeEnclosure) => createSelector(selectBladeServers, (servers: BladeServerHardware[]) =>
    servers.filter(s => s.connectionToEnclosure && s.connectionToEnclosure.containerItemId === enclosure.id)
);
export const selectNonServerMountablesInEnclosure = (enclosure: BladeEnclosure) => createSelector(selectEnclosureMountables,
    (assets: EnclosureMountable[]) => assets.filter(asset => !(asset instanceof BladeServerHardware) &&
        asset.connectionToEnclosure && asset.connectionToEnclosure.containerItemId === enclosure.id)
);
export const selectAllMountablesInEnclosure = (enclosure: BladeEnclosure) => createSelector(selectEnclosureMountables,
    (assets: EnclosureMountable[]) => assets.filter(asset => asset.connectionToEnclosure &&
        asset.connectionToEnclosure.containerItemId === enclosure.id)
);

export const selectUnmountedBladeServers = createSelector(selectBladeServers, (servers: BladeServerHardware[]) =>
    servers.filter(s => !s.connectionToEnclosure)
);

export const selectRack = (id: string) => createSelector(selectRacks, (racks: Rack[]) => racks.find(r => r.id === id));
export const selectEnclosure = (id: string) => createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
    enclosures.find(e => e.id === id)
);
// const selectRackServer = createSelector(selectRackServers, (servers: RackMountable[], id: string) => servers.find(s => s.id === id));

export const selectRackMountables = createSelector(selectEnclosures, selectGenericRackMountables,
    (s1, s2) => [...s1, ...s2]
);

const selectEnclosuresForRack = (id: string) => createSelector(selectEnclosures,
    (enclosures: BladeEnclosure[]) => enclosures.filter(e => e.assetConnection?.containerItemId === id)
);

const selectGenericRackMountablesForRack = (id: string) => createSelector(selectGenericRackMountables, (rackMountables: RackMountable[]) =>
    rackMountables.filter(rm => rm.assetConnection?.containerItemId === id)
);

const selectBackSideEnclosureMountables = createSelector(selectEnclosureMountables,
    selectEnclosureMountableBackSideItemTypes, (enclosureMountables: EnclosureMountable[], itemTypes: ItemType[]) =>
    enclosureMountables.filter(em => itemTypes.map(t => t.id).includes(em.item.typeId))
);

const selectFrontSideEnclosureMountables = createSelector(selectEnclosureMountables,
    selectEnclosureMountableFrontSideItemTypes, (enclosureMountables: EnclosureMountable[], itemTypes: ItemType[]) =>
    enclosureMountables.filter(em => itemTypes.map(t => t.id).includes(em.item.typeId))
);

const selectEnclosureMountablesForRack = (id: string) => createSelector(selectEnclosuresForRack(id), selectFrontSideEnclosureMountables,
    selectBackSideEnclosureMountables,
    (enclosures: BladeEnclosure[], frontSideMountables: EnclosureMountable[], backSideMountables: EnclosureMountable[]) => {
        const enclosureIds = enclosures.map(e => e.id);
        return [frontSideMountables.filter(s => s.connectionToEnclosure && enclosureIds.includes(s.connectionToEnclosure.containerItemId)),
            backSideMountables.filter(m => m.connectionToEnclosure && enclosureIds.includes(m.connectionToEnclosure.containerItemId))];
    }
);

export const selectCompleteRack = (id: string) => createSelector(selectRack(id), selectEnclosuresForRack(id), selectGenericRackMountablesForRack(id),
    selectEnclosureMountablesForRack(id), ready, (rack: Rack, enclosures: BladeEnclosure[], rackMountables: RackMountable[],
                                              [enclosureFrontSideMountables, enclosureBackSideMountables],
                                              isReady: boolean) => ({
        enclosureFrontSideMountables,
        enclosureBackSideMountables,
        enclosures,
        rack,
        rackMountables,
        ready: isReady,
    })
);

const selectAllAssets = createSelector(selectRacks, selectRackMountables, selectEnclosureMountables,
    (s1, s2, s3) => [...s1 as Asset[], ...s2 as Asset[], ...s3 as Asset[]]
);

const selectAssetsForItemType = (itemTypeId: string) => createSelector(selectAllAssets, (assets: Asset[]) =>
    assets.filter(a => !!a.item && a.item.typeId === itemTypeId)
);

export const selectAssetsForModel = (model: Model) => createSelector(selectAllAssets, (assets: Asset[]) =>
    assets.filter(a => !!a.model && a.model.id === model.id)
);

// const selectSingleAsset = createSelector(selectAllAssets, (assets: Asset[], id: string) => assets.find(a => a.id === id));

export const selectAssetsWithoutModel = createSelector(selectAllAssets, (assets) => assets.filter(a => !a.model));

export const selectAssetsWithoutModelForItemType = (itemTypeId: string) => createSelector(selectAssetsForItemType(itemTypeId), (assets: Asset[]) =>
    assets.filter(a => !a.model)
);

export const selectAssetNamesForType = (itemTypeId: string) => createSelector(selectAssetsForItemType(itemTypeId), (assets: Asset[]) =>
    assets.map(a => llc(a.name))
);

const selectUnmountedRackMountables = createSelector(selectRackMountables, (rackMountables: RackMountable[]) =>
    rackMountables.filter(rm => rm.model && !rm.assetConnection && rm.status !== AssetStatus.Scrapped)
);

export const selectUnmountedRackMountablesOfHeight = (maxHeightUnits: number) => createSelector(selectUnmountedRackMountables,
    (rackMountables: RackMountable[]) => rackMountables.filter(rm => rm.model.heightUnits <= maxHeightUnits)
);

export const selectUnmountedRackMountablesOfTypeAndHeight = (typeId: string, maxHeightUnits: number) =>
    createSelector(selectUnmountedRackMountables, (rackMountables: RackMountable[]) =>
    rackMountables.filter(rm => rm.item.typeId === typeId && rm.model && rm.model.heightUnits <= maxHeightUnits)
);

export const selectUnmountedRackMountableModelsForTypeAndHeight = (typeId: string, maxHeightUnits: number) =>
    createSelector(selectUnmountedRackMountablesOfTypeAndHeight(typeId, maxHeightUnits), (rackMountables: RackMountable[]) =>
        [...new Set(rackMountables.map(rm => rm.model))].sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnmountedRackMountablesOfModelAndHeight = (typeId: string, maxHeightUnits: number, modelId: string) =>
    createSelector(selectUnmountedRackMountablesOfTypeAndHeight(typeId, maxHeightUnits), (rackMountables: RackMountable[]) =>
        rackMountables.filter(rm => rm.model.id === modelId)
);

const selectUnmountedEnclosureMountables = createSelector(selectEnclosureMountables, (enclosureMountables: EnclosureMountable[]) =>
    enclosureMountables.filter(em => em.model && !em.connectionToEnclosure && em.status !== AssetStatus.Scrapped)
);

const selectUnmountedFrontSideEnclosureMountables = createSelector(selectUnmountedEnclosureMountables,
    selectEnclosureMountableFrontSideItemTypes, (enclosureMountables: EnclosureMountable[], itemTypes: ItemType[]) =>
    enclosureMountables.filter(em => itemTypes.map(t => t.id).includes(em.item.typeId))
);

const doesModelFitInArea = (model: Model, slotArea: SlotInformation[]) => {
    const row = Math.min(...slotArea.map(s => s.row));
    const column = Math.min(...slotArea.map(s => s.column));
    return !slotArea.filter(s => s.row < row + model.height && s.column < column + model.width).some(s => s.occupied);
};

export const selectUnMountedFrontSideEnclosureMountablesForArea = (slotArea: SlotInformation[]) => createSelector(selectUnmountedEnclosureMountables,
    selectEnclosureMountableFrontSideItemTypes, (enclosureMountables: EnclosureMountable[], itemTypes: ItemType[]) =>
        enclosureMountables.filter(em => itemTypes.map(t => t.id).includes(em.item.typeId) && em.model &&
            doesModelFitInArea(em.model, slotArea))
);

export const selectUnmountedBackSideEnclosureMountables = createSelector(selectUnmountedEnclosureMountables,
    selectEnclosureMountableBackSideItemTypes, (enclosureMountables: EnclosureMountable[], itemTypes: ItemType[]) =>
    enclosureMountables.filter(em => itemTypes.map(t => t.id).includes(em.item.typeId))
);

export const selectUnMountedFrontSideEnclosureMountablesForTypeAndArea = (typeId: string, slotArea: SlotInformation[]) =>
    createSelector(selectUnmountedFrontSideEnclosureMountables, (enclosureMountables: EnclosureMountable[]) =>
        enclosureMountables.filter(em => em.model && em.item.typeId === typeId && doesModelFitInArea(em.model, slotArea))
);

export const selectUnMountedFrontSideEnclosureMountableModelsForTypeAndArea = (typeId: string, slotArea: SlotInformation[]) =>
    createSelector(selectUnMountedFrontSideEnclosureMountablesForTypeAndArea(typeId, slotArea), (enclosureMountables: EnclosureMountable[]) =>
        [...new Set(enclosureMountables.map(em => em.model))].sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnmountedFrontSideEnclosureMountablesOfModelAndArea = (typeId: string, slotArea: SlotInformation[], modelId: string) =>
    createSelector(selectUnMountedFrontSideEnclosureMountablesForTypeAndArea(typeId, slotArea), (enclosureMountables: EnclosureMountable[]) =>
        enclosureMountables.filter(em => em.model.id === modelId)
);

export const selectUnMountedBackSideEnclosureMountablesForType = (typeId: string) => createSelector(
    selectUnmountedBackSideEnclosureMountables, (enclosureMountables: EnclosureMountable[]) =>
        enclosureMountables.filter(em => em.model && em.item.typeId === typeId)
);

export const selectUnMountedBackSideEnclosureMountableModelsForType = (typeId: string) =>
    createSelector(selectUnMountedBackSideEnclosureMountablesForType(typeId), (enclosureMountables: EnclosureMountable[]) =>
        [...new Set(enclosureMountables.map(em => em.model))].sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnmountedBackSideEnclosureMountablesOfModel = (typeId: string, modelId: string) =>
    createSelector(selectUnMountedBackSideEnclosureMountablesForType(typeId), (enclosureMountables: EnclosureMountable[]) =>
        enclosureMountables.filter(em => em.model.id === modelId)
);
