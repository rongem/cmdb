import { createReducer, Action, on } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../objects/user-role.enum';
import { AttributeGroup } from '../objects/attribute-group.model';
import { AttributeType } from '../objects/attribute-type.model';
import { ConnectionRule } from '../objects/connection-rule.model';
import { ConnectionType } from '../objects/connection-type.model';
import { ItemType } from '../objects/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../objects/item-type-attribute-group-mapping.model';

export interface State {
    validData: boolean;
    error: any;
    userName: string;
    userRole: UserRole;
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    itemTypeAttributeGroupMappings: ItemTypeAttributeGroupMapping[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
    // currentItemType: ItemType;
}

const initialState: State = {
    validData: false,
    error: undefined,
    userName: undefined,
    userRole: 0,
    attributeGroups: [],
    attributeTypes: [],
    itemTypeAttributeGroupMappings: [],
    connectionRules: [],
    connectionTypes: [],
    itemTypes: [],
    // currentItemType: undefined,
};

export function MetaDataReducer(appState: State | undefined, appAction: Action) {
    return createReducer(
        initialState,
        on(MetaDataActions.setState, (state, actions) => ({
            ...state,
            ...actions.metaData,
            error: undefined,
            validData: true,
        })),
        on(MetaDataActions.error, (state, actions) => ({
            ...state,
            error: actions.error,
            validData: !actions.invalidateData,
        })),
    )(appState, appAction);

}
