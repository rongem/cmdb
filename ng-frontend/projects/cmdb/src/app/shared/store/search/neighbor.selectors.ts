import { KeyValue } from '@angular/common';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AttributeType, ConnectionRule, ConnectionType, ItemType, MetaDataSelectors } from 'backend-access';
import { NEIGHBOR } from '../app.reducer';

import { State } from './neighbor.reducer';

const getState = createFeatureSelector<State>(NEIGHBOR);

export const form = createSelector(getState, state => state.form);
export const resultList = createSelector(getState, state => state.resultList);
export const resultListLoading = createSelector(getState, state => state.resultListFullLoading);
export const resultListPresent = createSelector(getState, state => state.resultListFullPresent);
export const searching = createSelector(getState, state => state.searching);
export const noSearchResult = createSelector(getState, state => state.noSearchResult);
export const resultListFailed = createSelector(getState, state => !(state.resultListFullLoading || state.resultListFullPresent));

export const selectAttributeTypesInResults = createSelector(resultList, MetaDataSelectors.selectAttributeTypes, (results, attributeTypes) =>
    attributeTypes.filter(at => results.findIndex(r => r.fullItem && r.fullItem.attributes.findIndex(a => a.typeId === at.id) > -1) > -1)
);

export const selectConnectionRulesToLowerInResults = createSelector(resultList, MetaDataSelectors.selectConnectionRules,
    (results, connectionRules) => connectionRules.filter(cr => results.findIndex(r =>
            r.fullItem && r.fullItem.connectionsToLower.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

export const selectConnectionRulesToUpperInResults = createSelector(resultList, MetaDataSelectors.selectConnectionRules,
    (results, connectionRules: ConnectionRule[]) => connectionRules.filter(cr => results.findIndex(r =>
            r.fullItem && r.fullItem.connectionsToUpper.findIndex(c => c.ruleId === cr.id) > -1) > -1)
);

export const selectResultListFullColumns = createSelector(
    selectAttributeTypesInResults, MetaDataSelectors.selectConnectionTypes,
    MetaDataSelectors.selectItemTypes, selectConnectionRulesToLowerInResults,
    selectConnectionRulesToUpperInResults,
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

