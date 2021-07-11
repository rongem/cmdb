import { KeyValue } from '@angular/common';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FullConfigurationItem, ConnectionRule, MetaDataSelectors } from 'backend-access';
import { MULTIEDIT } from '../app.reducer';

import { State } from './multi-edit.reducer';

const getMultiEditState =  createFeatureSelector<State>(MULTIEDIT);

export const selectedIds = createSelector(getMultiEditState, state => state.selectedIds);
export const selectedItems = createSelector(getMultiEditState, state => state.selectedItems);

// extract all attribute types that are used in an item typ
const selectAttributeTypesInItems = createSelector(selectedItems, MetaDataSelectors.selectAttributeTypes, (items, attributeTypes) =>
    attributeTypes.filter(at => items.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.id) > -1) > -1)
);

// const selectAttributeTypesNotInItems = createSelector(selectedItems, MetaDataSelectors.selectAttributeTypes, (items, attributeTypes) =>
//     attributeTypes.filter(at => items.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.id) > -1) === -1)
// );

// const selectAttributeValuesForAttributeType = (attributeTypeId: string) => createSelector(selectedItems, items =>
//     [...new Set(items.map(item => item.attributes.find(att => att.typeId === attributeTypeId)).map(att => att.value))]
// );

// extract all connection rules that fit to an upper item type
const selectConnectionRulesToLowerInItems = createSelector(selectedItems, MetaDataSelectors.selectConnectionRules,
    (items: FullConfigurationItem[], connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => items.findIndex(ci =>
            ci.connectionsToLower.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

// extract all connection rules that fit to a lower item type
const selectConnectionRulesToUpperInItems = createSelector(selectedItems, MetaDataSelectors.selectConnectionRules,
    (items: FullConfigurationItem[], connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => items.findIndex(ci =>
            ci.connectionsToUpper.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

// Convert items to table columns
export const selectResultListFullColumns = createSelector(selectAttributeTypesInItems, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, selectConnectionRulesToLowerInItems, selectConnectionRulesToUpperInItems,
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

