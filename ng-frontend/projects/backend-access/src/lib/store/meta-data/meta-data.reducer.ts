import { createReducer, Action, on } from '@ngrx/store';

import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../../objects/meta-data/user-role.enum';
import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ItemTypeAttributeGroupMapping } from '../../objects/meta-data/item-type-attribute-group-mapping.model';
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
    itemTypeAttributeGroupMappings: ItemTypeAttributeGroupMapping[];
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
    itemTypeAttributeGroupMappings: [],
    connectionRules: [],
    connectionTypes: [],
    itemTypes: [],
};

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
    )(appState, appAction);

}
