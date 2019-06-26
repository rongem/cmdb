import { Guid } from 'guid-typescript';

import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../meta-data.service';
import { AttributeGroup } from '../objects/attribute-group.model';
import { AttributeType } from '../objects/attribute-type.model';
import { ConnectionRule } from '../objects/connection-rule.model';
import { ConnectionType } from '../objects/connection-type.model';
import { ItemType } from '../objects/item-type.model';
import { GroupAttributeTypeMapping } from '../objects/group-attribute-type-mapping.model';
import { ItemTypeAttributeGroupMapping } from '../objects/item-type-attribute-group-mapping.model';

export interface MetaState {
    validData: boolean;
    error: any;
    userName: string;
    userRole: UserRole;
    attributeGroups: AttributeGroup[];
    attributeGroupsMap: Map<Guid, AttributeGroup>;
    attributeTypes: AttributeType[];
    attributeTypesMap: Map<Guid, AttributeType>;
    groupAttributeTypeMappings: GroupAttributeTypeMapping[];
    attributeTypesGroupMap: Map<Guid, Guid>;
    itemTypeAttributeGroupMappings: ItemTypeAttributeGroupMapping[];
    connectionRules: ConnectionRule[];
    connectionRulesMap: Map<Guid, ConnectionRule>;
    connectionTypes: ConnectionType[];
    connectionTypesMap: Map<Guid, ConnectionType>;
    itemTypes: ItemType[];
    itemTypesMap: Map<Guid, ItemType>;
}

const initialState: MetaState = {
    validData: false,
    error: null,
    userName: null,
    userRole: 0,
    attributeGroups: [],
    attributeGroupsMap: new Map<Guid, AttributeGroup>(),
    attributeTypes: [],
    attributeTypesMap: new Map<Guid, AttributeType>(),
    groupAttributeTypeMappings: [],
    attributeTypesGroupMap: new Map<Guid, Guid>(),
    itemTypeAttributeGroupMappings: [],
    connectionRules: [],
    connectionRulesMap: new Map<Guid, ConnectionRule>(),
    connectionTypes: [],
    connectionTypesMap: new Map<Guid, ConnectionType>(),
    itemTypes: [],
    itemTypesMap: new Map<Guid, ItemType>(),
};

export function MetaDataReducer(state = initialState, action: MetaDataActions.MetaDataActions) {
    switch (action.type) {
        case MetaDataActions.ADD_ATTRIBUTEGROUP:
            state.attributeGroupsMap.set(action.payload.GroupId, action.payload);
            return {
                ...state,
                attributeGroups: [...state.attributeGroups, action.payload],
            };
        case MetaDataActions.UPDATE_ATTRIBUTEGROUP:
            state.attributeGroupsMap.delete(action.payload.attributeGroup.GroupId);
            state.attributeGroupsMap.set(action.payload.attributeGroup.GroupId, action.payload.attributeGroup);
            const attributeGroup = state.attributeGroups[action.payload.index];
            const updatedAttributeGroup = {
                ...attributeGroup,
                ...action.payload.attributeGroup,
            };
            const updatedAttributeGroups = [...state.attributeGroups];
            updatedAttributeGroups[action.payload.index] = updatedAttributeGroup;
            return {
                ...state,
                attributeGroups: updatedAttributeGroups,
            };
        case MetaDataActions.DELETE_ATTRIBUTEGROUP:
            state.attributeGroupsMap.delete(state.attributeGroups[action.payload].GroupId);
            return {
                ...state,
                attributeGroups: state.attributeGroups.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.ADD_ATTRIBUTETYPE:
            state.attributeTypesMap.set(action.payload.TypeId, action.payload);
            return {
                ...state,
                attributeTypes: [...state.attributeTypes, action.payload],
            };
        case MetaDataActions.UPDATE_ATTRIBUTETYPE:
            state.attributeTypesMap.delete(action.payload.attributeType.TypeId);
            state.attributeTypesMap.set(action.payload.attributeType.TypeId, action.payload.attributeType);
            const attributeType = state.attributeTypes[action.payload.index];
            const updatedAttributeType = {
                ...attributeType,
                ...action.payload.attributeType,
            };
            const updatedAttributeTypes = [...state.attributeTypes];
            updatedAttributeTypes[action.payload.index] = updatedAttributeType;
            return {
                ...state,
                attributeTypes: updatedAttributeTypes,
            };
        case MetaDataActions.DELETE_ATTRIBUTETYPE:
            state.attributeTypesMap.delete(state.attributeTypes[action.payload].TypeId);
            return {
                ...state,
                attributeTypes: [...state.attributeTypes.filter((o, index) => {
                    return index !== action.payload;
                }),]
            };
        case MetaDataActions.ADD_GROUPATTRIBUTETYPEMAPPING:
            state.attributeTypesGroupMap.set(action.payload.AttributeTypeId, action.payload.GroupId);
            return {
                ...state,
                groupAttributeTypeMappings: [...state.groupAttributeTypeMappings, action.payload],
            };
        case MetaDataActions.DELETE_GROUPATTRIBUTETYPEMAPPING:
            state.attributeTypesGroupMap.delete(action.payload.AttributeTypeId);
            return {
                ...state,
                groupAttributeTypeMappings: [...state.groupAttributeTypeMappings.filter((o, index) => {
                    return o.AttributeTypeId !== action.payload.AttributeTypeId;
                }),]
            };
        case MetaDataActions.ADD_CONNECTIONRULE:
            state.connectionRulesMap.set(action.payload.RuleId, action.payload);
            return {
                ...state,
                connectionRules: [...state.connectionRules, action.payload],
            };
        case MetaDataActions.UPDATE_CONNECTIONRULE:
            state.connectionRulesMap.delete(action.payload.connectionRule.RuleId);
            state.connectionRulesMap.set(action.payload.connectionRule.RuleId, action.payload.connectionRule);
            const connectionRule = state.connectionRules[action.payload.index];
            const updatedConnectionRule = {
                ...connectionRule,
                ...action.payload.connectionRule,
            };
            const updatedConnectionRules = [...state.connectionRules];
            updatedConnectionRules[action.payload.index] = updatedConnectionRule;
            return {
                ...state,
                connectionRules: updatedConnectionRules,
            };
        case MetaDataActions.DELETE_CONNECTIONRULE:
            state.connectionRulesMap.delete(state.connectionRules[action.payload].RuleId);
            return {
                ...state,
                connectionRules: state.connectionRules.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.ADD_CONNECTIONTYPE:
            state.connectionTypesMap.set(action.payload.ConnTypeId, action.payload);
            return {
                ...state,
                connectionTypes: [...state.connectionTypes, action.payload],
            };
        case MetaDataActions.UPDATE_CONNECTIONTYPE:
            state.connectionTypesMap.delete(action.payload.connectionType.ConnTypeId);
            state.connectionTypesMap.set(action.payload.connectionType.ConnTypeId, action.payload.connectionType);
            const connectionType = state.connectionTypes[action.payload.index];
            const updatedConnectionType = {
                ...connectionType,
                ...action.payload.connectionType,
            };
            const updatedConnectionTypes = [...state.connectionTypes];
            updatedConnectionTypes[action.payload.index] = updatedConnectionType;
            return {
                ...state,
                connectionTypes: updatedConnectionTypes,
            };
        case MetaDataActions.DELETE_CONNECTIONTYPE:
            state.connectionTypesMap.delete(state.connectionTypes[action.payload].ConnTypeId);
            return {
                ...state,
                connectionTypes: state.connectionTypes.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.ADD_ITEMTYPE:
            state.itemTypesMap.set(action.payload.TypeId, action.payload);
            return {
                ...state,
                itemTypes: [...state.itemTypes, action.payload],
            };
        case MetaDataActions.UPDATE_ITEMTYPE:
            state.itemTypesMap.delete(action.payload.itemType.TypeId);
            state.itemTypesMap.set(action.payload.itemType.TypeId, action.payload.itemType);
            const itemType = state.itemTypes[action.payload.index];
            const updatedItemType = {
                ...itemType,
                ...action.payload.itemType,
            };
            const updateditemTypes = [...state.itemTypes];
            updateditemTypes[action.payload.index] = updatedItemType;
            return {
                ...state,
                itemTypes: updateditemTypes,
            };
        case MetaDataActions.DELETE_ITEMTYPE:
            state.itemTypesMap.delete(state.itemTypes[action.payload].TypeId);
            return {
                ...state,
                itemTypes: state.itemTypes.filter((o, index) => {
                    return index !== action.payload;
                }),
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
            const attributeTypesGroupMap = new Map<Guid, Guid>();
            action.payload.groupAttributeTypeMappings.forEach(m => attributeTypesGroupMap.set(m.AttributeTypeId, m.GroupId));
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
                attributeTypesGroupMap,
                connectionRulesMap,
                connectionTypesMap,
                itemTypesMap,
                validData: true,
            };
        default:
           return state;
    }
}
