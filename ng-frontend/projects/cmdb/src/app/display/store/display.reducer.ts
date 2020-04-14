import { Action, createReducer, on } from '@ngrx/store';
import { FullConfigurationItem, ConfigurationItem,
    SearchAttribute, SearchContent, SearchConnection, NeighborSearch, NeighborItem,
    ReadActions, MultiEditActions, SearchActions, EditActions } from 'backend-access';

import * as DisplayActions from './display.actions';
import * as SearchFormActions from './search-form.actions';
import * as DataExchangeActions from './data-exchange.actions';

import { GraphItem } from '../objects/graph-item.model';

export enum VisibleComponent {
    None = 0,
    SearchPanel = 1,
    ResultPanel = 2,
}

export interface ConfigurationItemState {
    fullConfigurationItem: FullConfigurationItem;
    graphItems: GraphItem[];
    processedItems: string[];
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

export interface MultiEditState {
    selectedIds: string[];
    selectedItems: FullConfigurationItem[];
}

export interface ImportState {
    itemTypeId: string;
    elements: string[];
}

export interface State {
    configurationItem: ConfigurationItemState;
    search: SearchState;
    result: ResultState;
    neighborSearch: NeighborSearchState;
    multiEdit: MultiEditState;
    import: ImportState;
    visibleComponent: VisibleComponent;
}

const initialState: State = {
    configurationItem: {
        fullConfigurationItem: undefined,
        graphItems: [],
        processedItems: [],
        loadingItem: false,
        itemReady: false,
        hasError: false,
    },
    search: {
        form: {
            nameOrValue: '',
            itemTypeId: '',
            attributes: [],
            connectionsToUpper: [],
            connectionsToLower: [],
            responsibleToken: '',
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
            itemTypeId: '',
            sourceItem: '',
            searchDirection: undefined,
            maxLevels: 0,
            extraSearch: {
                nameOrValue: '',
                itemTypeId: '',
                attributes: [],
                connectionsToUpper: [],
                connectionsToLower: [],
                responsibleToken: '',
            },
        },
        searching: false,
        noSearchResult: false,
        resultList: [],
        resultListPresent: false,
        resultListFullPresent: false,
        resultListFullLoading: false,
    },
    multiEdit: {
        selectedIds: [],
        selectedItems: [],
    },
    import: {
        itemTypeId: undefined,
        elements: [],
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
        on(ReadActions.setConfigurationItem, (state, action) => ({
            ...state,
            configurationItem: {
                ...state.configurationItem,
                fullConfigurationItem: {...action.configurationItem},
                graphItems: [new GraphItem(action.configurationItem, 0)],
                processedItems: [action.configurationItem.id],
                itemReady: true,
                hasError: false,
            },
        })),
        on(ReadActions.clearConfigurationItem, (state, action) => ({
            ...state,
            configurationItem: {
                ...state.configurationItem,
                fullConfigurationItem: undefined,
                graphItems: [],
                processedItems: [],
                loadingItem: false,
                itemReady: false,
                hasError: !action.result.success,
            }
        })),
        // clear item before reading
        on(ReadActions.readConfigurationItem, (state, action) => ({
            ...state,
            configurationItem: {
                ...state.configurationItem,
                fullConfigurationItem: undefined,
                graphItems: [],
                processedItems: [],
                loadingItem: true,
                itemReady: false,
                hasError: false,
            },
        })),
        on(DisplayActions.addProcessedItemId, (state, action) => ({
            ...state,
            configurationItem: {
                ...state.configurationItem,
                processedItems: [...state.configurationItem.processedItems, action.id],
            }
        })),
        on(DisplayActions.addGraphItem, (state, action) => ({
            ...state,
            configurationItem: {
                ...state.configurationItem,
                graphItems: [...state.configurationItem.graphItems, action.item],
            }
        })),
        on(EditActions.deleteConfigurationItem, (state, action) => ({
            ...state,
            result: {
                ...state.result,
                resultList: state.result.resultList.filter(r => r.id !== action.itemId),
                resultListFull: state.result.resultListFull.filter(r => r.id !== action.itemId),
            }
        })),
        on(SearchFormActions.searchChangeMetaData, (state, action) => {
            const types = action.attributeTypes.map(at => at.id);
            return {
                ...state,
                search: {
                    ...state.search,
                    form: {
                        ...state.search.form,
                        attributes: state.search.form.attributes.filter(a => types.indexOf(a.typeId) > -1),
                    }
                }
            };
        }),
        on(SearchFormActions.addNameOrValue, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    nameOrValue: action.text,
                }
            }
        })),
        on(SearchFormActions.addItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    itemTypeId: action.typeId,
                }
            }
        })),
        on(SearchFormActions.deleteItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    itemTypeId: undefined,
                    connectionsToLower: [],
                    connectionsToUpper: [],
                }
            }
        })),
        on(SearchFormActions.addAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    attributes: [...state.search.form.attributes, { typeId: action.typeId, value: ''}]
                }
            }
        })),
        on(SearchFormActions.changeAttributeValue, (state, action) => {
            let attributes: SearchAttribute[];
            if (state.search.form.attributes.findIndex(a => a.typeId === action.typeId) > -1) {
                attributes = [...state.search.form.attributes];
                attributes.find(a => a.typeId === action.typeId).value = action.value;
            } else {
                attributes = [...state.search.form.attributes,
                    {typeId: action.typeId, value: action.value}];
            }
            return {
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    attributes,
                }
            }
            };
        }),
        on(SearchFormActions.deleteAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    attributes: state.search.form.attributes.filter(a => a.typeId !== action.typeId ),
                }
            }
        })),
        on(SearchFormActions.addConnectionTypeToLower, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    connectionsToLower: [...state.search.form.connectionsToLower, {
                        connectionTypeId: action.connectionTypeId,
                        configurationItemTypeId: action.itemTypeId,
                        count: '1',
                    }],
                }
            }
        })),
        on(SearchFormActions.addConnectionTypeToUpper, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    connectionsToUpper: [...state.search.form.connectionsToUpper, {
                        connectionTypeId: action.connectionTypeId,
                        configurationItemTypeId: action.itemTypeId,
                        count: '1',
                    }],
                }
            }
        })),
        on(SearchFormActions.changeConnectionCountToLower, (state, action) => {
            const connectionsToLower: SearchConnection[] = [...state.search.form.connectionsToLower.map((c, index) => {
                if (index !== action.index) {
                    return c;
                }
                return {...c, count: action.count};
            })];
            connectionsToLower[action.index].count = action.count;
            return {
                ...state,
                search: {
                    ...state.search,
                    form: {
                        ...state.search.form,
                        connectionsToLower,
                    }
                }
            };
        }),
        on(SearchFormActions.changeConnectionCountToUpper, (state, action) => {
            const connectionsToUpper: SearchConnection[] = [...state.search.form.connectionsToUpper.map((c, index) => {
                if (index !== action.index) {
                    return c;
                }
                return {...c, count: action.count};
            })];
            return {
                ...state,
                search: {
                    ...state.search,
                    form: {
                        ...state.search.form,
                        connectionsToUpper,
                    }
                }
            };
        }),
        on(SearchFormActions.deleteConnectionTypeToUpper, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    connectionsToUpper: state.search.form.connectionsToUpper.filter((value, index) => index !== action.index),
                }
            }
        })),
        on(SearchFormActions.deleteConnectionTypeToLower, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    connectionsToLower: state.search.form.connectionsToLower.filter((value, index) => index !== action.index),
                }
            }
        })),
        on(SearchFormActions.setResponsibility, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                form: {
                    ...state.search.form,
                    responsibleToken: action.token,
                }
            }
        })),
        on(SearchFormActions.resetForm, (state, action) => ({
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
        on(SearchActions.setResultList, (state, action) => ({
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
        on(SearchActions.setResultListFull, (state, action) => ({
            ...state,
            result: {
                ...state.result,
                resultListFull: [...action.configurationItems],
                resultListFullPresent: action.configurationItems && action.configurationItems.length > 0,
                resultListFullLoading: false,
            }
        })),
        on(SearchActions.deleteResultList, (state, action) => ({
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
                    itemTypeId: action.itemType.id,
                }
            },
            result: {
                ...state.result,
                resultList: state.result.resultList.filter(r => r.itemId === action.itemType.id),
                resultListFull: state.result.resultListFull.filter(r => r.typeId === action.itemType.id),
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
        on(MultiEditActions.addItemId, (state, action) => ({
            ...state,
            multiEdit: {
                ...state.multiEdit,
                selectedIds: [...state.multiEdit.selectedIds, action.itemId],
            }
        })),
        on(MultiEditActions.removeItemId, (state, action) => ({
            ...state,
            multiEdit: {
                ...state.multiEdit,
                selectedIds: state.multiEdit.selectedIds.filter(id => id !== action.itemId),
            }
        })),
        on(MultiEditActions.setItemIds, (state, action) => ({
            ...state,
            multiEdit: {
                ...state.multiEdit,
                selectedIds: [...action.itemIds],
            }
        })),
        on(MultiEditActions.setSelectedItems, (state, action) => ({
            ...state,
            multiEdit: {
                ...state.multiEdit,
                selectedItems: [...action.items],
            }
        })),
        on(MultiEditActions.clear, (state, action) => ({
            ...state,
            multiEdit: {
                ...state.multiEdit,
                selectedIds: [],
                selectedItems: [],
                logEntries: [],
            }
        })),
        on(DataExchangeActions.setImportItemType, (state, action) => ({
            ...state,
            import: {
                ...state.import,
                itemTypeId: action.itemTypeId,
            }
        })),
        on(DataExchangeActions.setElements, (state, action) => ({
            ...state,
            import: {
                ...state.import,
                elements: action.elements,
            }
        })),
    )(displayState, displayAction);
}



