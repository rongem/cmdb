import * as MetaDataActions from './meta-data.actions';
import { UserRole } from '../meta-data.service';
import { AttributeGroup } from '../objects/attribute-group.model';
import { AttributeType } from '../objects/attribute-type.model';
import { ConnectionRule } from '../objects/connection-rule.model';
import { ConnectionType } from '../objects/connection-type.model';
import { ItemType } from '../objects/item-type.model';

export interface MetaState {
    initializationFinished: boolean;
    userName: string;
    userRole: UserRole;
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
}

const initialState: MetaState = {
    initializationFinished: false,
    userName: null,
    userRole: 0,
    attributeGroups: [],
    attributeTypes: [],
    connectionRules: [],
    connectionTypes: [],
    itemTypes: []
};

export function metaDataReducer(state = initialState, action: MetaDataActions.MetaDataActions) {
    switch (action.type) {
        case MetaDataActions.INITIALIZATION_FINISHED:
            return {
                ...state,
                initializationFinished: action.payload,
            };
        case MetaDataActions.ADD_ATTRIBUTEGROUP:
            return {
                ...state,
                attributeGroups: [...state.attributeGroups, action.payload],
            };
        case MetaDataActions.UPDATE_ATTRIBUTEGROUP:
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
            return {
                ...state,
                attributeGroups: state.attributeGroups.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.ADD_ATTRIBUTETYPE:
            return {
                ...state,
                attributeTypes: [...state.attributeTypes, action.payload],
            };
        case MetaDataActions.UPDATE_ATTRIBUTETYPE:
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
            return {
                ...state,
                attributeTypes: state.attributeTypes.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.ADD_CONNECTIONRULE:
            return {
                ...state,
                connectionRules: [...state.connectionRules, action.payload],
            };
        case MetaDataActions.UPDATE_CONNECTIONRULE:
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
            return {
                ...state,
                connectionRules: state.connectionRules.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.ADD_CONNECTIONTYPE:
            return {
                ...state,
                connectionTypes: [...state.connectionTypes, action.payload],
            };
        case MetaDataActions.UPDATE_CONNECTIONTYPE:
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
            return {
                ...state,
                connectionTypes: state.connectionTypes.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.ADD_ITEMTYPE:
            return {
                ...state,
                itemTypes: [...state.itemTypes, action.payload],
            };
        case MetaDataActions.UPDATE_ITEMTYPE:
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
            return {
                ...state,
                itemTypes: state.itemTypes.filter((o, index) => {
                    return index !== action.payload;
                }),
            };
        case MetaDataActions.SET_STATE:
            return {
                ...state,
                ...action.payload,
            };
        default:
           return state;
    }
}
