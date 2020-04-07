import { createReducer, Action, on } from '@ngrx/store';
import { UserRole, AttributeGroup, AttributeType, ConnectionRule, ConnectionType, ItemType, ItemTypeAttributeGroupMapping } from 'backend-access';

import * as MetaDataActions from './meta-data.actions';

export interface State {
    validData: boolean;
    loadingData: boolean;
    error: any;
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
    loadingData: false,
    error: undefined,
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
        })),
        on(MetaDataActions.setState, (state, actions) => ({
            ...state,
            ...actions.metaData,
            error: undefined,
            validData: true,
            loadingData: false,
        })),
        on(MetaDataActions.error, (state, actions) => ({
            ...state,
            error: actions.error,
            validData: !actions.invalidateData,
            loadingData: false,
        })),
    )(appState, appAction);

}
