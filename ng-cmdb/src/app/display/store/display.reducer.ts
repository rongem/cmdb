import { Action, createReducer, on } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

import * as DisplayActions from './display.actions';
import * as SearchActions from './search.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { SearchAttribute } from '../search/search-attribute.model';
import { SearchConnection } from '../search/search-connection.model';
import { SearchContent } from '../search/search-content.model';

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
    form: SearchContent;
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
        form: new SearchContent(),
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
        on(SearchActions.searchChangeMetaData, (state, action) => {
            const types = action.attributeTypes.map(at => at.TypeId);
            return {
                ...state,
                search: {
                    ...state.search,
                    form: {
                        ...state.search.form,
                        Attributes: state.search.form.Attributes.filter(a => types.indexOf(a.attributeTypeId) > -1),
                    }
                }
            };
        }),
        on(SearchActions.addNameOrValue, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    NameOrValue: action.text,
                }
            }
        })),
        on(SearchActions.addItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    ItemType: action.itemTypeId,
                }
            }
        })),
        on(SearchActions.deleteItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    ItemType: undefined,
                    ConnectionsToLower: [],
                    ConnectionsToUpper: [],
                }
            }
        })),
        on(SearchActions.addAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    Attributes: [...state.search.form.Attributes, { attributeTypeId: action.attributeTypeId, attributeValue: ''}]
                }
            }
        })),
        on(SearchActions.changeAttributeValue, (state, action) => {
            let Attributes: SearchAttribute[];
            if (state.search.form.Attributes.findIndex(a => a.attributeTypeId === action.attributeTypeId) > -1) {
                Attributes = [...state.search.form.Attributes];
                Attributes.find(a => a.attributeTypeId === action.attributeTypeId).attributeValue = action.attributeValue;
            } else {
                Attributes = [...state.search.form.Attributes,
                    {attributeTypeId: action.attributeTypeId, attributeValue: action.attributeValue}];
            }
            return {
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    Attributes,
                }
            }
        };}),
        on(SearchActions.deleteAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    Attributes: state.search.form.Attributes.filter(a => a.attributeTypeId !== action.attributeTypeId ),
                }
            }
        })),
        on(SearchActions.addConnectionTypeToLower, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    ConnectionsToLower: [...state.search.form.ConnectionsToLower, {
                        ConnectionType: action.connectionTypeId, ItemType: action.itemTypeId
                    }]
                }
            }
        })),
        on(SearchActions.addConnectionTypeToUpper, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    ConnectionsToUpper: [...state.search.form.ConnectionsToUpper, {
                        ConnectionType: action.connectionTypeId, ItemType: action.itemTypeId
                    }]
                }
            }
        })),
        on(SearchActions.performSearch, (state, action) => ({
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
        on(SearchActions.performSearchFull, (state, action) => ({
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
                form: {
                    ...state.search.form,
                    ItemType: action.itemType,
                }
            },
            result: {
                ...state.result,
                resultList: state.result.resultList.filter(r => r.ItemType === action.itemType.TypeId),
                resultListFull: state.result.resultListFull.filter(r => r.typeId === action.itemType.TypeId),
            }
        })),
    )(displayState, displayAction);
}



