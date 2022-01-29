import { ActionReducerMap } from '@ngrx/store';
import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

import { State as GlobalState, globalReducer } from './global/global.reducer';
import { State as AdminState, adminReducer } from '../../admin/store/admin.reducer';
import { State as ItemState, itemReducer } from './item/item.reducer';
import { State as SearchState, searchFormReducer } from './search/search-form.reducer';
import { State as NeighborSearchState, neighborReducer } from './search/neighbor.reducer';
import { State as ImportState, importReducer } from './import/import.reducer';
import { State as MultiEditState, multiEditReducer } from './multi-edit/multi-edit.reducer';
import { ADMIN, ITEM, SEARCH, NEIGHBOR, IMPORT, GLOBAL, MULTIEDIT } from './store.constants';

export interface AppState {
    [StoreConstants.METADATA]: MetaDataStore.State;
    [GLOBAL]: GlobalState;
    [ADMIN]: AdminState;
    [ITEM]: ItemState;
    [SEARCH]: SearchState;
    [NEIGHBOR]: NeighborSearchState;
    [IMPORT]: ImportState;
    [MULTIEDIT]: MultiEditState;
    [StoreConstants.ERROR]: ErrorStore.State;
    [StoreConstants.LOG]: LogStore.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [StoreConstants.METADATA]: MetaDataStore.metaDataReducer,
    [GLOBAL]: globalReducer,
    [ADMIN]: adminReducer,
    [ITEM]: itemReducer,
    [SEARCH]: searchFormReducer,
    [NEIGHBOR]: neighborReducer,
    [IMPORT]: importReducer,
    [MULTIEDIT]: multiEditReducer,
    [StoreConstants.ERROR]: ErrorStore.errorReducer,
    [StoreConstants.LOG]: LogStore.logReducer,
};
