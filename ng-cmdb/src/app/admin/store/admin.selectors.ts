import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromAdmin from './admin.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { Guid } from 'src/app/shared/guid';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';

export const getAdminState = createFeatureSelector<fromAdmin.State>(fromApp.ADMIN);

export const selectCurrentItemType = createSelector(getAdminState,
    (state: fromAdmin.State) => state.itemType);

export const selectAttributeGroupIdsForCurrentItemType =
    createSelector(fromSelectMetaData.selectItemTypeAttributeGroupMappings, selectCurrentItemType,
    (iagm: ItemTypeAttributeGroupMapping[], itemType: ItemType) =>
        iagm.filter(m => !itemType || m.ItemTypeId === itemType.TypeId).map(a => a.GroupId));

export const selectAttributeTypesForCurrentItemType =
    createSelector(selectAttributeGroupIdsForCurrentItemType, fromSelectMetaData.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1));

export const selectConnectionRulesForCurrentIsUpperItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectCurrentItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemUpperType === itemType.TypeId));
export const selectConnectionRulesForCurrentIsLowerItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectCurrentItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemLowerType === itemType.TypeId));

export const selectConnectionTypesForCurrentIsUpperItemType =
    createSelector(fromSelectMetaData.selectConnectionTypes, selectConnectionRulesForCurrentIsUpperItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1));
export const selectConnectionTypesForCurrentIsLowerItemType =
    createSelector(fromSelectMetaData.selectConnectionTypes, selectConnectionRulesForCurrentIsLowerItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1));

export const selectUpperItemTypesForCurrentItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForCurrentIsLowerItemType,
        fromSelectMetaData.selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === connectionType.ConnTypeId).map(rule =>
                rule.ItemLowerType).findIndex(val => val === itemtype.TypeId) > -1)
    );
export const selectLowerItemTypesForCurrentItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForCurrentIsUpperItemType,
        fromSelectMetaData.selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === connectionType.ConnTypeId).map(rule =>
                rule.ItemUpperType).findIndex(val => val === itemtype.TypeId) > -1)
    );

