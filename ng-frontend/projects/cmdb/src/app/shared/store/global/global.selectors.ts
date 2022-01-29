import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './global.reducer';
import { GLOBAL } from '../store.constants';

const getGlobalState =  createFeatureSelector<State>(GLOBAL);

export const desiredUrl = createSelector(getGlobalState, state => state.desiredUrl);
