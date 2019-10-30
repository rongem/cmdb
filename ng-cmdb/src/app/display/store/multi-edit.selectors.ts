import { KeyValue } from '@angular/common';
import { createSelector } from '@ngrx/store';

import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';

export const getMultiEditState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.multiEdit
);

export const selectIds = createSelector(getMultiEditState,
    (state: fromDisplay.MultiEditState) => state.selectedIds
);

export const selectItems = createSelector(getMultiEditState,
    (state: fromDisplay.MultiEditState) => state.selectedItems
);

export const selectAttributeTypesInItems = createSelector(selectItems, fromSelectMetaData.selectAttributeTypes,
    (items: FullConfigurationItem[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => items.findIndex(ci => ci.attributes.findIndex(a => a.typeId === at.TypeId) > -1) > -1)
);

export const selectConnectionRulesToLowerInItems = createSelector(selectItems, fromSelectMetaData.selectConnectionRules,
    (items: FullConfigurationItem[], connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => items.findIndex(ci =>
            ci.connectionsToLower.findIndex(c => c.ruleId === cr.RuleId) > -1) > -1)
);

export const selectConnectionRulesToUpperInItems = createSelector(selectItems, fromSelectMetaData.selectConnectionRules,
    (items: FullConfigurationItem[], connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => items.findIndex(ci =>
            ci.connectionsToUpper.findIndex(c => c.ruleId === cr.RuleId) > -1) > -1)
);

export const selectResultListFullColumns = createSelector(
    selectAttributeTypesInItems, fromSelectMetaData.selectConnectionTypes,
    fromSelectMetaData.selectItemTypes, selectConnectionRulesToLowerInItems,
    selectConnectionRulesToUpperInItems,
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
