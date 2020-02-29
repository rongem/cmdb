import { createSelector } from '@ngrx/store';

import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromAsset from './asset.reducer';

export const selectRacks = (state: fromAsset.State) => state.racks;
export const selectEnclosures = (state: fromAsset.State) => state.enclosures;
export const racksLoading = (state: fromAsset.State) => state.racksLoading;
export const racksReady = (state: fromAsset.State) => state.racksReady;
export const enclosuresReady = (state: fromAsset.State) => state.enclosuresReady;
export const enclosuresLoading = (state: fromAsset.State) => state.enclosuresReady;
export const ready = (state: fromAsset.State) => state.racksReady && state.enclosuresReady;
