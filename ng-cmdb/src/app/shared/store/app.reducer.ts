import { ActionReducerMap } from '@ngrx/store';

import * as fromMetaData from './meta-data.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';

export const METADATA = 'metaData';
export const ADMIN = 'admin';
export const DISPLAY = 'display';

export interface AppState {
    metaData: fromMetaData.State;
    admin: fromAdmin.State;
    display: fromDisplay.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    metaData: fromMetaData.MetaDataReducer,
    admin: fromAdmin.AdminReducer,
    display: fromDisplay.DisplayReducer,
};
