import { KeyValue } from '@angular/common';
import { createSelector } from '@ngrx/store';
import { Guid, AttributeType, FullConfigurationItem, ConnectionRule, ConnectionType, ItemType, MetaDataSelectors } from 'backend-access';

import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

export const getMultiEditState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.multiEdit
);

export const selectIds = createSelector(getMultiEditState,
    (state: fromDisplay.MultiEditState) => state.selectedIds
);

export const selectItems = createSelector(getMultiEditState,
    (state: fromDisplay.MultiEditState) => state.selectedItems
);

export const selectAttributeTypesInItems = createSelector(selectItems, MetaDataSelectors.selectAttributeTypes,
    (items: FullConfigurationItem[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => items.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.id) > -1) > -1)
);

export const selectAttributeTypesNotInItems = createSelector(selectItems, MetaDataSelectors.selectAttributeTypes,
    (items: FullConfigurationItem[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => items.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.id) > -1) === -1)
);

export const selectAttributeValuesForAttributeType = createSelector(selectItems,
    (items: FullConfigurationItem[], attributeTypeId: string) =>
        [...new Set(items.map(item => item.attributes.find(att => att.id === attributeTypeId)).map(att => att.value))]
);

export const selectConnectionRulesToLowerInItems = createSelector(selectItems, MetaDataSelectors.selectConnectionRules,
    (items: FullConfigurationItem[], connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => items.findIndex(ci =>
            ci.connectionsToLower.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

export const selectConnectionRulesToUpperInItems = createSelector(selectItems, MetaDataSelectors.selectConnectionRules,
    (items: FullConfigurationItem[], connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => items.findIndex(ci =>
            ci.connectionsToUpper.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

export const selectResultListFullColumns = createSelector(
    selectAttributeTypesInItems, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, selectConnectionRulesToLowerInItems,
    selectConnectionRulesToUpperInItems,
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

