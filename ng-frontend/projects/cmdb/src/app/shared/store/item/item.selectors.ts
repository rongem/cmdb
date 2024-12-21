import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';
import { MetaDataSelectors } from 'backend-access';
import { ITEM } from '../store.constants';
import { State } from './item.reducer';

const itemState = createFeatureSelector<State>(ITEM);

export const configurationItem = createSelector(itemState, state => state.fullConfigurationItem);
export const graphItems = createSelector(itemState, state => state.graphItems);
export const processedItemIds = createSelector(itemState, state => state.processedItems);
export const itemReady = createSelector(itemState, state => state.itemReady);
export const resultList = createSelector(itemState, state => state.resultList);
export const resultListPresent = createSelector(itemState, state => state.resultListPresent);
export const resultListFailed = createSelector(itemState, state => !(state.resultListPresent || state.resultListLoading));

// if item is selected, return its attribute group ids, otherwise return all attribute group ids
const attributeGroupIdsForCurrentDisplayItemType = createSelector(MetaDataSelectors.selectItemTypes, MetaDataSelectors.selectAttributeGroups, configurationItem,
    (itemTypes, attributeGroups, item) =>
        !!item ? [...new Set(itemTypes.find(it => it.id === item.typeId).attributeGroups?.map(ag => ag.id))] : attributeGroups.map(ag => ag.id)
);

// Extract all attribute types that are available for the currently selected item's type
export const attributeTypesForCurrentDisplayItemType = createSelector(attributeGroupIdsForCurrentDisplayItemType, MetaDataSelectors.selectAttributeTypes,
    (groupIds, attributeTypes) => attributeTypes.filter(at => groupIds.indexOf(at.attributeGroupId) > -1)
);

// Extract all existing connection types from connections to lower items
export const usedConnectionTypeGroupsToLower = createSelector(configurationItem, item => item && item.connectionsToLower ?
    [...new Set(item.connectionsToLower.map(c => c.typeId))] : []
);
// Extract all existing connection types from connections to upper items
export const usedConnectionTypeGroupsToUpper = createSelector(configurationItem, item => item && item.connectionsToLower ?
    [...new Set(item.connectionsToUpper.map(c => c.typeId))] : []
);
// Extract all available connection types from connections to upper items
export const availableConnectionTypeGroupsToLower = createSelector(
    configurationItem, MetaDataSelectors.selectConnectionRules, MetaDataSelectors.selectConnectionTypes,
    (item, connectionRules, connectionTypes) =>
    connectionTypes.filter(ct => [...new Set(connectionRules.filter(r => item && r.upperItemTypeId === item.typeId).map(cr =>
        cr.connectionTypeId))].indexOf(ct.id) > -1)
);
// Extract all existing connection rule ids from connections to lower items
export const usedConnectionRuleIdsToLowerByType = (connTypeId: string) => createSelector(configurationItem, item =>
    !!item && item.connectionsToLower ? [...new Set(item.connectionsToLower.filter(c => c.typeId === connTypeId).map(r => r.ruleId))] : []
);
// Extract all existing connection rule ids from connections to upper items
export const usedConnectionRuleIdsToUpperByType = (connTypeId: string) => createSelector(configurationItem, item =>
    !!item && item.connectionsToUpper ? [...new Set(item.connectionsToUpper.filter(c => c.typeId === connTypeId).map(r => r.ruleId))] : []
);
// Extract all available connection rules from connections to lower items
export const availableConnectionRulesToLowerByType = (connTypeId: string) => createSelector(configurationItem, MetaDataSelectors.selectConnectionRules,
    (item, connectionRules) => connectionRules.filter((value) => item && value.upperItemTypeId === item.typeId && value.connectionTypeId === connTypeId)
);
// Count all connections to upper an to lower for current item
export const connectionsCount = createSelector(configurationItem, item => item.connectionsToLower.length + item.connectionsToUpper.length);

// Result selectors
// Get all item types present in result list
export const itemTypesInResults = createSelector(resultList, MetaDataSelectors.selectItemTypes,
    (results, itemTypes) => itemTypes.filter(it => results.findIndex(ci => ci.typeId === it.id) > -1)
);

// Get all attribute types present in result list
const attributeTypesInResults = createSelector(resultList, MetaDataSelectors.selectAttributeTypes, (results, attributeTypes) =>
    attributeTypes.filter(at => results.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.id) > -1) > -1)
);

// Get all connection rules to lower present in result list
const connectionRulesToLowerInResults = createSelector(resultList, MetaDataSelectors.selectConnectionRules, (results, connectionRules) =>
    connectionRules.filter(cr => results.findIndex(ci => ci.connectionsToLower.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

// Get all connection rules to upper present in result list
const connectionRulesToUpperInResults = createSelector(resultList, MetaDataSelectors.selectConnectionRules, (results, connectionRules) =>
    connectionRules.filter(cr => results.findIndex(ci => ci.connectionsToUpper.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

// Get all parts of the result list items in a table style manner
export const resultListFullColumns = createSelector(attributeTypesInResults, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, connectionRulesToLowerInResults, connectionRulesToUpperInResults,
    (attributeTypes, connectionTypes, itemTypes, connectionRulesToLower, connectionRulesToUpper) => {
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

// Check if current user is in the list of responsible users for the item
export const userIsResponsible = createSelector(configurationItem, MetaDataSelectors.selectUserName, (item, user) =>
    item.responsibleUsers.findIndex(r => r.toLocaleLowerCase() === user.toLocaleLowerCase()) > -1
);

// Export graphical items with given ids
export const graphItemsByIds = (itemIds: string[]) => createSelector(graphItems, items => items.filter(item => itemIds.includes(item.id)));

// Export single graphical item (i.e. an item extended for graphical view)
export const graphItem = (id: string) => createSelector(graphItems, items => items.find(item => item.id === id));

