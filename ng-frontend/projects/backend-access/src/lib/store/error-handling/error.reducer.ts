import { createReducer, Action, on } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import * as ErrorActions from './error.actions';

function getErrorMessage(errorObject: any) {
    if (errorObject instanceof HttpErrorResponse) {
        if (errorObject.error && errorObject.error.Message) {
            return errorObject.error.Message;
        }
        if (errorObject.status === 0 && errorObject.statusText.toLocaleLowerCase() === 'unknown error') {
            return 'Unable to contact URL ' + errorObject.url;
        }
        return JSON.stringify(errorObject); // errorObject.message;
    } else if (typeof errorObject === 'string') {
        return errorObject;
    }
    return JSON.stringify(errorObject);
}

export interface State {
    recentError: string;
    fatalErrorState: boolean;
    errorList: string[];
}

const initialState: State = {
    recentError: undefined,
    fatalErrorState: false,
    errorList: [],
};

export function ErrorReducer(appState: State | undefined, appAction: Action) {
    return createReducer(
        initialState,
        on(ErrorActions.error, (state, action) => ({
            ...state,
            recentError: getErrorMessage(action.error),
            fatalErrorState: action.fatal,
            errorList: [...state.errorList, getErrorMessage(action.error)],
        })),
        on(ErrorActions.clearError, () => ({
            ...initialState,
        })),
    )(appState, appAction);
}

