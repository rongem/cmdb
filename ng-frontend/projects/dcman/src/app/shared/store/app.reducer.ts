import { ActionReducerMap } from '@ngrx/store';

import * as fromBasics from './basics/basics.reducer';
import * as fromAsset from './asset/asset.reducer';
import * as fromProv from './provisionable/provisionable.reducer';

import { StoreConstants, MetaDataStore, ErrorStore, LogStore } from 'backend-access';

export const BASICS = 'basics';
export const ASSET = 'asset';
export const PROVISIONABLESYSTEMS = 'provisionableSystems';
export const ROUTER = 'router';

export interface AppState {
    [StoreConstants.METADATA]: MetaDataStore.State;
    [StoreConstants.ERROR]: ErrorStore.State;
    [BASICS]: fromBasics.State;
    [ASSET]: fromAsset.State;
    [PROVISIONABLESYSTEMS]: fromProv.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [StoreConstants.METADATA]: MetaDataStore.metaDataReducer,
    [StoreConstants.ERROR]: ErrorStore.errorReducer,
    [BASICS]: fromBasics.basicsReducer,
    [ASSET]: fromAsset.assetReducer,
    [PROVISIONABLESYSTEMS]: fromProv.provisionableSystemsReducer
};
