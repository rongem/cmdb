import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors, ItemType, ConnectionRule, AttributeType, ConnectionType } from 'backend-access';

import { ADMIN } from '../../shared/store/store.constants';
import * as fromAdmin from './admin.reducer';

export const getAdminState = createFeatureSelector<fromAdmin.State>(ADMIN);

export const selectCurrentItemType = createSelector(getAdminState, state => state.itemType);
export const selectUsers = createSelector(getAdminState, state => state.users);

export const selectAttributeGroupIdsForCurrentItemType = createSelector(selectCurrentItemType,
    itemType => itemType.attributeGroups?.map(a => a.id) ?? []
);

export const selectAttributeTypesForCurrentItemType = createSelector(selectAttributeGroupIdsForCurrentItemType, MetaDataSelectors.selectAttributeTypes,
    (groupIds, attributeTypes) => attributeTypes.filter(at => groupIds.indexOf(at.attributeGroupId) > -1)
);

export const selectConnectionRulesForCurrentIsUpperItemType = createSelector(MetaDataSelectors.selectConnectionRules, selectCurrentItemType,
    (connectionRules, itemType) => connectionRules.filter((value) => itemType && value.upperItemTypeId === itemType.id)
);
export const selectConnectionRulesForCurrentIsLowerItemType = createSelector(MetaDataSelectors.selectConnectionRules, selectCurrentItemType,
    (connectionRules, itemType) => connectionRules.filter((value) => itemType && value.lowerItemTypeId === itemType.id)
);

export const selectConnectionTypesForCurrentIsUpperItemType = createSelector(MetaDataSelectors.selectConnectionTypes,
    selectConnectionRulesForCurrentIsUpperItemType, (connectionTypes, connectionRules) =>
        connectionTypes.filter((connectionType) => connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);
export const selectConnectionTypesForCurrentIsLowerItemType = createSelector(MetaDataSelectors.selectConnectionTypes,
    selectConnectionRulesForCurrentIsLowerItemType, (connectionTypes, connectionRules) =>
        connectionTypes.filter((connectionType) => connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);

export const selectUpperItemTypesForCurrentItemTypeAndConnectionType = (connectionType: ConnectionType) => createSelector(
    selectConnectionRulesForCurrentIsLowerItemType, MetaDataSelectors.selectItemTypes, (connectionRules, itemTypes) =>
        itemTypes.filter(itemtype => connectionRules.filter(rule =>
            rule.connectionTypeId === connectionType.id).map(rule =>
            rule.lowerItemTypeId).findIndex(val => val === itemtype.id) > -1)
);
export const selectLowerItemTypesForCurrentItemTypeAndConnectionType = (connectionType: ConnectionType) => createSelector(
    selectConnectionRulesForCurrentIsUpperItemType,MetaDataSelectors.selectItemTypes, (connectionRules, itemTypes) =>
        itemTypes.filter(itemtype => connectionRules.filter(rule => rule.connectionTypeId === connectionType.id).map(rule =>
            rule.upperItemTypeId).findIndex(val => val === itemtype.id) > -1)
);
