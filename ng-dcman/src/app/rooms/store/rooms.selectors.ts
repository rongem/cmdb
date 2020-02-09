import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromRooms from 'src/app/rooms/store/rooms.reducer';

import { Guid } from 'src/app/shared/guid';
import { Room } from 'src/app/shared/objects/assets/room.model';

export const getRoomsState = createFeatureSelector<fromRooms.State>(fromApp.ROOMS);

export const selectRooms = createSelector(getRoomsState,
    (state: fromRooms.State) => state.rooms
);

export const selectRoomsReady = createSelector(getRoomsState,
    (state: fromRooms.State) => state.roomsReady
);

export const selectRoom = createSelector(selectRooms,
    (rooms: Room[], roomId: Guid) => rooms.find(r => r.id === roomId)
);

export const selectBuildings = createSelector(selectRooms,
    rooms => (new Set(...rooms.map(r => r.building).sort()))
);
