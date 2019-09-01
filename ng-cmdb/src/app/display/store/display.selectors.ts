import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

export const getDisplayState = createFeatureSelector<fromDisplay.State>(fromApp.DISPLAY);

export const getItemState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.configurationItem);
export const getSearchState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.search);
export const getResultState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.result);

export const selectSearchItemTypeId = createSelector(getSearchState,
    (state) => state.itemType);
export const selectSearchItemType = createSelector(selectSearchItemTypeId, fromSelectMetaData.selectItemTypes,
    (itemTypeId: Guid, itemTypes: ItemType[]) => itemTypes.find(it => it.TypeId === itemTypeId)
    );

export const selectSearchUsedAttributeTypes = createSelector(getSearchState,
    (state) => state.usedAttributeTypes
    );

export const selectAttributeGroupIdsForCurrentItemType =
    createSelector(fromSelectMetaData.selectItemTypeAttributeGroupMappings, selectSearchItemType,
    (iagm: ItemTypeAttributeGroupMapping[], itemType: ItemType) =>
        iagm.filter(m => !itemType || m.ItemTypeId === itemType.TypeId).map(a => a.GroupId)
    );

export const selectAttributeTypesForCurrentItemType =
    createSelector(selectAttributeGroupIdsForCurrentItemType, fromSelectMetaData.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1)
    );

export const selectSearchAvailableAttributeTypes =
    createSelector(selectSearchUsedAttributeTypes, selectAttributeTypesForCurrentItemType,
        (usedAttributeTypes, availableAttributeTypes) =>
        availableAttributeTypes.filter(at => usedAttributeTypes.findIndex(ua => ua === at.TypeId) < 0)
    );

export const selectConnectionRulesForCurrentIsUpperItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectSearchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemUpperType === itemType.TypeId));
export const selectConnectionRulesForCurrentIsLowerItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectSearchItemType,
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

export const selectConfigurationItem = createSelector(getItemState, state => state.fullConfigurationItem);

export const selectConnectionTypeGroupsToLower = createSelector(selectConfigurationItem,
    (item: FullConfigurationItem) =>
    [...new Set(item.connectionsToLower.map(c => c.typeId))]
);

export const selectConnectionTypeGroupsToUpper = createSelector(selectConfigurationItem,
    (item: FullConfigurationItem) =>
    [...new Set(item.connectionsToUpper.map(c => c.typeId))]
);

export const selectConnectionRuleIdsToLowerByType = createSelector(selectConfigurationItem,
    (item: FullConfigurationItem, connTypeId: Guid) =>
    [...new Set(item.connectionsToLower.filter(c => c.typeId === connTypeId).map(r => r.ruleId))]
);

export const selectConnectionRuleIdsToUpperByType = createSelector(selectConfigurationItem,
    (item: FullConfigurationItem, connTypeId: Guid) =>
    [...new Set(item.connectionsToUpper.filter(c => c.typeId === connTypeId).map(r => r.ruleId))]
);

export const selectConnectionsCount = createSelector(selectConfigurationItem,
    (item: FullConfigurationItem) => item.connectionsToLower.length + item.connectionsToUpper.length
);
