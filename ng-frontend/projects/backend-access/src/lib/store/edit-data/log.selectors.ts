import { createSelector, createFeatureSelector } from '@ngrx/store';

import { LOG } from '../../store/store.constants';
import { State } from './log.reducer';


const getState = createFeatureSelector<State>(LOG);

export const selectLogEntries = createSelector(getState, state => state.logEntries);

export const selectLogItemIds = createSelector(selectLogEntries, logEntries =>
    [...new Set(logEntries.filter(l => !!l.subjectId).map(l => l.subjectId))]
);

export const selectLogEntriesForItemId = (itemId: string) => createSelector(selectLogEntries, logEntries =>
    logEntries.filter(l => l.subjectId === itemId)
);
