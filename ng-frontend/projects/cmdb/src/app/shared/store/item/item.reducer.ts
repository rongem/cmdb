import { Action, createReducer, on } from '@ngrx/store';
import { FullConfigurationItem, ReadActions, SearchActions, EditActions } from 'backend-access';

import { ItemActions } from '../store.api';
import { GraphItem } from '../../objects/graph-item.model';

export interface State {
    fullConfigurationItem: FullConfigurationItem;
    graphItems: GraphItem[];
    processedItems: string[];
    loadingItem: boolean;
    itemReady: boolean;
    hasError: boolean;
    resultList: FullConfigurationItem[];
    resultListPresent: boolean;
    resultListLoading: boolean;
}

const initialState: State = {
    fullConfigurationItem: undefined,
    graphItems: [],
    processedItems: [],
    loadingItem: false,
    itemReady: false,
    hasError: false,
    resultList: [],
    resultListPresent: false,
    resultListLoading: false,
};

export const itemReducer = (itemState: State | undefined, itemAction: Action): State => createReducer(
    initialState,
    on(ReadActions.setConfigurationItem, (state, action) => ({
        ...state,
        fullConfigurationItem: {...action.configurationItem},
        graphItems: [new GraphItem(action.configurationItem, 0)],
        processedItems: [action.configurationItem.id],
        itemReady: true,
        hasError: false,
    })),
    on(ReadActions.clearConfigurationItem, (state, action) => ({
        ...state,
        fullConfigurationItem: undefined,
        graphItems: [],
        processedItems: [],
        loadingItem: false,
        itemReady: false,
        hasError: !action.success,
    })),
    // clear item before reading
    on(ReadActions.readConfigurationItem, (state, action) => ({
        ...state,
        fullConfigurationItem: undefined,
        graphItems: [],
        processedItems: [],
        loadingItem: true,
        itemReady: false,
        hasError: false,
    })),
    on(ItemActions.addProcessedItemId, (state, action) => ({
        ...state,
        processedItems: [...state.processedItems, action.id],
    })),
    on(ItemActions.addGraphItem, (state, action) => ({
        ...state,
        graphItems: [...state.graphItems, action.item],
    })),
    on(EditActions.deleteConfigurationItem, (state, action) => ({
        ...state,
        resultList: state.resultList.filter(r => r.id !== action.itemId),
    })),
    on(SearchActions.setResultListFull, (state, action) => ({
        ...state,
        resultList: [...action.configurationItems],
        resultListPresent: action.configurationItems && action.configurationItems.length > 0,
        resultListLoading: false,
    })),
    on(SearchActions.deleteResultList, (state, action) => ({
        ...state,
        resultList: [],
        resultListPresent: false,
        resultListLoading: false,
    })),
    on(SearchActions.performSearchFull, (state, action) => ({
        ...state,
        resultList: [],
        resultListPresent: false,
        resultListLoading: true,
    })),
    on(ItemActions.filterResultsByItemType, (state, action) => ({
        ...state,
        resultList: state.resultList.filter(r => r.typeId === action.itemType.id),
    })),
)(itemState, itemAction);
