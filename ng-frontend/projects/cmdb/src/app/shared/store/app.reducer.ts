import { ActionReducerMap } from '@ngrx/store';
import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

import * as fromDisplay from './display/display.reducer';
import * as fromAdmin from '../../admin/store/admin.reducer';

export const ADMIN = 'admin';
export const DISPLAY = 'display';
export const EDIT = 'edit';
export const MULTIEDIT = 'multi-edit';
export const SEARCH = 'search';

export interface AppState {
    [StoreConstants.METADATA]: MetaDataStore.State;
    [ADMIN]: fromAdmin.State;
    [DISPLAY]: fromDisplay.State;
    [StoreConstants.ERROR]: ErrorStore.State;
    [StoreConstants.LOG]: LogStore.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [StoreConstants.METADATA]: MetaDataStore.metaDataReducer,
    [ADMIN]: fromAdmin.adminReducer,
    [DISPLAY]: fromDisplay.displayReducer,
    [StoreConstants.ERROR]: ErrorStore.errorReducer,
    [StoreConstants.LOG]: LogStore.logReducer,
};
