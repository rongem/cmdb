import { ActionReducerMap } from '@ngrx/store';

import * as fromMetaData from './meta-data.reducer';
import * as fromRooms from 'src/app/rooms/store/rooms.reducer';

export const METADATA = 'metaData';
export const ROOMS = 'rooms';

export interface AppState {
    metaData: fromMetaData.State;
    rooms: fromRooms.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    metaData: fromMetaData.MetaDataReducer,
    rooms: fromRooms.RoomsReducer,
};
