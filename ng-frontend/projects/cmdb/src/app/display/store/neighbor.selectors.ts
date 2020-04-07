import { KeyValue } from '@angular/common';
import { createSelector } from '@ngrx/store';
import { AttributeType, ConnectionRule, ConnectionType, ItemType } from 'backend-access';

import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

export const getState = createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.neighborSearch
);

export const selectAttributeTypesInResults = createSelector(getState, fromSelectMetaData.selectAttributeTypes,
    (state: fromDisplay.NeighborSearchState, attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => state.resultList.findIndex(r =>
            r.FullItem && r.FullItem.attributes.findIndex(a => a.typeId === at.TypeId) > -1) > -1)
);

export const selectConnectionRulesToLowerInResults = createSelector(getState, fromSelectMetaData.selectConnectionRules,
    (state: fromDisplay.NeighborSearchState, connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => state.resultList.findIndex(r =>
            r.FullItem && r.FullItem.connectionsToLower.findIndex(c => c.ruleId === cr.RuleId) > -1) > -1)
);

export const selectConnectionRulesToUpperInResults = createSelector(getState, fromSelectMetaData.selectConnectionRules,
    (state: fromDisplay.NeighborSearchState, connectionRules: ConnectionRule[]) =>
        connectionRules.filter(cr => state.resultList.findIndex(r =>
            r.FullItem && r.FullItem.connectionsToUpper.findIndex(c => c.ruleId === cr.RuleId) > -1) > -1)
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

