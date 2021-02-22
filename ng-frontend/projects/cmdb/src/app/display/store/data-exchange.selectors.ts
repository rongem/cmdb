import { createSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';
import { ItemType, AttributeType, ConnectionRule, ConnectionType, MetaDataSelectors } from 'backend-access';

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
        itemTypes.find(t => t.id === state.itemTypeId)
);

export const selectAttributeGroupIdsForItemTypeId = createSelector(
    MetaDataSelectors.selectItemTypes, selectImportItemTypeId,
    (itemTypes: ItemType[], itemTypeId: string) =>
        itemTypes.find(i => i.id === itemTypeId)?.attributeGroups?.map(ag => ag.id) ?? []
);

export const selectAttributeTypesForItemType = createSelector(
    selectAttributeGroupIdsForItemTypeId, MetaDataSelectors.selectAttributeTypes,
        (groupIds: string[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.attributeGroupId) > -1)
);

export const selectConnectionRulesForUpperItemType = createSelector(
    MetaDataSelectors.selectConnectionRules, selectImportItemTypeId,
    (connectionRules: ConnectionRule[], itemTypeId: string) =>
    connectionRules.filter(cr => cr.upperItemTypeId === itemTypeId)
);

export const selectConnectionRulesForLowerItemType = createSelector(
    MetaDataSelectors.selectConnectionRules, selectImportItemTypeId,
    (connectionRules: ConnectionRule[], itemTypeId: string) =>
    connectionRules.filter(cr => cr.lowerItemTypeId === itemTypeId)
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
            attributeTypes.forEach(at => array.push({key: 'a:' + at.id, value: at.name}));
        }
        if (state.elements.includes('connToLower')) {
            connectionRulesToLower.forEach(cr => array.push({key: 'ctl:' + cr.id, value:
                connectionTypes.find(c => c.id === cr.connectionTypeId).name + ' ' +
                itemTypes.find(i => i.id === cr.lowerItemTypeId).name}));
        }
        if (state.elements.includes('connToUpper')) {
            connectionRulesToUpper.forEach(cr => array.push({key: 'ctu:' + cr.id, value:
                connectionTypes.find(c => c.id === cr.connectionTypeId).reverseName + ' ' +
                itemTypes.find(i => i.id === cr.upperItemTypeId).name}));
        }
        if (state.elements.includes('links')) {
            array.push({key: 'linkaddress', value: 'Link'});
            array.push({key: 'linkdescription', value: 'Link description'});
        }
        return array;
    }
);

