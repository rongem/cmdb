import { ActionReducerMap } from '@ngrx/store';
import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

import { State as AdminState, adminReducer } from '../../admin/store/admin.reducer';
import { State as DisplayState, displayReducer } from './display/display.reducer';
import { State as ItemState, itemReducer } from './item/item.reducer';
import { State as SearchState, searchFormReducer } from './search/search-form.reducer';
import { State as NeighborSearchState, neighborReducer } from './search/neighbor.reducer';
import { State as ImportState, importReducer } from './import/import.reducer';

export const ADMIN = 'admin';
export const DISPLAY = 'display';
export const ITEM = 'item';
export const EDIT = 'edit';
export const MULTIEDIT = 'multi-edit';
export const IMPORT = 'import';
export const SEARCH = 'search';
export const NEIGHBOR = 'neighbor-search';

export interface AppState {
    [StoreConstants.METADATA]: MetaDataStore.State;
    [ADMIN]: AdminState;
    [DISPLAY]: DisplayState;
    [ITEM]: ItemState;
    [SEARCH]: SearchState;
    [NEIGHBOR]: NeighborSearchState;
    [IMPORT]: ImportState;
    [StoreConstants.ERROR]: ErrorStore.State;
    [StoreConstants.LOG]: LogStore.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [StoreConstants.METADATA]: MetaDataStore.metaDataReducer,
    [ADMIN]: adminReducer,
    [DISPLAY]: displayReducer,
    [ITEM]: itemReducer,
    [SEARCH]: searchFormReducer,
    [NEIGHBOR]: neighborReducer,
    [IMPORT]: importReducer,
    [StoreConstants.ERROR]: ErrorStore.errorReducer,
    [StoreConstants.LOG]: LogStore.logReducer,
};
