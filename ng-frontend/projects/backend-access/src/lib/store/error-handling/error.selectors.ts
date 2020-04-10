import { createSelector, createFeatureSelector } from '@ngrx/store';

import { ERROR } from '../constants';
import { State } from './error.reducer';

const getState = createFeatureSelector<State>(ERROR);

export const selectRecentError = createSelector(getState, state => state.recentError);
export const selectAllErrors = createSelector(getState, state => state.errorList);
export const selectErrorIsFatal = createSelector(getState, state => state.fatalErrorState);
