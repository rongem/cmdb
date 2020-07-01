import { Action, createReducer, on } from '@ngrx/store';
import { MetaDataActions } from 'backend-access';

import * as BasicsActions from './basics.actions';

import { Room } from '../../objects/asset/room.model';
import { Model } from '../../objects/model.model';
import { RuleStore } from '../../objects/appsettings/rule-store.model';

export interface State {
    validatingSchema: boolean;
    validSchema: boolean;
    retryCount: number;
    ruleStores: RuleStore[];
    rooms: Room[];
    roomsLoading: boolean;
    roomsReady: boolean;
    models: Model[];
    modelsLoading: boolean;
    modelsReady: boolean;
}

const initialState: State = {
    validatingSchema: false,
    validSchema: false,
    retryCount: 0,
    ruleStores: [],
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
            validatingSchema: false,
        })),
        on(MetaDataActions.setState, (state, actions) => ({
            ...state,
            validatingSchema: true,
            validSchema: false,
        })),
        on(BasicsActions.validateSchema, (state, actions) => ({
            ...state,
            validatingSchema: false,
            validSchema: true,
            retryCount: 0,
        })),
        on(BasicsActions.invalidateSchema, (state, actions) => ({
            ...state,
            ruleStores: [],
            validatingSchema: false,
            validSchema: false,
        })),
        on(BasicsActions.setRuleStore, (state, action) => ({
            ...state,
            ruleStores: [...action.ruleStores],
        })),
        on(BasicsActions.readRooms, (state, action) => ({
            ...state,
            rooms: [],
            roomsLoading: true,
            roomsReady: false,
        })),
        on(BasicsActions.setRooms, (state, action) => ({
            ...state,
            rooms: [...action.rooms],
            roomsLoading: false,
            roomsReady: true,
        })),
        on(BasicsActions.setRoom, (state, action) => ({
            ...state,
            rooms: [...state.rooms.filter(r => r.id !== action.room.id), action.room].sort((a, b) => a.name.localeCompare(b.name)),
        })),
        on(BasicsActions.roomsFailed, (state, action) => ({
            ...state,
            rooms: [],
            roomsLoading: false,
            roomsReady: false,
        })),
        on(BasicsActions.deleteRoom, (state, action) => ({
            ...state,
            rooms: [...state.rooms.filter(r => r.id !== action.roomId)],
        })),
        on(BasicsActions.readModels, (state, action) => ({
            ...state,
            models: [],
            modelsLoading: true,
            modelsReady: false,
        })),
        on(BasicsActions.setModels, (state, action) => ({
            ...state,
            models: [...action.models],
            modelsLoading: false,
            modelsReady: true,
        })),
        on(BasicsActions.setModel, (state, action) => ({
            ...state,
            models: [...state.models.filter(m => m.id !== action.model.id), action.model].sort((a, b) => a.name.localeCompare(b.name)),
        })),
        on(BasicsActions.modelsFailed, (state, action) => ({
            ...state,
            models: [],
            modelsLoading: false,
            modelsReady: false,
        })),
        on(BasicsActions.deleteModel, (state, action) => ({
            ...state,
            models: state.models.filter(m => m.id !== action.modelId),
        })),
        )(basicsState, basicsAction);
    }

