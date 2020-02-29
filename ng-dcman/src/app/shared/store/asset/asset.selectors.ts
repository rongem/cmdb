import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromAsset from './asset.reducer';

export const selectState = createFeatureSelector<fromAsset.State>(fromApp.ASSET);
export const selectRacks = createSelector(selectState, state => state.racks);
export const selectEnclosures = createSelector(selectState, state => state.enclosures);
export const selectReady = createSelector(selectState, state => state.racksReady && state.enclosuresReady);
