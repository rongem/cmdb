import { Action, createReducer, on } from '@ngrx/store';

import * as LogActions from './log.actions';

import { LineMessage } from '../../objects/import/line-message.model';

export interface State {
    logEntries: LineMessage[];
}

const initialState: State = {
    logEntries: [],
};

export function LogReducer(displayState: State | undefined, displayAction: Action): State {
    return createReducer(
        initialState,
        on(LogActions.clearLog, (state, action) => ({
            ...state,
            logEntries: [],
        })),
        on(LogActions.log, (state, action) => ({
            ...state,
            logEntries: [...state.logEntries, action.logEntry]
        })),
    )(displayState, displayAction);
}



