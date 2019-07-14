import * as SearchActions from './search.actions';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';

export interface State {
    itemType: ItemType;
    attributes: ItemAttribute[];
    attributeTypes: AttributeType[];
    connectionTypesToUpper: ConnectionType[];
    connectionTypesToLower: ConnectionType[];
    connectionRulesToUpper: ConnectionRule[];
    connectionRulesToLower: ConnectionRule[];
    resultList: ConfigurationItem[];
    resultListPresent: boolean;
    resultListToforeground: boolean;
    searchPanelVisibility: boolean;
}

const initialState: State = {
    itemType: undefined,
    attributes: [],
    attributeTypes: [],
    connectionTypesToUpper: [],
    connectionTypesToLower: [],
    connectionRulesToUpper: [],
    connectionRulesToLower: [],
    resultList: [],
    resultListPresent: false,
    resultListToforeground: false,
    searchPanelVisibility: false,
};

export function SearchReducer(state = initialState, action: SearchActions.SearchActions) {
    switch (action.type) {
        case SearchActions.ADD_ITEM_TYPE:
            return {
                ...state,
                itemType: {...action.payload},
            };
        case SearchActions.DELETE_ITEM_TYPE:
            return {
                ...state,
                itemType: null,
            };
        case SearchActions.ADD_ATTRIBUTE_TYPE:
            return {
                ...state,
                attributeTypes: [...state.attributeTypes, {...action.payload}],
            };
        case SearchActions.DELETE_ATTRIBUTE_TYPE:
            return {
                ...state,
                attributeTypes: [...state.attributeTypes.filter(a => a.TypeId !== action.payload.TypeId)],
            };
        case SearchActions.ADD_CONNECTION_TYPE_TO_LOWER:
            return {
                ...state,
                connectionTypesToLower: [...state.connectionTypesToLower, {...action.payload}],
            };
        case SearchActions.ADD_CONNECTION_TYPE_TO_UPPER:
            return {
                ...state,
                connectionTypesToUpper: [...state.connectionTypesToUpper, {...action.payload}],
            };
        case SearchActions.SET_RESULT_LIST:
            const resultListPresent = (action.payload && action.payload.length > 0);
            return {
                ...state,
                resultList: [...action.payload],
                resultListPresent,
                resultListToforeground: resultListPresent,
            };
        case SearchActions.DELETE_RESULT_LIST:
            return {
                ...state,
                resultList: [],
                resultListPresent: false,
            };
        case SearchActions.SET_VISIBILITY:
            return {
                ...state,
                searchPanelVisibility: action.payload,
            };
        case SearchActions.TOGGLE_VISIBILITY:
            let visibility = state.searchPanelVisibility;
            if (state.searchPanelVisibility === false || state.resultListToforeground === action.payload) {
                visibility = !visibility;
            }
            return {
                ...state,
                resultListToforeground: action.payload,
                searchPanelVisibility: visibility,
            };
        default:
            return state;
    }
}
