import { Guid } from 'guid-typescript';

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
    currentItemType: {
        itemType: ItemType;
        connectionRulesToUpper: ConnectionRule[];
        connectionRulesToLower: ConnectionRule[];
        connectionTypesToUpper: ConnectionType[];
        connectionTypesToLower: ConnectionType[];
        upperItemTypesForConnectionType: Map<Guid, ItemType[]>;
        lowerItemTypesForConnectionType: Map<Guid, ItemType[]>;
    };
}

const initialState: State = {
    validData: false,
    error: null,
    userName: null,
    userRole: 0,
    attributeGroups: [],
    attributeTypes: [],
    itemTypeAttributeGroupMappings: [],
    connectionRules: [],
    connectionTypes: [],
    itemTypes: [],
    currentItemType: {
        itemType: null,
        connectionRulesToLower: [],
        connectionRulesToUpper: [],
        connectionTypesToUpper: [],
        connectionTypesToLower: [],
        lowerItemTypesForConnectionType: new Map<Guid, ItemType[]>(),
        upperItemTypesForConnectionType: new Map<Guid, ItemType[]>(),
    }
};

export function MetaDataReducer(state = initialState, action: MetaDataActions.MetaDataActions) {
    switch (action.type) {
        case MetaDataActions.SET_CURRENT_ITEMTYPE:
            let connectionRulesToLower: ConnectionRule[] = [];
            let connectionRulesToUpper: ConnectionRule[] = [];
            let connectionTypesToUpper: ConnectionType[] = [];
            let connectionTypesToLower: ConnectionType[] = [];
            const lowerItemTypesForConnectionType = new Map<Guid, ItemType[]>();
            const upperItemTypesForConnectionType = new Map<Guid, ItemType[]>();
            if (action.payload) {
                connectionRulesToLower = state.connectionRules.filter((value) =>
                    value.ItemUpperType === action.payload.TypeId);
                connectionRulesToUpper = state.connectionRules.filter((value) =>
                    value.ItemLowerType === action.payload.TypeId);
                connectionTypesToLower = state.connectionTypes.filter((value) =>
                    connectionRulesToLower.findIndex((val) => val.ConnType === value.ConnTypeId) > -1
                );
                connectionTypesToUpper = state.connectionTypes.filter((value) =>
                    connectionRulesToUpper.findIndex((val) => val.ConnType === value.ConnTypeId) > -1
                );
                connectionTypesToLower.forEach((connType) => {
                    upperItemTypesForConnectionType.set(connType.ConnTypeId, state.itemTypes.filter(itemtype =>
                        connectionRulesToLower.filter(rule =>
                            rule.ConnType === connType.ConnTypeId).map(rule =>
                            rule.ItemLowerType).findIndex(val => val === itemtype.TypeId) > -1));
                });
                connectionTypesToUpper.forEach((connType) => {
                    lowerItemTypesForConnectionType.set(connType.ConnTypeId, state.itemTypes.filter(itemtype =>
                        connectionRulesToUpper.filter(rule =>
                            rule.ConnType === connType.ConnTypeId).map(rule =>
                            rule.ItemUpperType).findIndex(val => val === itemtype.TypeId) > -1));
                });
            }
            return {
                ...state,
                currentItemType: {
                    ...state.currentItemType,
                    itemType: action.payload,
                    connectionRulesToLower,
                    connectionRulesToUpper,
                    connectionTypesToUpper,
                    connectionTypesToLower,
                    lowerItemTypesForConnectionType,
                    upperItemTypesForConnectionType,
                }
            };
        case MetaDataActions.ERROR:
            return {
                ...state,
                error: action.payload,
                validData: false,
            };
        case MetaDataActions.SET_STATE:
            return {
                ...state,
                ...action.payload,
                error: null,
                validData: true,
            };
        default:
           return state;
    }
}
