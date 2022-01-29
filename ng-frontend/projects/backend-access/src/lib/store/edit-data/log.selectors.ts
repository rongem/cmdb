import { createSelector, createFeatureSelector } from '@ngrx/store';

import { LOG } from '../../store/store.constants';
import { State } from './log.reducer';


const getState = createFeatureSelector<State>(LOG);

export const selectLogEntries = createSelector(getState, state => state.logEntries);

// Sort entries by Subject only if all subjects are set. Otherwise don't sort
export const selectLogEntriesSorted = createSelector(selectLogEntries, entries =>
    entries.some(e => e.subject === undefined) ? entries : entries.slice().sort((a, b) => a.subject.localeCompare(b.subject))
);

export const selectLogItemIds = createSelector(selectLogEntries, logEntries =>
    [...new Set(logEntries.filter(l => !!l.subjectId).map(l => l.subjectId))]
);

export const selectLogEntriesForItemId = (itemId: string) => createSelector(selectLogEntries, logEntries =>
    logEntries.filter(l => l.subjectId === itemId)
);
