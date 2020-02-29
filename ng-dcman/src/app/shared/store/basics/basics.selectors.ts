import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromBasics from './basics.reducer';

import { Room } from '../../objects/asset/room.model';
import { Guid } from '../../guid';

export const selectState = createFeatureSelector<fromBasics.State>(fromApp.BASICS);
export const selectRooms = createSelector(selectState, state => state.rooms);
export const selectModels = createSelector(selectState, state => state.models);

export const selectReady = createSelector(selectState, state => state.roomsReady && state.modelsReady);

export const selectBuildings = createSelector(selectRooms, rooms => [...new Set(rooms.map(room => room.building).sort())]);

export const selectRoom = createSelector(selectRooms,
    (rooms: Room[], roomId: Guid) => rooms.find(r => r.id === roomId)
);

export const selectRoomsByBuilding = createSelector(selectRooms,
    (rooms: Room[], building: string) => rooms.filter(room => room.building === building)
);
