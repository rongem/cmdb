import { ActionReducerMap } from '@ngrx/store';
import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

import * as fromDisplay from '../../display/store/display.reducer';
import * as fromAdmin from '../../admin/store/admin.reducer';

export const ADMIN = 'admin';
export const DISPLAY = 'display';

export interface AppState {
    [StoreConstants.METADATA]: MetaDataStore.State;
    [ADMIN]: fromAdmin.State;
    [DISPLAY]: fromDisplay.State;
    [StoreConstants.ERROR]: ErrorStore.State;
    [StoreConstants.LOG]: LogStore.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [StoreConstants.METADATA]: MetaDataStore.MetaDataReducer,
    [ADMIN]: fromAdmin.AdminReducer,
    [DISPLAY]: fromDisplay.DisplayReducer,
    [StoreConstants.ERROR]: ErrorStore.ErrorReducer,
    [StoreConstants.LOG]: LogStore.LogReducer,
};
