import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../store/app.reducer';
import * as fromBasics from './basics.reducer';

import { Room } from '../../objects/asset/room.model';
import { Model } from '../../objects/model.model';
import { ExtendedAppConfigService } from '../../app-config.service';
import { Mappings } from '../../objects/appsettings/mappings.model';
import { llcc, llc } from '../functions';

export const selectState = createFeatureSelector<fromBasics.State>(fromApp.BASICS);
export const selectRooms = createSelector(selectState, state => state.rooms);
export const selectModels = createSelector(selectState, state => state.models);

export const selectSchemaReady = createSelector(MetaDataSelectors.selectDataValid, selectState,
    (metaDataValid, state) => metaDataValid && state.validSchema
);
export const selectRetries = createSelector(selectState, state => state.retryCount);

export const selectBasicsReady = createSelector(selectState, state => state.roomsReady && state.modelsReady);

export const selectRuleStores = createSelector(selectState, state => state.ruleStores);

export const selectBuildings = createSelector(selectRooms, rooms => [...new Set(rooms.map(room => room.building).sort())]);

export const selectRoom = (roomId: string) => createSelector(selectRooms, (rooms: Room[]) => rooms.find(r => r.id === roomId));

export const selectRoomsByBuilding = (building: string) => createSelector(selectRooms, (rooms: Room[]) => rooms.filter(room => room.building === building));

export const selectModel = (modelId: string) => createSelector(selectModels, (models: Model[]) => models.find(m => m.id === modelId));

export const selectIncompleteModels = createSelector(selectModels, models =>
    models.filter(m => !m.manufacturer || m.manufacturer === '' || !m.targetType || m.targetType === '' ||
        (Mappings.rackMountables.includes(m.targetType) && m.heightUnits < 1) ||
        (llcc(m.targetType, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure) &&
        (m.backSideSlots === null || m.backSideSlots === undefined || m.backSideSlots < 0 || m.height < 1 || m.width < 1)) ||
        (Mappings.enclosureMountables.includes(llc(m.targetType)) && (m.height < 1 || m.width < 1)))
);

export const selectIncompleteModelIds = createSelector(selectIncompleteModels, models => models.map(m => m.id));

export const selectModelsForItemType = (targetType: string) => createSelector(selectModels, (models: Model[]) =>
    models.filter(m => m.targetType && llcc(m.targetType, targetType))
);

// export const selectManufacturers = createSelector(selectModels, models =>
//     [...new Set(models.map(m => m.manufacturer))].sort()
// );

export const ready = createSelector(MetaDataSelectors.selectDataValid, selectBasicsReady,
    (previousReady, thisReady) => previousReady && thisReady
);
