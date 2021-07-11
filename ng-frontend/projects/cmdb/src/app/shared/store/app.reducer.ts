import { ActionReducerMap } from '@ngrx/store';
import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

import { State as AdminState, adminReducer } from '../../admin/store/admin.reducer';
import { State as ItemState, itemReducer } from './item/item.reducer';
import { State as SearchState, searchFormReducer } from './search/search-form.reducer';

export const ADMIN = 'admin';
export const ITEM = 'item';
export const EDIT = 'edit';
export const MULTIEDIT = 'multi-edit';
export const SEARCH = 'search';
export const NEIGHBOR = 'neighbor-search';

export interface AppState {
    [StoreConstants.METADATA]: MetaDataStore.State;
    [ADMIN]: AdminState;
    [ITEM]: ItemState;
    [SEARCH]: SearchState;
    [StoreConstants.ERROR]: ErrorStore.State;
    [StoreConstants.LOG]: LogStore.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [StoreConstants.METADATA]: MetaDataStore.metaDataReducer,
    [ADMIN]: adminReducer,
    [ITEM]: itemReducer,
    [SEARCH]: searchFormReducer,
    [StoreConstants.ERROR]: ErrorStore.errorReducer,
    [StoreConstants.LOG]: LogStore.logReducer,
};
