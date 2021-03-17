/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { createReducer, Action, on } from '@ngrx/store';

import * as MetaDataActions from './meta-data.actions';
import * as AdminActions from '../admin/admin.actions';

import { UserRole } from '../../objects/meta-data/user-role.enum';
import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { ConnectionType } from '../../objects/meta-data/connection-type.model';
import { ItemType } from '../../objects/meta-data/item-type.model';

export interface State {
    validData: boolean;
    loadingData: boolean;
    userName: string;
    userRole: UserRole;
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
}

const initialState: State = {
    validData: false,
    loadingData: false,
    userName: undefined,
    userRole: 0,
    attributeGroups: [],
    attributeTypes: [],
    connectionRules: [],
    connectionTypes: [],
    itemTypes: [],
};

const nameCompare = ((a: any, b: any) => a.name.localeCompare(b.name));

// eslint-disable-next-line @typescript-eslint/naming-convention
export function MetaDataReducer(appState: State | undefined, appAction: Action) {
    return createReducer(
        initialState,
        on(MetaDataActions.readState, (state, action) => ({
            ...state,
            validData: false,
            loadingData: true,
        })),
        on(MetaDataActions.setState, (state, action) => ({
            ...state,
            ...action.metaData,
            validData: true,
            loadingData: false,
        })),
        on(MetaDataActions.invalidate, (state, action) => ({
            ...state,
            validData: false,
            loadingData: false,
        })),
        on(AdminActions.storeAttributeGroup, (state, action) => ({
            ...state,
            attributeGroups: [...state.attributeGroups.filter(ag => ag.id !== action.attributeGroup.id), action.attributeGroup].sort(nameCompare),
        })),
        on(AdminActions.unstoreAttributeGroup, (state, action) => ({
            ...state,
            attributeGroups: state.attributeGroups.filter(ag => ag.id !== action.attributeGroup.id),
        })),
        on(AdminActions.storeAttributeType, (state, action) => ({
            ...state,
            attributeTypes: [...state.attributeTypes.filter(ag => ag.id !== action.attributeType.id), action.attributeType].sort(nameCompare),
        })),
        on(AdminActions.unstoreAttributeType, (state, action) => ({
            ...state,
            attributeTypes: state.attributeTypes.filter(ag => ag.id !== action.attributeType.id),
        })),
        on(AdminActions.storeConnectionType, (state, action) => ({
            ...state,
            connectionTypes: [...state.connectionTypes.filter(ag => ag.id !== action.connectionType.id), action.connectionType].sort(nameCompare),
        })),
        on(AdminActions.unstoreConnectionType, (state, action) => ({
            ...state,
            connectionTypes: state.connectionTypes.filter(ag => ag.id !== action.connectionType.id),
        })),
        on(AdminActions.storeConnectionRule, (state, action) => ({
            ...state,
            connectionRules: [...state.connectionRules.filter(ag => ag.id !== action.connectionRule.id), action.connectionRule],
        })),
        on(AdminActions.unstoreConnectionRule, (state, action) => ({
            ...state,
            connectionRules: state.connectionRules.filter(ag => ag.id !== action.connectionRule.id),
        })),
        on(AdminActions.storeItemType, (state, action) => ({
            ...state,
            itemTypes: [...state.itemTypes.filter(ag => ag.id !== action.itemType.id), action.itemType].sort(nameCompare),
        })),
        on(AdminActions.unstoreItemType, (state, action) => ({
            ...state,
        })),
    )(appState, appAction);

}
