import { Action, createReducer, on } from '@ngrx/store';

import * as RoomsActions from 'src/app/rooms/store/rooms.actions';

import { Room } from 'src/app/shared/objects/asset/room.model';

export interface State {
    rooms: Room[];
    roomsReady: boolean;
}

const initialState: State = {
    rooms: [],
    roomsReady: false,
};

export function RoomsReducer(roomsState: State | undefined, roomsAction: Action): State {
    return createReducer(
        initialState,
        on(RoomsActions.readRooms, (state, action) => ({
            ...state,
            roomsReady: false,
        })),
        on(RoomsActions.setRooms, (state, action) => ({
            ...state,
            rooms: action.rooms,
            roomsReady: true,
        })),
    )(roomsState, roomsAction);
}
