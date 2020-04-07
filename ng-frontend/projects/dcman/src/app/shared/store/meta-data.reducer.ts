import { createReducer, Action, on } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import * as MetaDataActions from './meta-data.actions';
import { UserRole } from 'backend-access';
import { AttributeGroup } from 'backend-access';
import { AttributeType } from 'backend-access';
import { ConnectionRule } from 'backend-access';
import { ConnectionType } from 'backend-access';
import { ItemType } from 'backend-access';
import { ItemTypeAttributeGroupMapping } from 'backend-access';

export function getErrorMessage(errorObject: any) {
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
    validData: boolean;
    validSchema: boolean;
    loadingData: boolean;
    error: string;
    errorList: string[];
    retryCount: number;
    userName: string;
    userRole: UserRole;
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    itemTypeAttributeGroupMappings: ItemTypeAttributeGroupMapping[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
}

const initialState: State = {
    validData: false,
    validSchema: false,
    loadingData: false,
    error: undefined,
    errorList: [],
    retryCount: 0,
    userName: undefined,
    userRole: 0,
    attributeGroups: [],
    attributeTypes: [],
    itemTypeAttributeGroupMappings: [],
    connectionRules: [],
    connectionTypes: [],
    itemTypes: [],
};

export function MetaDataReducer(appState: State | undefined, appAction: Action) {
    return createReducer(
        initialState,
        on(MetaDataActions.readState, (state, actions) => ({
            ...state,
            loadingData: true,
            retryCount: actions.resetRetryCount ? 0 : state.retryCount + 1,
            error: actions.resetRetryCount ? undefined : state.error,
            errorList: actions.resetRetryCount ? [] : state.errorList,
        })),
        on(MetaDataActions.setState, (state, actions) => ({
            ...state,
            ...actions.metaData,
            validData: true,
            validSchema: false,
            loadingData: false,
        })),
        on(MetaDataActions.error, (state, actions) => ({
            ...state,
            error: getErrorMessage(actions.error),
            errorList: [getErrorMessage(actions.error), ...state.errorList.slice(0, 4)],
            validData: !actions.invalidateData,
            validSchema: !actions.invalidateData,
            loadingData: false,
        })),
        on(MetaDataActions.validateSchema, (state, actions) => ({
            ...state,
            validSchema: true,
            retryCount: 0,
        }))
    )(appState, appAction);
}
