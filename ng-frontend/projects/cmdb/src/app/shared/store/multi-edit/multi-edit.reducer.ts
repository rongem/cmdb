import { Action, createReducer, on } from '@ngrx/store';
import { FullConfigurationItem, MultiEditActions } from 'backend-access';

export interface State {
    selectedIds: string[];
    selectedItems: FullConfigurationItem[];
}

const initialState: State = {
    selectedIds: [],
    selectedItems: [],
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
    on(MultiEditActions.clear, (state, action) => ({
        ...state,
        selectedIds: [],
        selectedItems: [],
    })),
)(multiEditState, multiEditAction);
