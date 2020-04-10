import { ActionReducerMap } from '@ngrx/store';

import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';
import * as fromAdmin from 'projects/cmdb/src/app/admin/store/admin.reducer';
import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

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
