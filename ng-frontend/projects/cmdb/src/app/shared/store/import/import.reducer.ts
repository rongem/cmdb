import { Action, createReducer, on } from '@ngrx/store';
import { ImportActions } from '../store.api';

export interface State {
    itemTypeId: string;
    elements: string[];
}

const initialState: State = {
    itemTypeId: undefined,
    elements: [],
};

export const importReducer = (dataExchangeState: State | undefined, dataExchangeAction: Action): State => createReducer(
    initialState,
    on(ImportActions.setImportItemType, (state, action) => ({
        ...state,
        itemTypeId: action.itemTypeId,
    })),
    on(ImportActions.setElements, (state, action) => ({
        ...state,
        elements: action.elements,
    })),
)(dataExchangeState, dataExchangeAction);
