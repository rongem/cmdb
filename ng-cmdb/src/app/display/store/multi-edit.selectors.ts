import { createSelector } from '@ngrx/store';

import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

export const getMultiEditState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.multiEdit
);

export const selectIds = createSelector(getMultiEditState,
    (state: fromDisplay.MultiEditState) => state.selectedIds
);

export const selectItems = createSelector(getMultiEditState,
    (state: fromDisplay.MultiEditState) => state.selectedItems
);

