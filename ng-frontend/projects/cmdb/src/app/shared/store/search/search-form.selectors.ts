import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ItemType, AttributeType, ConnectionRule, ConnectionType, MetaDataSelectors, AttributeGroup } from 'backend-access';
import { State } from './search-form.reducer';
import { SEARCH } from '../store.constants';

const searchState =  createFeatureSelector<State>(SEARCH);

export const getForm = createSelector(searchState, state => state.form);
export const searching = createSelector(searchState, state => state.searching);
export const noSearchResult = createSelector(searchState, state => state.noSearchResult);

// retrieve the current item type id from the form
export const searchItemTypeId = createSelector(getForm, form => form.itemTypeId);
// retrieve the corresponding item type
export const searchItemType = createSelector(searchItemTypeId, MetaDataSelectors.selectItemTypes,
    (itemTypeId: string, itemTypes: ItemType[]) => itemTypes.find(it => it.id === itemTypeId)
);

// get all attribute type ids in search form
export const searchUsedAttributeTypes = createSelector(getForm,
    form => (form.attributes ? [...new Set(form.attributes.map(a => a.typeId))] : []) as string[]
);

// get attribute group ids for attribute types currently used in search form
const attributeGroupIdsForCurrentSearchItemType = createSelector(searchItemType, MetaDataSelectors.selectAttributeGroups,
    (itemType: ItemType, attributeGroups: AttributeGroup[]) => itemType?.attributeGroups?.map(a => a.id) ?? attributeGroups.map(ag => ag.id)
);

// get used attribute types for current item type in search form
export const attributeTypesForCurrentSearchItemType = createSelector(attributeGroupIdsForCurrentSearchItemType, MetaDataSelectors.selectAttributeTypes,
    (groupIds: string[], attributeTypes: AttributeType[]) => attributeTypes.filter(at => groupIds.indexOf(at.attributeGroupId) > -1)
);

// get available attribute types for current item type in search form
export const availableSearchAttributeTypes =  createSelector(searchUsedAttributeTypes, attributeTypesForCurrentSearchItemType,
    (usedAttributeTypes, availableAttributeTypes) => availableAttributeTypes.filter(at => usedAttributeTypes.findIndex(ua => ua === at.id) < 0)
);

// get connection rules that match this item type as upper
export const connectionRulesForCurrentIsUpperSearchItemType = createSelector(MetaDataSelectors.selectConnectionRules, searchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) => itemType && value.upperItemTypeId === itemType.id)
);
// get connection rules that match this item type as lower
export const connectionRulesForCurrentIsLowerSearchItemType =
    createSelector(MetaDataSelectors.selectConnectionRules, searchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.lowerItemTypeId === itemType.id)
);

// get all connections types that can be used in rules for this item type as upper
export const connectionTypesForCurrentIsUpperSearchItemType =
    createSelector(MetaDataSelectors.selectConnectionTypes, connectionRulesForCurrentIsUpperSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);
// get all connections types that can be used in rules for this item type as lower
export const connectionTypesForCurrentIsLowerSearchItemType =
    createSelector(MetaDataSelectors.selectConnectionTypes, connectionRulesForCurrentIsLowerSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.connectionTypeId === connectionType.id) > -1)
);
