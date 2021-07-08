import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors, ItemType, ConnectionRule, AttributeType, ConnectionType } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromAdmin from './admin.reducer';

export const getAdminState = createFeatureSelector<fromAdmin.State>(fromApp.ADMIN);

export const selectCurrentItemType = createSelector(getAdminState,
    (state: fromAdmin.State) => state.itemType);

export const selectUsers = createSelector(getAdminState, state => state.users);

export const selectAttributeGroupIdsForCurrentItemType = createSelector(selectCurrentItemType,
    (itemType: ItemType) => itemType.attributeGroups?.map(a => a.id) ?? []
);

export const selectAttributeTypesForCurrentItemType = createSelector(selectAttributeGroupIdsForCurrentItemType, MetaDataSelectors.selectAttributeTypes,
    (groupIds: string[], attributeTypes: AttributeType[]) => attributeTypes.filter(at => groupIds.indexOf(at.attributeGroupId) > -1)
);

export const selectConnectionRulesForCurrentIsUpperItemType = createSelector(MetaDataSelectors.selectConnectionRules, selectCurrentItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) => itemType && value.upperItemTypeId === itemType.id)
);
export const selectConnectionRulesForCurrentIsLowerItemType = createSelector(MetaDataSelectors.selectConnectionRules, selectCurrentItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) => itemType && value.lowerItemTypeId === itemType.id)
);

export const selectConnectionTypesForCurrentIsUpperItemType = createSelector(MetaDataSelectors.selectConnectionTypes,
    selectConnectionRulesForCurrentIsUpperItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);
export const selectConnectionTypesForCurrentIsLowerItemType = createSelector(MetaDataSelectors.selectConnectionTypes,
    selectConnectionRulesForCurrentIsLowerItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);

export const selectUpperItemTypesForCurrentItemTypeAndConnectionType = (connectionType: ConnectionType) => createSelector(
    selectConnectionRulesForCurrentIsLowerItemType, MetaDataSelectors.selectItemTypes,
    (connectionRules: ConnectionRule[], itemTypes: ItemType[]) =>
        itemTypes.filter(itemtype =>
        connectionRules.filter(rule =>
            rule.connectionTypeId === connectionType.id).map(rule =>
            rule.lowerItemTypeId).findIndex(val => val === itemtype.id) > -1)
);
export const selectLowerItemTypesForCurrentItemTypeAndConnectionType = (connectionType: ConnectionType) => createSelector(
    selectConnectionRulesForCurrentIsUpperItemType,MetaDataSelectors.selectItemTypes, (connectionRules: ConnectionRule[], itemTypes: ItemType[]) =>
        itemTypes.filter(itemtype => connectionRules.filter(rule => rule.connectionTypeId === connectionType.id).map(rule =>
            rule.upperItemTypeId).findIndex(val => val === itemtype.id) > -1)
);
