import { Action, createReducer, on } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as DisplayActions from './display.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { SearchAttribute } from '../search/search-attribute.model';
import { SearchConnection } from '../search/search-connection.model';

export enum VisibleComponent {
    None = 0,
    SearchPanel = 1,
    ResultPanel = 2,
}

export interface ConfigurationItemState {
    fullConfigurationItem: FullConfigurationItem;
    loadingItem: boolean;
    itemReady: boolean;
    hasError: boolean;
}

export interface SearchState {
    nameOrValue: string;
    itemType: Guid;
    attributes: SearchAttribute[];
    connectionsToLower: SearchConnection[];
    connectionsToUpper: SearchConnection[];
    responsibleToken: string;
    usedAttributeTypes: Guid[];
    usedConnectionTypesToUpper: Guid[];
    usedConnectionTypesToLower: Guid[];
    usedConnectionRulesToUpper: Guid[];
    usedConnectionRulesToLower: Guid[];
    searching: boolean;
    noSearchResult: boolean;
}

export interface ResultState {
    resultList: ConfigurationItem[];
    resultListFull: FullConfigurationItem[];
    resultListPresent: boolean;
    resultListFullPresent: boolean;
    resultListFullLoading: boolean;
}

export interface State {
    configurationItem: ConfigurationItemState;
    search: SearchState;
    result: ResultState;
    visibleComponent: VisibleComponent;
}

const initialState: State = {
    configurationItem: {
        fullConfigurationItem: undefined,
        loadingItem: false,
        itemReady: false,
        hasError: false,
    },
    search: {
        nameOrValue: '',
        itemType: undefined,
        attributes: [],
        connectionsToUpper: [],
        connectionsToLower: [],
        responsibleToken: '',
        usedAttributeTypes: [],
        usedConnectionTypesToUpper: [],
        usedConnectionTypesToLower: [],
        usedConnectionRulesToUpper: [],
        usedConnectionRulesToLower: [],
        searching: false,
        noSearchResult: false,
    },
    result: {
        resultList: [],
        resultListFull: [],
        resultListPresent: false,
        resultListFullPresent: false,
        resultListFullLoading: false,
    },
    visibleComponent: VisibleComponent.None,
};

export function DisplayReducer(displayState: State | undefined, displayAction: Action): State {
    return createReducer(
        initialState,
        on(DisplayActions.setVisibilityState, (state, action) => ({
            ...state,
            visibleComponent: action.visibilityState === state.visibleComponent ? VisibleComponent.None : action.visibilityState,
        })),
        on(DisplayActions.setConfigurationItem, (state, action) => ({
                ...state,
                configurationItem: {
                    ...state.configurationItem,
                    fullConfigurationItem: {...action.configurationItem},
                    itemReady: true,
                    hasError: false,
                },
        })),
        on(DisplayActions.clearConfigurationItem, (state, action) => ({
            ...state,
            configurationItem: {
                ...state.configurationItem,
                fullConfigurationItem: undefined,
                loadingItem: false,
                itemReady: false,
                hasError: !action.result.Success,
            }
        })),
        // clear item before reading
        on(DisplayActions.readConfigurationItem, (state, action) => ({
            ...state,
            configurationItem: {
                ...state.configurationItem,
                fullConfigurationItem: undefined,
                loadingItem: true,
                itemReady: false,
                hasError: false,
            }
        })),
        on(DisplayActions.searchChangeMetaData, (state, action) => {
            const types = action.attributeTypes.map(at => at.TypeId);
            return {
                ...state,
                search: {
                    ...state.search,
                    attributes: state.search.attributes.filter(a => types.indexOf(a.attributeTypeId) > -1),
                }
            };
        }),
        on(DisplayActions.searchAddNameOrValue, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                nameOrValue: action.text,
            }
        })),
        on(DisplayActions.searchAddItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                itemType: action.itemTypeId,
            }
        })),
        on(DisplayActions.searchDeleteItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                itemType: undefined,
                usedConnectionRulesToUpper: [],
                usedConnectionRulesToLower: [],
                usedConnectionTypesToUpper: [],
                usedConnectionTypesToLower: [],
            }
        })),
        on(DisplayActions.searchAddAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedAttributeTypes: [...state.search.usedAttributeTypes, action.attributeTypeId],
            }
        })),
        on(DisplayActions.searchDeleteAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedAttributeTypes: state.search.usedAttributeTypes.filter(a => a !== action.attributeTypeId),
            }
        })),
        on(DisplayActions.searchAddConnectionTypeToLower, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedConnectionTypesToLower: [...state.search.usedConnectionTypesToLower, action.connectionTypeId],
            }
        })),
        on(DisplayActions.searchAddConnectionTypeToUpper, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedConnectionTypesToUpper: [...state.search.usedConnectionTypesToUpper, action.connectionTypeId],
            }
        })),
        on(DisplayActions.performSearch, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                searching: true,
            }
        })),
        on(DisplayActions.setResultList, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                searching: false,
                noSearchResult: !action.configurationItems || action.configurationItems.length === 0,
            },
            result: {
                ...state.result,
                resultList: [...action.configurationItems],
                resultListPresent: action.configurationItems && action.configurationItems.length > 0,
            },
            visibleComponent: state.visibleComponent === VisibleComponent.SearchPanel && action.configurationItems &&
                action.configurationItems.length > 0 ? VisibleComponent.ResultPanel : state.visibleComponent,
        })),
        on(DisplayActions.setResultListFull, (state, action) => ({
            ...state,
            result: {
                ...state.result,
                resultListFull: [...action.configurationItems],
                resultListFullPresent: action.configurationItems && action.configurationItems.length > 0,
                resultListFullLoading: false,
            }
        })),
        on(DisplayActions.deleteResultList, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                searching: false,
                noSearchResult: false,
            },
            result: {
                ...state.result,
                resultList: [],
                resultListFull: [],
                resultListFullPresent: false,
                resultListFullLoading: false,
                resultListPresent: false,
            }
        })),
        on(DisplayActions.fillResultListFullAfterSearch, (state, action) => ({
            ...state,
            result: {
                ...state.result,
                resultListFull: [],
                resultListFullPresent: false,
                resultListFullLoading: true,
            }
        })),
        on(DisplayActions.filterResultsByItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                itemType: action.itemType,
            },
            result: {
                ...state.result,
                resultList: state.result.resultList.filter(r => r.ItemType === action.itemType.TypeId),
                resultListFull: state.result.resultListFull.filter(r => r.typeId === action.itemType.TypeId),
            }
        })),
    )(displayState, displayAction);
}



