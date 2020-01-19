import { ActionReducerMap } from '@ngrx/store';

import * as fromMetaData from './meta-data.reducer';

export const METADATA = 'metaData';

export interface AppState {
    metaData: fromMetaData.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    metaData: fromMetaData.MetaDataReducer,
};
