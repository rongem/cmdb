import { createSelector, createFeatureSelector } from '@ngrx/store';

import { DISPLAY } from '../store.constants';
import { State } from './display.reducer';

export const getDisplayState = createFeatureSelector<State>(DISPLAY);

export const selectVisibleComponent = createSelector(getDisplayState, (state) => state.visibleComponent);

