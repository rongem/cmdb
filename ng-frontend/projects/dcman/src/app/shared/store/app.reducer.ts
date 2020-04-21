import { ActionReducerMap } from '@ngrx/store';

import * as fromBasics from './basics/basics.reducer';
import * as fromAsset from './asset/asset.reducer';

import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

export const BASICS = 'basics';
export const ASSET = 'asset';
export const ROUTER = 'router';

export interface AppState {
    [StoreConstants.METADATA]: MetaDataStore.State;
    [StoreConstants.ERROR]: ErrorStore.State;
    [BASICS]: fromBasics.State;
    [ASSET]: fromAsset.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [StoreConstants.METADATA]: MetaDataStore.MetaDataReducer,
    [StoreConstants.ERROR]: ErrorStore.ErrorReducer,
    [BASICS]: fromBasics.BasicsReducer,
    [ASSET]: fromAsset.AssetReducer,
};
