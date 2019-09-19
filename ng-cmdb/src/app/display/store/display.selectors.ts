import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { KeyValue } from '@angular/common';

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

export const selectAttributeGroupIdsForCurrentSearchItemType =
    createSelector(fromSelectMetaData.selectItemTypeAttributeGroupMappings, selectSearchItemType,
    (iagm: ItemTypeAttributeGroupMapping[], itemType: ItemType) =>
        iagm.filter(m => !itemType || m.ItemTypeId === itemType.TypeId).map(a => a.GroupId)
    );

export const selectAttributeTypesForCurrentSearchItemType =
    createSelector(selectAttributeGroupIdsForCurrentSearchItemType, fromSelectMetaData.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1)
    );

export const selectSearchAvailableSearchAttributeTypes =
    createSelector(selectSearchUsedAttributeTypes, selectAttributeTypesForCurrentSearchItemType,
        (usedAttributeTypes, availableAttributeTypes) =>
        availableAttributeTypes.filter(at => usedAttributeTypes.findIndex(ua => ua === at.TypeId) < 0)
    );

export const selectConnectionRulesForCurrentIsUpperSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectSearchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemUpperType === itemType.TypeId));
export const selectConnectionRulesForCurrentIsLowerSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectSearchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemLowerType === itemType.TypeId));

export const selectConnectionTypesForCurrentIsUpperSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionTypes, selectConnectionRulesForCurrentIsUpperSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1));
export const selectConnectionTypesForCurrentIsLowerSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionTypes, selectConnectionRulesForCurrentIsLowerSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1));

export const selectUpperItemTypesForCurrentSearchItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForCurrentIsLowerSearchItemType,
        fromSelectMetaData.selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === connectionType.ConnTypeId).map(rule =>
                rule.ItemUpperType).findIndex(val => val === itemtype.TypeId) > -1)
    );
export const selectLowerItemTypesForCurrentSearchItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForCurrentIsUpperSearchItemType,
        fromSelectMetaData.selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === connectionType.ConnTypeId).map(rule =>
                rule.ItemLowerType).findIndex(val => val === itemtype.TypeId) > -1)
    );

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

export const selectConnectionTypeGroupsToLower = createSelector(
    selectDisplayConfigurationItem,
    (item: FullConfigurationItem) => item && item.connectionsToLower ?
    [...new Set(item.connectionsToLower.map(c => c.typeId))] : []
);

export const selectConnectionTypeGroupsToUpper = createSelector(
    selectDisplayConfigurationItem,
    (item: FullConfigurationItem) => item && item.connectionsToUpper ?
    [...new Set(item.connectionsToUpper.map(c => c.typeId))] : []
);

export const selectConnectionTypesToLower = createSelector(
    selectConnectionTypeGroupsToLower, fromSelectMetaData.selectConnectionTypes,
    (typeIds: Guid[], connectionTypes: ConnectionType[]) => connectionTypes.filter(ct => typeIds.indexOf(ct.ConnTypeId) > -1)
)

export const selectConnectionRuleIdsToLowerByType = createSelector(selectDisplayConfigurationItem,
    (item: FullConfigurationItem, connTypeId: Guid) =>
    [...new Set(item.connectionsToLower.filter(c => c.typeId === connTypeId).map(r => r.ruleId))]
);

export const selectConnectionRuleIdsToUpperByType = createSelector(selectDisplayConfigurationItem,
    (item: FullConfigurationItem, connTypeId: Guid) =>
    [...new Set(item.connectionsToUpper.filter(c => c.typeId === connTypeId).map(r => r.ruleId))]
);

export const selectConnectionsCount = createSelector(selectDisplayConfigurationItem,
    (item: FullConfigurationItem) => item.connectionsToLower.length + item.connectionsToUpper.length
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
