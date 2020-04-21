import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../store/app.reducer';
import * as fromBasics from './basics.reducer';

import { Room } from '../../objects/asset/room.model';
import { Guid } from 'backend-access';
import { Model } from '../../objects/model.model';

export const selectState = createFeatureSelector<fromBasics.State>(fromApp.BASICS);
export const selectRooms = createSelector(selectState, state => state.rooms);
export const selectModels = createSelector(selectState, state => state.models);

export const selectSchemaReady = createSelector(MetaDataSelectors.selectDataValid, selectState,
    (metaDataValid, state) => metaDataValid && state.validSchema
);
export const selectRetries = createSelector(selectState, state => state.retryCount);

export const selectBasicsReady = createSelector(selectState, state => state.roomsReady && state.modelsReady);

export const selectBuildings = createSelector(selectRooms, rooms => [...new Set(rooms.map(room => room.building).sort())]);

export const selectRoom = createSelector(selectRooms,
    (rooms: Room[], roomId: Guid) => rooms.find(r => r.id === roomId)
);

export const selectRoomsByBuilding = createSelector(selectRooms,
    (rooms: Room[], building: string) => rooms.filter(room => room.building === building)
);

export const selectModel = createSelector(selectModels, (models: Model[], modelId: Guid) =>
    models.find(m => m.id === modelId)
);

export const selectIncompleteModels = createSelector(selectModels, models =>
    models.filter(m => !m.manufacturer || m.manufacturer === '' || !m.targetType || m.targetType === '')
);

export const selectModelsForItemType = createSelector(selectModels, (models: Model[], targetType: string) =>
    models.filter(m => m.targetType && m.targetType.toLocaleLowerCase() === targetType.toLocaleLowerCase())
);

export const selectManufacturers = createSelector(selectModels, models =>
    [...new Set(models.map(m => m.manufacturer))].sort()
);

export const ready = createSelector(MetaDataSelectors.selectDataValid, selectBasicsReady,
    (previousReady, thisReady) => previousReady && thisReady
);
