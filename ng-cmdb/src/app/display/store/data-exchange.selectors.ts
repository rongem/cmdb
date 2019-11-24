import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KeyValue } from '@angular/common';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { Guid } from 'src/app/shared/guid';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';

export const getImportState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.import
);

export const selectImportItemTypeId = createSelector(
    getImportState, (state: fromDisplay.ImportState) => state.itemTypeId
);

export const selectImportItemType = createSelector(
    fromSelectMetaData.selectItemTypes, getImportState,
    (itemTypes: ItemType[], state: fromDisplay.ImportState) =>
        itemTypes.find(t => t.TypeId === state.itemTypeId)
);

export const selectAttributeGroupIdsForItemTypeId = createSelector(
    fromSelectMetaData.selectItemTypeAttributeGroupMappings, selectImportItemTypeId,
    (iagm: ItemTypeAttributeGroupMapping[], itemTypeId: Guid) =>
        iagm.filter(m => m.ItemTypeId === itemTypeId).map(a => a.GroupId)
);

export const selectAttributeTypesForItemType = createSelector(
    selectAttributeGroupIdsForItemTypeId, fromSelectMetaData.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1)
);

export const selectConnectionRulesForUpperItemType = createSelector(
    fromSelectMetaData.selectConnectionRules, selectImportItemTypeId,
    (connectionRules: ConnectionRule[], itemTypeId: Guid) =>
    connectionRules.filter(cr => cr.ItemUpperType === itemTypeId)
);

export const selectConnectionRulesForLowerItemType = createSelector(
    fromSelectMetaData.selectConnectionRules, selectImportItemTypeId,
    (connectionRules: ConnectionRule[], itemTypeId: Guid) =>
    connectionRules.filter(cr => cr.ItemLowerType === itemTypeId)
);

export const selectTargetColumns = createSelector(
    selectAttributeTypesForItemType, fromSelectMetaData.selectConnectionTypes,
    fromSelectMetaData.selectItemTypes, selectConnectionRulesForUpperItemType,
    selectConnectionRulesForLowerItemType,
    (attributeTypes: AttributeType[], connectionTypes: ConnectionType[],
     itemTypes: ItemType[], connectionRulesToLower: ConnectionRule[],
     connectionRulesToUpper: ConnectionRule[]) => {
        const array: KeyValue<string, string>[] = [];
        array.push({key: '<ignore>', value: '<ignore>'});
        array.push({key: 'name', value: 'Name'});
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

