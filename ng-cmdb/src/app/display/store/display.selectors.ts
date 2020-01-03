import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { Guid } from 'src/app/shared/guid';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

export const getDisplayState = createFeatureSelector<fromDisplay.State>(fromApp.DISPLAY);

export const getItemState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.configurationItem);
export const getResultState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.result);

export const selectDisplayConfigurationItem = createSelector(getItemState, state => state.fullConfigurationItem);

export const selectAttributeGroupIdsForCurrentDisplayItemType =
    createSelector(fromSelectMetaData.selectItemTypeAttributeGroupMappings, selectDisplayConfigurationItem,
    (iagm: ItemTypeAttributeGroupMapping[], item: FullConfigurationItem) =>
        iagm.filter(m => !item || m.ItemTypeId === item.typeId).map(a => a.GroupId)
    );

export const selectAttributeTypesForCurrentDisplayItemType =
    createSelector(selectAttributeGroupIdsForCurrentDisplayItemType, fromSelectMetaData.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1)
    );

export const selectUsedConnectionTypeGroupsToLower = createSelector(
    selectDisplayConfigurationItem,
    (item: FullConfigurationItem) => item && item.connectionsToLower ?
    [...new Set(item.connectionsToLower.map(c => c.typeId))] : []
);

export const selectUsedConnectionTypeGroupsToUpper = createSelector(
    selectDisplayConfigurationItem,
    (item: FullConfigurationItem) => item && item.connectionsToUpper ?
    [...new Set(item.connectionsToUpper.map(c => c.typeId))] : []
);

export const selectAvailableConnectionTypeGroupsToLower = createSelector(
    selectDisplayConfigurationItem, fromSelectMetaData.selectConnectionRules, fromSelectMetaData.selectConnectionTypes,
    (item: FullConfigurationItem, connectionRules: ConnectionRule[], connectionTypes: ConnectionType[]) =>
    connectionTypes.filter(ct => [...new Set(connectionRules.filter(r => item && r.ItemUpperType === item.typeId).map(cr =>
        cr.ConnType))].indexOf(ct.ConnTypeId) > -1)
);

export const selectConnectionTypesToLower = createSelector(
    selectUsedConnectionTypeGroupsToLower, fromSelectMetaData.selectConnectionTypes,
    (typeIds: Guid[], connectionTypes: ConnectionType[]) => connectionTypes.filter(ct => typeIds.indexOf(ct.ConnTypeId) > -1)
);

export const selectUsedConnectionRuleIdsToLowerByType = createSelector(selectDisplayConfigurationItem,
    (item: FullConfigurationItem, connTypeId: Guid) => !!item && item.connectionsToLower ?
    [...new Set(item.connectionsToLower.filter(c => c.typeId === connTypeId).map(r => r.ruleId))] : []
);

export const selectUsedConnectionRuleIdsToUpperByType = createSelector(selectDisplayConfigurationItem,
    (item: FullConfigurationItem, connTypeId: Guid) => !!item && item.connectionsToUpper ?
    [...new Set(item.connectionsToUpper.filter(c => c.typeId === connTypeId).map(r => r.ruleId))] : []
);

export const selectAvailableConnectionRulesToLowerByType = createSelector(
    selectDisplayConfigurationItem, fromSelectMetaData.selectConnectionRules,
    (item: FullConfigurationItem, connectionRules: ConnectionRule[], connTypeId: Guid) =>
    connectionRules.filter((value) => item && value.ItemUpperType === item.typeId && value.ConnType === connTypeId)
);

export const selectAvailableConnectionRulesToUpperByType = createSelector(
    selectDisplayConfigurationItem, fromSelectMetaData.selectConnectionRules,
    (item: FullConfigurationItem, connectionRules: ConnectionRule[], connTypeId: Guid) =>
    connectionRules.filter((value) => value.ItemLowerType === item.typeId && value.ConnType === connTypeId)
);

export const selectConnectionsCount = createSelector(selectDisplayConfigurationItem,
    (item: FullConfigurationItem) => item.connectionsToLower.length + item.connectionsToUpper.length
);

export const selectResultListFull = createSelector(getResultState,
    (state: fromDisplay.ResultState) => state.resultListFull
);

export const selectItemTypesInResults = createSelector(getResultState, fromSelectMetaData.selectItemTypes,
    (state: fromDisplay.ResultState, itemTypes: ItemType[]) =>
        itemTypes.filter(it => state.resultList.findIndex(ci => ci.ItemType === it.TypeId) > -1)
);

export const selectAttributeTypesInResults = createSelector(getResultState, fromSelectMetaData.selectAttributeTypes,
    (state: fromDisplay.ResultState, attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => state.resultListFull.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.TypeId) > -1) > -1)
);

export const selectConnectionRulesToLowerInResults = createSelector(getResultState, fromSelectMetaData.selectConnectionRules,
    (state: fromDisplay.ResultState, connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => state.resultListFull.findIndex(ci =>
            ci.connectionsToLower.findIndex(c => c.ruleId === cr.RuleId) > -1) > -1)
);

export const selectConnectionRulesToUpperInResults = createSelector(getResultState, fromSelectMetaData.selectConnectionRules,
    (state: fromDisplay.ResultState, connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => state.resultListFull.findIndex(ci =>
            ci.connectionsToUpper.findIndex(c => c.ruleId === cr.RuleId) > -1) > -1)
);

export const selectResultListFullColumns = createSelector(
    selectAttributeTypesInResults, fromSelectMetaData.selectConnectionTypes,
    fromSelectMetaData.selectItemTypes, selectConnectionRulesToLowerInResults,
    selectConnectionRulesToUpperInResults,
    (attributeTypes: AttributeType[], connectionTypes: ConnectionType[],
     itemTypes: ItemType[], connectionRulesToLower: ConnectionRule[], connectionRulesToUpper: ConnectionRule[]) => {
        const array: KeyValue<string, string>[] = [];
        attributeTypes.forEach(at => array.push({key: 'a:' + at.TypeId, value: at.TypeName}));
        connectionRulesToLower.forEach(cr => array.push({key: 'ctl:' + cr.RuleId, value:
            connectionTypes.find(c => c.ConnTypeId === cr.ConnType).ConnTypeName + ' ' +
            itemTypes.find(i => i.TypeId === cr.ItemLowerType).TypeName}));
        connectionRulesToUpper.forEach(cr => array.push({key: 'ctu:' + cr.RuleId, value:
            connectionTypes.find(c => c.ConnTypeId === cr.ConnType).ConnTypeReverseName + ' ' +
            itemTypes.find(i => i.TypeId === cr.ItemUpperType).TypeName}));
        return array;
    }
);

export const selectUserIsResponsible = createSelector(
    selectDisplayConfigurationItem, fromSelectMetaData.selectUserName,
    (item: FullConfigurationItem, user: string) =>
        item.responsibilities.findIndex(r => r.account.toLocaleLowerCase() === user.toLocaleLowerCase()) > -1
);

export const selectGraphItemsByLevel = createSelector(
    getItemState,
    (state: fromDisplay.ConfigurationItemState, level: number) => (state.graphItems.filter(item => item.level === level))
);

export const selectGraphItem = createSelector(
    getItemState,
    (state: fromDisplay.ConfigurationItemState, id: Guid) => (state.graphItems.find(item => item.id === id))
);

export const selectGraphItemLevels = createSelector(
    getItemState,
    (state: fromDisplay.ConfigurationItemState): number[] => {
        return [...new Set(state.graphItems.map(item => item.level))].sort();
    }
);

export const selectGraphItemMaxLevel = createSelector(
    selectGraphItemLevels,
    (levels) => levels[levels.length - 1]
);

export const selectGraphItemMinLevel = createSelector(
    selectGraphItemLevels,
    (levels) => levels[0]
);

export const selectGraphItemsToExpandAbove = createSelector(
    getItemState, selectGraphItemMaxLevel,
    (state, level): Guid[] =>
        [...new Set([].concat(...state.graphItems.filter(item => item.level === level).map(item => item.itemIdsAbove)))]
);

export const selectGraphItemsToExpandBelow = createSelector(
    getItemState, selectGraphItemMinLevel,
    (state, level): Guid[] =>
        [...new Set([].concat(...state.graphItems.filter(item => item.level === level).map(item => item.itemIdsBelow)))]
);

export const selectProcessedItemIds = createSelector(
    getItemState,
    (state) => state.processedItems
);
