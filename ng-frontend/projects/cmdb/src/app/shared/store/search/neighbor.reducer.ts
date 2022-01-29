import { Action, createReducer, on } from '@ngrx/store';
import { NeighborSearch, NeighborItem, SearchActions, SearchAttribute } from 'backend-access';
import { NeighborSearchActions } from '../store.api';

export interface State {
    form: NeighborSearch;
    searching: boolean;
    noSearchResult: boolean;
    resultList: NeighborItem[];
    resultListPresent: boolean;
    resultListFullPresent: boolean;
    resultListFullLoading: boolean;
}

const initialState: State = {
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
};

export const neighborReducer = (neighborState: State | undefined, neighborAction: Action): State => createReducer(
    initialState,
    on(SearchActions.performNeighborSearch, (state, action) => ({
        ...state,
        form: {
            ...action.searchContent,
        },
        searching: true,
        noSearchResult: false,
        resultList: [],
        resultListPresent: false,
        resultListFullLoading: false,
        resultListFullPresent: false,
    })),
    on(SearchActions.setNeighborSearchResultList, (state, action) => ({
        ...state,
        searching: false,
        noSearchResult: !action.resultList || action.resultList.length === 0,
        resultList: [...action.resultList],
        resultListPresent: !action.resultList || action.resultList.length === 0,
        resultListFullLoading: !action.fullItemsIncluded,
        resultListFullPresent: !!action.resultList && action.resultList.length > 0 && action.fullItemsIncluded,
    })),
    on(NeighborSearchActions.setNeighborSearch, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            itemTypeId: action.itemTypeId,
            sourceItem: action.sourceItem,
            searchDirection: action.searchDirection,
            maxLevels: action.maxLevels,
            extraSearch: {
                ...state.form.extraSearch,
                itemTypeId: state.form.itemTypeId === action.itemTypeId ? state.form.itemTypeId : action.itemTypeId,
                attributes: state.form.itemTypeId === action.itemTypeId ? state.form.extraSearch.attributes : [],
                connectionsToLower: state.form.itemTypeId === action.itemTypeId ? state.form.extraSearch.connectionsToLower : [],
                connectionsToUpper: state.form.itemTypeId === action.itemTypeId ? state.form.extraSearch.connectionsToUpper : [],
            },
        }
    })),
    on(NeighborSearchActions.addNameOrValue, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                nameOrValue: action.text,
            },
        }
    })),
    on(NeighborSearchActions.addItemType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            itemTypeId: action.typeId,
            extraSearch: {
                ...state.form.extraSearch,
                itemTypeId: action.typeId,
                attributes: [],
                connectionsToLower: [],
                connectionsToUpper: [],
            },
        }
    })),
    on(NeighborSearchActions.deleteItemType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            itemTypeId: undefined,
            extraSearch: {
                ...state.form.extraSearch,
                itemTypeId: undefined,
                connectionsToLower: [],
                connectionsToUpper: [],
            },
        }
    })),
    on(NeighborSearchActions.addAttributeValue, (state, action) => {
        let attributes: SearchAttribute[];
        if (state.form.extraSearch.attributes.findIndex(a => a.typeId === action.typeId) > -1) {
            attributes = [...state.form.extraSearch.attributes.map(a => a.typeId === action.typeId ?
                { typeId: action.typeId, value: action.value } : a)];
        } else {
            attributes = [...state.form.extraSearch.attributes, {typeId: action.typeId, value: action.value}];
        }
        return {
            ...state,
            form: {
                ...state.form,
                extraSearch: {
                    ...state.form.extraSearch,
                    attributes,
                },
            }
        };
    }),
    on(NeighborSearchActions.deleteAttributeType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                attributes: state.form.extraSearch.attributes.filter(a => a.typeId !== action.typeId ),
            },
        }
    })),
    on(NeighborSearchActions.addConnectionTypeToLower, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                connectionsToLower: [...state.form.extraSearch.connectionsToLower.filter(connection => !(action.itemTypeId ?
                    connection.connectionTypeId === action.connectionTypeId && (!connection.itemTypeId || connection.itemTypeId === action.itemTypeId) :
                    connection.connectionTypeId === action.connectionTypeId)
                ), {
                    connectionTypeId: action.connectionTypeId,
                    itemTypeId: action.itemTypeId,
                    count: action.count,
                }],
            },
        }
    })),
    on(NeighborSearchActions.addConnectionTypeToUpper, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                connectionsToUpper: [...state.form.extraSearch.connectionsToUpper.filter(connection => !(action.itemTypeId ?
                    connection.connectionTypeId === action.connectionTypeId && (!connection.itemTypeId || connection.itemTypeId === action.itemTypeId) :
                    connection.connectionTypeId === action.connectionTypeId)
                ), {
                    connectionTypeId: action.connectionTypeId,
                    itemTypeId: action.itemTypeId,
                    count: action.count,
                }],
            },
        }
    })),
    on(NeighborSearchActions.deleteConnectionTypeToUpper, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                connectionsToUpper: state.form.extraSearch.connectionsToUpper.filter((value, index) => index !== action.index),
            },
        }
    })),
    on(NeighborSearchActions.deleteConnectionTypeToLower, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                connectionsToLower: state.form.extraSearch.connectionsToLower.filter((value, index) => index !== action.index),
            },
        }
    })),
    on(NeighborSearchActions.setChangedAfter, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                changedAfter: action.date,
                changedBefore: state.form.extraSearch.changedBefore && action.date &&
                    state.form.extraSearch.changedBefore > action.date ? state.form.extraSearch.changedBefore : undefined,
            },
        }
    })),
    on(NeighborSearchActions.setChangedBefore, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                changedBefore: action.date,
                changedAfter: state.form.extraSearch.changedAfter && action.date &&
                    state.form.extraSearch.changedAfter < action.date ? state.form.extraSearch.changedAfter : undefined,
            },
        }
    })),
    on(NeighborSearchActions.setResponsibility, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            extraSearch: {
                ...state.form.extraSearch,
                responsibleToken: action.token,
            },
        }
    })),
    on(NeighborSearchActions.resetForm, (state, action) => ({
        ...state,
        form: {
            ...initialState.form,
        }
    })),

)(neighborState, neighborAction);
