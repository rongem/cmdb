import { createSelector, createFeatureSelector } from '@ngrx/store';

import { LOG } from '../../store/store.constants';
import { State } from './log.reducer';


const getState = createFeatureSelector<State>(LOG);

export const selectLogEntries = createSelector(getState, state => state.logEntries);
