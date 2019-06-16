import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../meta-data.service';
import { AttributeGroup } from '../objects/attribute-group.model';
import { AttributeType } from '../objects/attribute-type.model';
import { ConnectionRule } from '../objects/connection-rule.model';
import { ConnectionType } from '../objects/connection-type.model';
import { ItemType } from '../objects/item-type.model';
import { Guid } from 'guid-typescript';

export interface MetaState {
    initializationFinished: boolean;
    userName: string;
    userRole: UserRole;
    attributeGroups: AttributeGroup[];
    attributeGroupsMap: Map<Guid, AttributeGroup>;
    attributeTypes: AttributeType[];
    attributeTypesMap: Map<Guid, AttributeType>;
    connectionRules: ConnectionRule[];
    connectionRulesMap: Map<Guid, ConnectionRule>;
    connectionTypes: ConnectionType[];
    connectionTypesMap: Map<Guid, ConnectionType>;
    itemTypes: ItemType[];
    itemTypesMap: Map<Guid, ItemType>;
}

const initialState: MetaState = {
    initializationFinished: false,
    userName: null,
    userRole: 0,
    attributeGroups: [],
    attributeGroupsMap: new Map<Guid, AttributeGroup>(),
    attributeTypes: [],
    attributeTypesMap: new Map<Guid, AttributeType>(),
    connectionRules: [],
    connectionRulesMap: new Map<Guid, ConnectionRule>(),
    connectionTypes: [],
    connectionTypesMap: new Map<Guid, ConnectionType>(),
    itemTypes: [],
    itemTypesMap: new Map<Guid, ItemType>(),
};

export function MetaDataReducer(state = initialState, action: MetaDataActions.MetaDataActions) {
    switch (action.type) {
        case MetaDataActions.INITIALIZATION_FINISHED:
            return {
                ...state,
                initializationFinished: action.payload,
            };
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
                attributeTypes: state.attributeTypes.filter((o, index) => {
                    return index !== action.payload;
                }),
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
        case MetaDataActions.SET_STATE:
            action.payload.attributeGroupsMap = new Map<Guid, AttributeGroup>();
            action.payload.attributeGroups.forEach(a => action.payload.attributeGroupsMap.set(a.GroupId, a));
            action.payload.attributeTypesMap = new Map<Guid, AttributeType>();
            action.payload.attributeTypes.forEach(a => action.payload.attributeTypesMap.set(a.TypeId, a));
            action.payload.connectionRulesMap = new Map<Guid, ConnectionRule>();
            action.payload.connectionRules.forEach(r => action.payload.connectionRulesMap.set(r.RuleId, r));
            action.payload.connectionTypesMap = new Map<Guid, ConnectionType>();
            action.payload.connectionTypes.forEach(t => action.payload.connectionTypesMap.set(t.ConnTypeId, t));
            action.payload.itemTypesMap = new Map<Guid, ItemType>();
            action.payload.itemTypes.forEach(t => action.payload.itemTypesMap.set(t.TypeId, t));
            return {
                ...state,
                ...action.payload,
            };
        default:
           return state;
    }
}
