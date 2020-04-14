import { createSelector } from '@ngrx/store';
import { ItemTypeAttributeGroupMapping, ItemType, AttributeType, ConnectionRule, ConnectionType, MetaDataSelectors } from 'backend-access';

import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

export const getSearchState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.search
);

export const selectSearchItemTypeId = createSelector(getSearchState,
    (state) => state.form.itemTypeId
);
export const selectSearchItemType = createSelector(selectSearchItemTypeId, MetaDataSelectors.selectItemTypes,
    (itemTypeId: string, itemTypes: ItemType[]) => itemTypes.find(it => it.id === itemTypeId)
);

export const selectSearchUsedAttributeTypes = createSelector(getSearchState,
    (state) => state.form.attributes ? [...new Set(state.form.attributes.map(a => a.typeId))] : []
);

export const selectAttributeGroupIdsForCurrentSearchItemType =
    createSelector(MetaDataSelectors.selectItemTypeAttributeGroupMappings, selectSearchItemType,
    (iagm: ItemTypeAttributeGroupMapping[], itemType: ItemType) =>
        iagm.filter(m => !itemType || m.itemTypeId === itemType.id).map(a => a.attributeGroupId)
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
