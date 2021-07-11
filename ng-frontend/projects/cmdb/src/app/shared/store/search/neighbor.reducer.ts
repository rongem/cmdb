import { Action, createReducer, on } from '@ngrx/store';
import { NeighborSearch, NeighborItem, SearchActions } from 'backend-access';

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
)(neighborState, neighborAction);
