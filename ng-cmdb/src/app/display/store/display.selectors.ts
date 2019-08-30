import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

export const getDisplayState = createFeatureSelector<fromDisplay.State>(fromApp.DISPLAY);

export const getItemState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.configurationItem);
export const getSearchState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.search);
export const getResultState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.result);

export const selectSearchItemType = createSelector(getSearchState,
    (state) => state.itemType);
export const selectSearchUsedAttributeTypes = createSelector(getSearchState,
    (state) => state.usedAttributeTypes);
export const selectSearchAvailableAttributeTypes =
    createSelector(selectSearchUsedAttributeTypes, fromSelectMetaData.selectAttributeTypesForCurrentItemType,
        (usedAttributeTypes, availableAttributeTypes) =>
        availableAttributeTypes.filter(at => usedAttributeTypes.findIndex(ua => ua === at.TypeId) < 0));


