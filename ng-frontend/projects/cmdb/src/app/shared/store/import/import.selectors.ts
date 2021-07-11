import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';
import { MetaDataSelectors } from 'backend-access';
import { State } from './import.reducer';
import { IMPORT } from '../app.reducer';

export const getImportState =  createFeatureSelector<State>(IMPORT);

export const itemTypeId = createSelector(getImportState, state => state.itemTypeId);
export const itemType = createSelector(MetaDataSelectors.selectItemTypes, itemTypeId, (itemTypes, id) => itemTypes.find(t => t.id === id));
const elements = createSelector(getImportState, state => state.elements);

const attributeGroupIdsForItemTypeId = createSelector(itemType, t => t?.attributeGroups?.map(ag => ag.id) ?? []);

const selectAttributeTypesForItemType = createSelector(attributeGroupIdsForItemTypeId, MetaDataSelectors.selectAttributeTypes, (groupIds, attributeTypes) =>
    attributeTypes.filter(at => groupIds.includes(at.attributeGroupId))
);

const selectConnectionRulesForUpperItemType = createSelector(MetaDataSelectors.selectConnectionRules, itemTypeId, (connectionRules, id) =>
    connectionRules.filter(cr => cr.upperItemTypeId === id)
);

const selectConnectionRulesForLowerItemType = createSelector(MetaDataSelectors.selectConnectionRules, itemTypeId, (connectionRules, id) =>
    connectionRules.filter(cr => cr.lowerItemTypeId === id)
);

// Get Column names for import
export const selectTargetColumns = createSelector(elements, selectAttributeTypesForItemType, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, selectConnectionRulesForUpperItemType, selectConnectionRulesForLowerItemType,
    (el, attributeTypes, connectionTypes, itemTypes, connectionRulesToLower, connectionRulesToUpper) => {
        const array: KeyValue<string, string>[] = [];
        array.push({key: '<ignore>', value: '<ignore>'});
        array.push({key: 'name', value: 'Name'});
        if (el.includes('attributes')) {
            attributeTypes.forEach(at => array.push({key: 'a:' + at.id, value: at.name}));
        }
        if (el.includes('connToLower')) {
            connectionRulesToLower.forEach(cr => array.push({key: 'ctl:' + cr.id, value:
                connectionTypes.find(c => c.id === cr.connectionTypeId).name + ' ' +
                itemTypes.find(i => i.id === cr.lowerItemTypeId).name}));
        }
        if (el.includes('connToUpper')) {
            connectionRulesToUpper.forEach(cr => array.push({key: 'ctu:' + cr.id, value:
                connectionTypes.find(c => c.id === cr.connectionTypeId).reverseName + ' ' +
                itemTypes.find(i => i.id === cr.upperItemTypeId).name}));
        }
        if (el.includes('links')) {
            array.push({key: 'linkaddress', value: 'Link'});
            array.push({key: 'linkdescription', value: 'Link description'});
        }
        return array;
    }
);

