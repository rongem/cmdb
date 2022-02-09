import { Action, createReducer, on } from '@ngrx/store';
import { FullConfigurationItem } from 'backend-access';
import { MultiEditActions } from '../store.api';

export interface State {
    selectedIds: string[];
    selectedItems: FullConfigurationItem[];
    idsToProcess: string[];
}

const initialState: State = {
    selectedIds: [],
    selectedItems: [],
    idsToProcess: [],
};

export const multiEditReducer = (multiEditState: State | undefined, multiEditAction: Action): State => createReducer(
    initialState,
    on(MultiEditActions.addItemId, (state, action) => ({
        ...state,
        selectedIds: [...state.selectedIds, action.itemId],
    })),
    on(MultiEditActions.removeItemId, (state, action) => ({
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== action.itemId),
    })),
    on(MultiEditActions.setItemIds, (state, action) => ({
        ...state,
        selectedIds: [...action.itemIds],
    })),
    on(MultiEditActions.setSelectedItems, (state, action) => ({
        ...state,
        selectedItems: [...action.items],
    })),
    on(MultiEditActions.replaceSelectedItem, (state, action) => ({
        ...state,
        selectedItems: [...state.selectedItems.map(item => item.id === action.item.id ? action.item : item)],
    })),
    on(MultiEditActions.clear, (state, action) => ({
        ...state,
        selectedIds: [],
        selectedItems: [],
    })),
    on(MultiEditActions.setItemIdsToProcess, (state, action) => ({
        ...state,
        idsToProcess: action.itemIds,
    })),
    on(MultiEditActions.removeItemIdToProcess, (state, action) => ({
        ...state,
        idsToProcess: state.idsToProcess.filter(id => id !== action.itemId),
    })),
)(multiEditState, multiEditAction);
