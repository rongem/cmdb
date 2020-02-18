import { createReducer, Action, on } from '@ngrx/store';

import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../objects/rest-api/user-role.enum';
import { AttributeGroup } from '../objects/rest-api/attribute-group.model';
import { AttributeType } from '../objects/rest-api/attribute-type.model';
import { ConnectionRule } from '../objects/rest-api/connection-rule.model';
import { ConnectionType } from '../objects/rest-api/connection-type.model';
import { ItemType } from '../objects/rest-api/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../objects/rest-api/item-type-attribute-group-mapping.model';

export interface State {
    validData: boolean;
    validSchema: boolean;
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
    validSchema: false,
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
            validSchema: false,
            loadingData: false,
        })),
        on(MetaDataActions.error, (state, actions) => ({
            ...state,
            error: actions.error,
            validData: !actions.invalidateData,
            validSchema: false,
            loadingData: false,
        })),
        on(MetaDataActions.validateSchema, (state, actions) => ({
            ...state,
            validSchema: true,
        }))
    )(appState, appAction);
}
