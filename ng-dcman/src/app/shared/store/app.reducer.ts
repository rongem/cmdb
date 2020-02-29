import { ActionReducerMap } from '@ngrx/store';

import * as fromMetaData from './meta-data.reducer';
import * as fromBasics from './basics/basics.reducer';
import * as fromAsset from './asset/asset.reducer';

export const METADATA = 'metaData';
export const BASICS = 'basics';
export const ASSET = 'asset';

export interface AppState {
    [METADATA]: fromMetaData.State;
    [BASICS]: fromBasics.State;
    [ASSET]: fromAsset.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    [METADATA]: fromMetaData.MetaDataReducer,
    [BASICS]: fromBasics.BasicsReducer,
    [ASSET]: fromAsset.AssetReducer,
};
