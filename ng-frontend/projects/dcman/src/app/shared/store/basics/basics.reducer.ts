import { Action, createReducer, on } from '@ngrx/store';

import * as BasicsActions from './basics.actions';

import { Room } from '../../objects/asset/room.model';
import { Model } from '../../objects/model.model';

export interface State {
    rooms: Room[];
    roomsLoading: boolean;
    roomsReady: boolean;
    models: Model[];
    modelsLoading: boolean;
    modelsReady: boolean;
}

const initialState: State = {
    rooms: [],
    roomsLoading: false,
    roomsReady: false,
    models: [],
    modelsLoading: false,
    modelsReady: false,
};

export function BasicsReducer(basicsState: State | undefined, basicsAction: Action): State {
    return createReducer(
        initialState,
        on(BasicsActions.readRooms, (state, action) => ({
            ...state,
            rooms: [],
            roomsLoading: true,
            roomsReady: false,
        })),
        on(BasicsActions.setRooms, (state, action) => ({
            ...state,
            rooms: action.rooms,
            roomsLoading: false,
            roomsReady: true,
        })),
        on(BasicsActions.roomsFailed, (state, action) => ({
            ...state,
            rooms: [],
            roomsLoading: false,
            roomsReady: false,
        })),
        on(BasicsActions.readModels, (state, action) => ({
            ...state,
            models: [],
            modelsLoading: true,
            modelsReady: false,
        })),
        on(BasicsActions.setModels, (state, action) => ({
            ...state,
            models: action.models,
            modelsLoading: false,
            modelsReady: true,
        })),
        on(BasicsActions.modelsFailed, (state, action) => ({
            ...state,
            models: [],
            modelsLoading: false,
            modelsReady: false,
        })),
        )(basicsState, basicsAction);
    }

