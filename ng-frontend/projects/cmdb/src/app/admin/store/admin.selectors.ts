import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors, ItemTypeAttributeGroupMapping, ItemType, ConnectionRule, Guid, AttributeType, ConnectionType } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromAdmin from './admin.reducer';

export const getAdminState = createFeatureSelector<fromAdmin.State>(fromApp.ADMIN);

export const selectCurrentItemType = createSelector(getAdminState,
    (state: fromAdmin.State) => state.itemType);

export const selectAttributeGroupIdsForCurrentItemType =
    createSelector(MetaDataSelectors.selectItemTypeAttributeGroupMappings, selectCurrentItemType,
    (iagm: ItemTypeAttributeGroupMapping[], itemType: ItemType) =>
        iagm.filter(m => !itemType || m.ItemTypeId === itemType.TypeId).map(a => a.GroupId));

export const selectAttributeTypesForCurrentItemType =
    createSelector(selectAttributeGroupIdsForCurrentItemType, MetaDataSelectors.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1));

export const selectConnectionRulesForCurrentIsUpperItemType =
    createSelector(MetaDataSelectors.selectConnectionRules, selectCurrentItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemUpperType === itemType.TypeId));
export const selectConnectionRulesForCurrentIsLowerItemType =
    createSelector(MetaDataSelectors.selectConnectionRules, selectCurrentItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemLowerType === itemType.TypeId));

export const selectConnectionTypesForCurrentIsUpperItemType =
    createSelector(MetaDataSelectors.selectConnectionTypes, selectConnectionRulesForCurrentIsUpperItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1));
export const selectConnectionTypesForCurrentIsLowerItemType =
    createSelector(MetaDataSelectors.selectConnectionTypes, selectConnectionRulesForCurrentIsLowerItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1));

export const selectUpperItemTypesForCurrentItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForCurrentIsLowerItemType,
        MetaDataSelectors.selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === connectionType.ConnTypeId).map(rule =>
                rule.ItemLowerType).findIndex(val => val === itemtype.TypeId) > -1)
    );
export const selectLowerItemTypesForCurrentItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForCurrentIsUpperItemType,
        MetaDataSelectors.selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === connectionType.ConnTypeId).map(rule =>
                rule.ItemUpperType).findIndex(val => val === itemtype.TypeId) > -1)
    );

