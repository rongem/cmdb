import { createSelector } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as fromApp from './app.reducer';
import * as fromMetaData from './meta-data.reducer';

import { AttributeGroup } from '../objects/attribute-group.model';
import { ItemTypeAttributeGroupMapping } from '../objects/item-type-attribute-group-mapping.model';
import { AttributeType } from '../objects/attribute-type.model';
import { ItemType } from '../objects/item-type.model';
import { ConnectionType } from '../objects/connection-type.model';
import { ConnectionRule } from '../objects/connection-rule.model';

export const selectAttributeGroups = (state: fromApp.AppState) => state.metaData.attributeGroups;
export const selectAttributeTypes = (state: fromApp.AppState) => state.metaData.attributeTypes;
export const selectItemTypes = (state: fromApp.AppState) => state.metaData.itemTypes;
export const selectItemTypeAttributeGroupMappings = (state: fromApp.AppState) => state.metaData.itemTypeAttributeGroupMappings;
export const selectConnectionTypes = (state: fromApp.AppState) => state.metaData.connectionTypes;
export const selectConnectionRules = (state: fromApp.AppState) => state.metaData.connectionRules;

export const selectSingleAttributeGroup = createSelector(selectAttributeGroups,
    (attributeGroups: AttributeGroup[], attributeGroupId: Guid) => attributeGroups.find(ag => ag.GroupId === attributeGroupId));
export const selectSingleAttributeType = createSelector(selectAttributeTypes,
    (attributeTypes: AttributeType[], attributeTypeId: Guid) => attributeTypes.find(at => at.TypeId === attributeTypeId));
export const selectSingleItemType = createSelector(selectItemTypes,
    (itemTypes: ItemType[], itemTypeId: Guid) => itemTypes.filter(i => i.TypeId === itemTypeId));
export const selectSingleConnectionType = createSelector(selectConnectionTypes,
    (connectionTypes: ConnectionType[], connectionTypeId: Guid) => connectionTypes.filter(c => c.ConnTypeId === connectionTypeId));
export const selectSingleConnectionRule = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], ruleId: Guid) => connectionRules.find(c => c.RuleId === ruleId));

export const selectAttributeGroupIdsForItemTypeId = createSelector(selectItemTypeAttributeGroupMappings,
    (iagm: ItemTypeAttributeGroupMapping[], itemTypeId: Guid) => iagm.filter(m => m.ItemTypeId === itemTypeId).map(a => a.GroupId));
export const selectConnectionRulesForUpperItemTypeId = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], itemTypeId: Guid) => connectionRules.filter((value) =>
    value.ItemUpperType === itemTypeId));
export const selectConnectionRulesForLowerItemTypeId = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], itemTypeId: Guid) => connectionRules.filter((value) =>
    value.ItemLowerType === itemTypeId));

export const selectAttributeTypesForItemType =
    createSelector(selectAttributeGroupIdsForItemTypeId, selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[], itemTypeId: Guid) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1));
