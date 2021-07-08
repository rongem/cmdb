import { createSelector } from '@ngrx/store';
import { ItemType, AttributeType, ConnectionRule, ConnectionType, MetaDataSelectors, AttributeGroup } from 'backend-access';

import * as fromDisplay from './display.reducer';
import * as fromSelectDisplay from './display.selectors';

export const getSearchState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.search
);

export const getForm = createSelector(getSearchState, state => state.form);

export const selectSearchItemTypeId = createSelector(getForm,
    form => form.itemTypeId
);
export const selectSearchItemType = createSelector(selectSearchItemTypeId, MetaDataSelectors.selectItemTypes,
    (itemTypeId: string, itemTypes: ItemType[]) => itemTypes.find(it => it.id === itemTypeId)
);

export const selectSearchUsedAttributeTypes = createSelector(getForm,
    form => form.attributes ? [...new Set(form.attributes.map(a => a.typeId))] : []
);

export const selectAttributeGroupIdsForCurrentSearchItemType = createSelector(selectSearchItemType, MetaDataSelectors.selectAttributeGroups,
    (itemType: ItemType, attributeGroups: AttributeGroup[]) => itemType?.attributeGroups?.map(a => a.id) ?? attributeGroups.map(ag => ag.id)
);

export const selectAttributeTypesForCurrentSearchItemType =
    createSelector(selectAttributeGroupIdsForCurrentSearchItemType, MetaDataSelectors.selectAttributeTypes,
        (groupIds: string[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.attributeGroupId) > -1)
);

export const selectSearchAvailableSearchAttributeTypes =
    createSelector(selectSearchUsedAttributeTypes, selectAttributeTypesForCurrentSearchItemType,
        (usedAttributeTypes, availableAttributeTypes) =>
        availableAttributeTypes.filter(at => usedAttributeTypes.findIndex(ua => ua === at.id) < 0)
);

export const selectConnectionRulesForCurrentIsUpperSearchItemType =
    createSelector(MetaDataSelectors.selectConnectionRules, selectSearchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.upperItemTypeId === itemType.id)
);
export const selectConnectionRulesForCurrentIsLowerSearchItemType =
    createSelector(MetaDataSelectors.selectConnectionRules, selectSearchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.lowerItemTypeId === itemType.id)
);

export const selectConnectionTypesForCurrentIsUpperSearchItemType =
    createSelector(MetaDataSelectors.selectConnectionTypes, selectConnectionRulesForCurrentIsUpperSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);
export const selectConnectionTypesForCurrentIsLowerSearchItemType =
    createSelector(MetaDataSelectors.selectConnectionTypes, selectConnectionRulesForCurrentIsLowerSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);
