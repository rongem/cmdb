import { Action, createReducer, on } from '@ngrx/store';
import { MetaDataActions } from 'backend-access';

import * as BasicsActions from './basics.actions';

import { Room } from '../../objects/asset/room.model';
import { Model } from '../../objects/model.model';

export interface State {
    validSchema: boolean;
    retryCount: number;
    rooms: Room[];
    roomsLoading: boolean;
    roomsReady: boolean;
    models: Model[];
    modelsLoading: boolean;
    modelsReady: boolean;
}

const initialState: State = {
    validSchema: false,
    retryCount: 0,
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
        on(MetaDataActions.readState, (state, action) => ({
            ...state,
            retryCount: state.retryCount + 1,
        })),
        on(BasicsActions.resetRetryCount, (state, action) => ({
            ...state,
            retryCount: 0,
        })),
        on(MetaDataActions.setState, (state, actions) => ({
            ...state,
            validSchema: false,
        })),
        on(BasicsActions.validateSchema, (state, actions) => ({
            ...state,
            validSchema: true,
            retryCount: 0,
        })),
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

