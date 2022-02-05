import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';
import { MetaDataSelectors } from 'backend-access';
import { State } from './import.reducer';
import { IMPORT } from '../store.constants';

export const getImportState =  createFeatureSelector<State>(IMPORT);

export const itemTypeId = createSelector(getImportState, state => state.itemTypeId);
export const itemType = createSelector(MetaDataSelectors.selectItemTypes, itemTypeId, (itemTypes, id) => itemTypes.find(t => t.id === id));

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
export const selectTargetColumns = createSelector(getImportState, selectAttributeTypesForItemType, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, selectConnectionRulesForUpperItemType, selectConnectionRulesForLowerItemType,
    (state, attributeTypes, connectionTypes, itemTypes, connectionRulesToLower, connectionRulesToUpper) => {
        const array: KeyValue<string, string>[] = [];
        array.push({key: '<ignore>', value: '<ignore>'});
        array.push({key: 'name', value: 'Name'});
        if (state.attributes) {
            attributeTypes.forEach(at => array.push({key: 'a:' + at.id, value: at.name}));
        }
        if (state.connectionsToLower) {
            connectionRulesToLower.forEach(cr => array.push({key: 'ctl:' + cr.id, value:
                connectionTypes.find(c => c.id === cr.connectionTypeId).name + ' ' +
                itemTypes.find(i => i.id === cr.lowerItemTypeId).name}));
        }
        if (state.connectionsToUpper) {
            connectionRulesToUpper.forEach(cr => array.push({key: 'ctu:' + cr.id, value:
                connectionTypes.find(c => c.id === cr.connectionTypeId).reverseName + ' ' +
                itemTypes.find(i => i.id === cr.upperItemTypeId).name}));
        }
        if (state.links) {
            array.push({key: 'linkaddress', value: 'Link'});
            array.push({key: 'linkdescription', value: 'Link description'});
        }
        return array;
    }
);

