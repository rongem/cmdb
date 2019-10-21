import { Action, createReducer, on } from '@ngrx/store';

import * as DisplayActions from './display.actions';
import * as SearchActions from './search.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { SearchAttribute } from '../search/search-attribute.model';
import { SearchContent } from '../search/search-content.model';
import { SearchConnection } from '../search/search-connection.model';
import { NeighborSearch } from '../search/neighbor-search.model';
import { NeighborItem } from '../search/neighbor-item.model';

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

export interface NeighborSearchState {
    form: NeighborSearch;
    searching: boolean;
    noSearchResult: boolean;
    resultList: NeighborItem[];
    resultListPresent: boolean;
    resultListFullPresent: boolean;
    resultListFullLoading: boolean;
}

export interface State {
    configurationItem: ConfigurationItemState;
    search: SearchState;
    result: ResultState;
    neighborSearch: NeighborSearchState;
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
        form: {
            NameOrValue: '',
            ItemType: undefined,
            Attributes: [],
            ConnectionsToUpper: [],
            ConnectionsToLower: [],
            ResponsibleToken: '',
        },
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
    neighborSearch: {
        form: {
            ItemType: undefined,
            SourceItem: undefined,
            SearchDirection: undefined,
            MaxLevels: 0,
            ExtraSearch: {
                NameOrValue: '',
                ItemType: undefined,
                Attributes: [],
                ConnectionsToUpper: [],
                ConnectionsToLower: [],
                ResponsibleToken: '',
            },
        },
        searching: false,
        noSearchResult: false,
        resultList: [],
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
            };
        }),
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
                        ConnectionType: action.connectionTypeId,
                        ConfigurationItemType: action.itemTypeId,
                        Count: '1',
                    }],
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
                        ConnectionType: action.connectionTypeId,
                        ConfigurationItemType: action.itemTypeId,
                        Count: '1',
                    }],
                }
            }
        })),
        on(SearchActions.changeConnectionCountToLower, (state, action) => {
            const ConnectionsToLower: SearchConnection[] = [...state.search.form.ConnectionsToLower];
            ConnectionsToLower[action.index].Count = action.count;
            return {
                ...state,
                search: {
                    ...state.search,
                    form: {
                        ...state.search.form,
                        ConnectionsToLower,
                    }
                }
            };
        }),
        on(SearchActions.changeConnectionCountToUpper, (state, action) => {
            const ConnectionsToUpper: SearchConnection[] = [...state.search.form.ConnectionsToUpper];
            ConnectionsToUpper[action.index].Count = action.count;
            return {
                ...state,
                search: {
                    ...state.search,
                    form: {
                        ...state.search.form,
                        ConnectionsToUpper,
                    }
                }
            };
        }),
        on(SearchActions.deleteConnectionTypeToUpper, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    ConnectionsToUpper: state.search.form.ConnectionsToUpper.filter((value, index) => index !== action.index),
                }
            }
        })),
        on(SearchActions.deleteConnectionTypeToLower, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    ConnectionsToLower: state.search.form.ConnectionsToLower.filter((value, index) => index !== action.index),
                }
            }
        })),
        on(SearchActions.setResponsibility, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    ResponsibleToken: action.token,
                }
            }
        })),
        on(SearchActions.resetForm, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...initialState.search.form,
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
        on(SearchActions.performNeighborSearch, (state, action) => ({
            ...state,
            neighborSearch: {
                ...state.neighborSearch,
                searching: true,
                noSearchResult: false,
                resultList: [],
                resultListPresent: false,
                resultListFullLoading: false,
                resultListFullPresent: false,
                form: {
                    ...action.searchContent,
                }
            }
        })),
        on(SearchActions.setNeighborSearchResultList, (state, action) => ({
            ...state,
            neighborSearch: {
                ...state.neighborSearch,
                searching: false,
                noSearchResult: !action.resultList || action.resultList.length === 0,
                resultList: [...action.resultList],
                resultListPresent: !action.resultList || action.resultList.length === 0,
                resultListFullLoading: !action.fullItemsIncluded,
                resultListFullPresent: !!action.resultList && action.resultList.length > 0 && action.fullItemsIncluded,
            }
        })),
    )(displayState, displayAction);
}



