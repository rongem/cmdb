import { Guid } from 'guid-typescript';

import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../meta-data.service';
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
    attributeGroupsMap: Map<Guid, AttributeGroup>;
    attributeTypes: AttributeType[];
    attributeTypesMap: Map<Guid, AttributeType>;
    itemTypeAttributeGroupMappings: ItemTypeAttributeGroupMapping[];
    connectionRules: ConnectionRule[];
    connectionRulesMap: Map<Guid, ConnectionRule>;
    connectionTypes: ConnectionType[];
    connectionTypesMap: Map<Guid, ConnectionType>;
    itemTypes: ItemType[];
    itemTypesMap: Map<Guid, ItemType>;
    currentItemType: {
        itemType: ItemType;
        attributeTypes: AttributeType[];
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
    attributeGroupsMap: new Map<Guid, AttributeGroup>(),
    attributeTypes: [],
    attributeTypesMap: new Map<Guid, AttributeType>(),
    itemTypeAttributeGroupMappings: [],
    connectionRules: [],
    connectionRulesMap: new Map<Guid, ConnectionRule>(),
    connectionTypes: [],
    connectionTypesMap: new Map<Guid, ConnectionType>(),
    itemTypes: [],
    itemTypesMap: new Map<Guid, ItemType>(),
    currentItemType: {
        itemType: null,
        attributeTypes: [],
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
            let attributeTypes: AttributeType[] = [];
            let connectionRulesToLower: ConnectionRule[] = [];
            let connectionRulesToUpper: ConnectionRule[] = [];
            let connectionTypesToUpper: ConnectionType[] = [];
            let connectionTypesToLower: ConnectionType[] = [];
            const lowerItemTypesForConnectionType = new Map<Guid, ItemType[]>();
            const upperItemTypesForConnectionType = new Map<Guid, ItemType[]>();
            if (action.payload) {
                const attributeGroupsForItemType = state.itemTypeAttributeGroupMappings.filter(iagm =>
                    iagm.ItemTypeId === action.payload.TypeId).map(val => val.GroupId);
                attributeTypes = state.attributeTypes.filter(at =>
                    attributeGroupsForItemType.findIndex(id => id === at.AttributeGroup) > -1);
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
            } else {
                attributeTypes = [...state.attributeTypes];
            }
            return {
                ...state,
                currentItemType: {
                    ...state.currentItemType,
                    itemType: action.payload,
                    attributeTypes,
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
            const attributeGroupsMap = new Map<Guid, AttributeGroup>();
            action.payload.attributeGroups.forEach(a => attributeGroupsMap.set(a.GroupId, a));
            const attributeTypesMap = new Map<Guid, AttributeType>();
            action.payload.attributeTypes.forEach(a => attributeTypesMap.set(a.TypeId, a));
            const connectionRulesMap = new Map<Guid, ConnectionRule>();
            action.payload.connectionRules.forEach(r => connectionRulesMap.set(r.RuleId, r));
            const connectionTypesMap = new Map<Guid, ConnectionType>();
            action.payload.connectionTypes.forEach(t => connectionTypesMap.set(t.ConnTypeId, t));
            const itemTypesMap = new Map<Guid, ItemType>();
            action.payload.itemTypes.forEach(t => itemTypesMap.set(t.TypeId, t));
            return {
                ...state,
                ...action.payload,
                error: null,
                attributeGroupsMap,
                attributeTypesMap,
                connectionRulesMap,
                connectionTypesMap,
                itemTypesMap,
                validData: true,
            };
        default:
           return state;
    }
}
