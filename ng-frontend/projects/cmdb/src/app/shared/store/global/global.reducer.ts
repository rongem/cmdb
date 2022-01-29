import { Action, createReducer, on } from '@ngrx/store';
import { GlobalActions } from '../store.api';

export interface State {
    desiredUrl?: string;
}

const initialState: State = {
    desiredUrl: undefined,
};

export const globalReducer = (globalState: State | undefined, globalAction: Action): State => createReducer(
    initialState,
    on(GlobalActions.setUrl, (state, action) => ({
        ...state,
        desiredUrl: action.url,
    })),
    on(GlobalActions.clearUrl, (state, action) => ({
        ...state,
        desiredUrl: undefined,
    })),
)(globalState, globalAction);
