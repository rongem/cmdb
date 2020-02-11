import { createReducer, Action, on } from '@ngrx/store';

import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../objects/source/user-role.enum';
import { AttributeGroup } from '../objects/source/attribute-group.model';
import { AttributeType } from '../objects/source/attribute-type.model';
import { ConnectionRule } from '../objects/source/connection-rule.model';
import { ConnectionType } from '../objects/source/connection-type.model';
import { ItemType } from '../objects/source/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../objects/source/item-type-attribute-group-mapping.model';

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
        on(MetaDataActions.createAttributeGroup, (state, actions) => ({
            ...state,
            attributeGroups: [...state.attributeGroups, actions.attributeGroup],
        })),
        on(MetaDataActions.createAttributeType, (state, actions) => ({
            ...state,
            attributeTypes: [...state.attributeTypes, actions.attributeType],
        })),
        on(MetaDataActions.createItemType, (state, actions) => ({
            ...state,
            itemTypes: [...state.itemTypes, actions.itemType],
        })),
        on(MetaDataActions.createConnectionType, (state, actions) => ({
            ...state,
            connectionTypes: [...state.connectionTypes, actions.connectionType],
        })),
    )(appState, appAction);
}
