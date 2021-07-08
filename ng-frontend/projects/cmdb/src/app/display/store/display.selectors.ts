import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';
import { ItemType, AttributeType, ConnectionRule, ConnectionType, FullConfigurationItem,
    MetaDataSelectors, AttributeGroup, LogSelectors } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromDisplay from './display.reducer';

export const getDisplayState = createFeatureSelector<fromDisplay.State>(fromApp.DISPLAY);

export const getItemState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.configurationItem);
export const getResultState =  createSelector(getDisplayState,
    (state: fromDisplay.State) => state.result);
export const getSearchState = createSelector(getDisplayState,
    (state: fromDisplay.State) => state.search);

export const selectDisplayConfigurationItem = createSelector(getItemState, state => state.fullConfigurationItem);

// if item is selected, return its attribute group ids, otherwise return all attribute group ids
export const selectAttributeGroupIdsForCurrentDisplayItemType = createSelector(MetaDataSelectors.selectItemTypes, MetaDataSelectors.selectAttributeGroups,
    selectDisplayConfigurationItem,
    (itemTypes: ItemType[], attributeGroups: AttributeGroup[], item: FullConfigurationItem) => !!item ?
        [...new Set(itemTypes.find(it => it.id === item.typeId).attributeGroups?.map(ag => ag.id))] ?? [] :
        attributeGroups.map(ag => ag.id)
);

export const selectAttributeTypesForCurrentDisplayItemType =
    createSelector(selectAttributeGroupIdsForCurrentDisplayItemType, MetaDataSelectors.selectAttributeTypes,
        (groupIds: string[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.attributeGroupId) > -1)
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
    selectDisplayConfigurationItem, MetaDataSelectors.selectConnectionRules, MetaDataSelectors.selectConnectionTypes,
    (item: FullConfigurationItem, connectionRules: ConnectionRule[], connectionTypes: ConnectionType[]) =>
    connectionTypes.filter(ct => [...new Set(connectionRules.filter(r => item && r.upperItemTypeId === item.typeId).map(cr =>
        cr.connectionTypeId))].indexOf(ct.id) > -1)
);

export const selectConnectionTypesToLower = createSelector(selectUsedConnectionTypeGroupsToLower, MetaDataSelectors.selectConnectionTypes,
    (typeIds: string[], connectionTypes: ConnectionType[]) => connectionTypes.filter(ct => typeIds.indexOf(ct.id) > -1)
);

export const selectUsedConnectionRuleIdsToLowerByType = (connTypeId: string) => createSelector(selectDisplayConfigurationItem, item =>
    !!item && item.connectionsToLower ? [...new Set(item.connectionsToLower.filter(c => c.typeId === connTypeId).map(r => r.ruleId))] : []
);

export const selectUsedConnectionRuleIdsToUpperByType = (connTypeId: string) => createSelector(selectDisplayConfigurationItem, item =>
    !!item && item.connectionsToUpper ? [...new Set(item.connectionsToUpper.filter(c => c.typeId === connTypeId).map(r => r.ruleId))] : []
);

export const selectAvailableConnectionRulesToLowerByType = (connTypeId: string) => createSelector(
    selectDisplayConfigurationItem, MetaDataSelectors.selectConnectionRules,
    (item: FullConfigurationItem, connectionRules: ConnectionRule[]) =>
    connectionRules.filter((value) => item && value.upperItemTypeId === item.typeId && value.connectionTypeId === connTypeId)
);

export const selectAvailableConnectionRulesToUpperByType = (connTypeId: string) => createSelector(
    selectDisplayConfigurationItem, MetaDataSelectors.selectConnectionRules,
    (item: FullConfigurationItem, connectionRules: ConnectionRule[]) =>
    connectionRules.filter((value) => value.lowerItemTypeId === item.typeId && value.connectionTypeId === connTypeId)
);

export const selectConnectionsCount = createSelector(selectDisplayConfigurationItem,
    (item: FullConfigurationItem) => item.connectionsToLower.length + item.connectionsToUpper.length
);

export const selectResultList = createSelector(getResultState,
    (state: fromDisplay.ResultState) => state.resultList
);

export const selectResultListPresent = createSelector(getResultState,
    (state: fromDisplay.ResultState) => state.resultListPresent
);

export const selectItemTypesInResults = createSelector(getResultState, MetaDataSelectors.selectItemTypes,
    (state: fromDisplay.ResultState, itemTypes: ItemType[]) =>
        itemTypes.filter(it => state.resultList.findIndex(ci => ci.typeId === it.id) > -1)
);

export const selectAttributeTypesInResults = createSelector(getResultState, MetaDataSelectors.selectAttributeTypes,
    (state: fromDisplay.ResultState, attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => state.resultList.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.id) > -1) > -1)
);

export const selectConnectionRulesToLowerInResults = createSelector(getResultState, MetaDataSelectors.selectConnectionRules,
    (state: fromDisplay.ResultState, connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => state.resultList.findIndex(ci =>
            ci.connectionsToLower.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

export const selectConnectionRulesToUpperInResults = createSelector(getResultState, MetaDataSelectors.selectConnectionRules,
    (state: fromDisplay.ResultState, connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => state.resultList.findIndex(ci =>
            ci.connectionsToUpper.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

export const selectResultListFullColumns = createSelector(
    selectAttributeTypesInResults, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, selectConnectionRulesToLowerInResults,
    selectConnectionRulesToUpperInResults,
    (attributeTypes: AttributeType[], connectionTypes: ConnectionType[],
     itemTypes: ItemType[], connectionRulesToLower: ConnectionRule[], connectionRulesToUpper: ConnectionRule[]) => {
        const array: KeyValue<string, string>[] = [];
        attributeTypes.forEach(at => array.push({key: 'a:' + at.id, value: at.name}));
        connectionRulesToLower.forEach(cr => array.push({key: 'ctl:' + cr.id, value:
            connectionTypes.find(c => c.id === cr.connectionTypeId).name + ' ' +
            itemTypes.find(i => i.id === cr.lowerItemTypeId).name}));
        connectionRulesToUpper.forEach(cr => array.push({key: 'ctu:' + cr.id, value:
            connectionTypes.find(c => c.id === cr.connectionTypeId).reverseName + ' ' +
            itemTypes.find(i => i.id === cr.upperItemTypeId).name}));
        return array;
    }
);

export const selectUserIsResponsible = createSelector(
    selectDisplayConfigurationItem, MetaDataSelectors.selectUserName,
    (item: FullConfigurationItem, user: string) =>
        item.responsibleUsers.findIndex(r => r.toLocaleLowerCase() === user.toLocaleLowerCase()) > -1
);

export const selectGraphItemsByLevel = (level: number) => createSelector(getItemState,
    (state: fromDisplay.ConfigurationItemState) => (state.graphItems.filter(item => item.level === level))
);

export const selectGraphItems = (itemIds: string[]) => createSelector(getItemState,
    (state: fromDisplay.ConfigurationItemState, ) => (state.graphItems.filter(item => itemIds.includes(item.id)))
);

export const selectGraphItem = (id: string) => createSelector(getItemState,
    (state: fromDisplay.ConfigurationItemState) => (state.graphItems.find(item => item.id === id))
);

export const selectGraphItemLevels = createSelector(getItemState,
    (state: fromDisplay.ConfigurationItemState): number[] => [...new Set(state.graphItems.map(item => item.level))].sort()
);

export const selectGraphItemMaxLevel = createSelector(selectGraphItemLevels,
    (levels) => levels[levels.length - 1]
);

export const selectGraphItemMinLevel = createSelector(selectGraphItemLevels,
    (levels) => levels[0]
);

export const selectGraphItemsToExpandAbove = createSelector(getItemState, selectGraphItemMaxLevel,
    (state, level): string[] =>
        [...new Set([].concat(...state.graphItems.filter(item => item.level === level).map(item => item.itemIdsAbove)))]
);

export const selectGraphItemsToExpandBelow = createSelector(getItemState, selectGraphItemMinLevel,
    (state, level): string[] =>
        [...new Set([].concat(...state.graphItems.filter(item => item.level === level).map(item => item.itemIdsBelow)))]
);

export const selectProcessedItemIds = createSelector(getItemState, (state) => state.processedItems);

export const selectVisibleComponent = createSelector(getDisplayState, (state) => state.visibleComponent);

export const selectLoggedItems = createSelector(selectResultList, LogSelectors.selectLogItemIds, (configurationItems, itemIds) =>
    configurationItems.filter(i => itemIds.includes(i.id))
);
