import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';
import { Guid, ItemTypeAttributeGroupMapping, ItemType, AttributeType, ConnectionRule, ConnectionType, MetaDataSelectors } from 'backend-access';

import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

export const getImportState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.import
);

export const selectImportItemTypeId = createSelector(
    getImportState, (state: fromDisplay.ImportState) => state.itemTypeId
);

export const selectImportItemType = createSelector(
    MetaDataSelectors.selectItemTypes, getImportState,
    (itemTypes: ItemType[], state: fromDisplay.ImportState) =>
        itemTypes.find(t => t.TypeId === state.itemTypeId)
);

export const selectAttributeGroupIdsForItemTypeId = createSelector(
    MetaDataSelectors.selectItemTypeAttributeGroupMappings, selectImportItemTypeId,
    (iagm: ItemTypeAttributeGroupMapping[], itemTypeId: Guid) =>
        iagm.filter(m => m.ItemTypeId === itemTypeId).map(a => a.GroupId)
);

export const selectAttributeTypesForItemType = createSelector(
    selectAttributeGroupIdsForItemTypeId, MetaDataSelectors.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1)
);

export const selectConnectionRulesForUpperItemType = createSelector(
    MetaDataSelectors.selectConnectionRules, selectImportItemTypeId,
    (connectionRules: ConnectionRule[], itemTypeId: Guid) =>
    connectionRules.filter(cr => cr.ItemUpperType === itemTypeId)
);

export const selectConnectionRulesForLowerItemType = createSelector(
    MetaDataSelectors.selectConnectionRules, selectImportItemTypeId,
    (connectionRules: ConnectionRule[], itemTypeId: Guid) =>
    connectionRules.filter(cr => cr.ItemLowerType === itemTypeId)
);

export const selectTargetColumns = createSelector(
    getImportState, selectAttributeTypesForItemType, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, selectConnectionRulesForUpperItemType,
    selectConnectionRulesForLowerItemType,
    (state: fromDisplay.ImportState, attributeTypes: AttributeType[],
     connectionTypes: ConnectionType[], itemTypes: ItemType[],
     connectionRulesToLower: ConnectionRule[],
     connectionRulesToUpper: ConnectionRule[]) => {
        const array: KeyValue<string, string>[] = [];
        array.push({key: '<ignore>', value: '<ignore>'});
        array.push({key: 'name', value: 'Name'});
        if (state.elements.includes('attributes')) {
            attributeTypes.forEach(at => array.push({key: 'a:' + at.TypeId, value: at.TypeName}));
        }
        if (state.elements.includes('connToLower')) {
            connectionRulesToLower.forEach(cr => array.push({key: 'ctl:' + cr.RuleId, value:
                connectionTypes.find(c => c.ConnTypeId === cr.ConnType).ConnTypeName + ' ' +
                itemTypes.find(i => i.TypeId === cr.ItemLowerType).TypeName}));
        }
        if (state.elements.includes('connToUpper')) {
            connectionRulesToUpper.forEach(cr => array.push({key: 'ctu:' + cr.RuleId, value:
                connectionTypes.find(c => c.ConnTypeId === cr.ConnType).ConnTypeReverseName + ' ' +
                itemTypes.find(i => i.TypeId === cr.ItemUpperType).TypeName}));
        }
        if (state.elements.includes('links')) {
            array.push({key: 'linkaddress', value: 'Link'});
            array.push({key: 'linkdescription', value: 'Link description'});
        }
        return array;
    }
);

