import { createSelector, createFeatureSelector } from '@ngrx/store';

import { METADATA } from '../constants';
import { State } from './meta-data.reducer';
import { AttributeGroup } from '../../rest-api/meta-data/attribute-group.model';
import { Guid } from '../../guid';
import { AttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { ItemType } from '../../rest-api/meta-data/item-type.model';
import { ConnectionType } from '../../rest-api/meta-data/connection-type.model';
import { ConnectionRule } from '../../rest-api/meta-data/connection-rule.model';
import { ItemTypeAttributeGroupMapping } from '../../rest-api/meta-data/item-type-attribute-group-mapping.model';

export const selectState = createFeatureSelector<State>(METADATA);

export const selectDataValid = createSelector(selectState, state => state.validData);
export const selectLoadingData = createSelector(selectState, state => state.loadingData);

export const selectAttributeGroups = createSelector(selectState, state => state.attributeGroups);
export const selectAttributeTypes = createSelector(selectState, state => state.attributeTypes);
export const selectItemTypes = createSelector(selectState, state => state.itemTypes);
export const selectItemTypeAttributeGroupMappings = createSelector(selectState, state => state.itemTypeAttributeGroupMappings);
export const selectConnectionTypes = createSelector(selectState, state => state.connectionTypes);
export const selectConnectionRules = createSelector(selectState, state => state.connectionRules);
export const selectUserName = createSelector(selectState, state => state.userName);
export const selectUserRole = createSelector(selectState, state => state.userRole);

export const selectSingleAttributeGroup = createSelector(selectAttributeGroups,
    (attributeGroups: AttributeGroup[], attributeGroupId: Guid) => attributeGroups.find(ag => ag.GroupId === attributeGroupId)
);
export const selectSingleAttributeType = createSelector(selectAttributeTypes,
    (attributeTypes: AttributeType[], attributeTypeId: Guid) => attributeTypes.find(at => at.TypeId === attributeTypeId)
);
export const selectSingleItemType = createSelector(selectItemTypes,
    (itemTypes: ItemType[], itemTypeId: Guid) => itemTypes.find(i => i.TypeId === itemTypeId)
);
export const selectSingleItemTypeByName = createSelector(selectItemTypes,
    (itemTypes: ItemType[], typeName: string) => itemTypes.find(i => i.TypeName.toLocaleLowerCase() === typeName.toLocaleLowerCase())
);
export const selectSingleConnectionType = createSelector(selectConnectionTypes,
    (connectionTypes: ConnectionType[], connectionTypeId: Guid) => connectionTypes.find(c => c.ConnTypeId === connectionTypeId)
);
export const selectSingleConnectionRule = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], ruleId: Guid) => connectionRules.find(c => c.RuleId === ruleId)
);

export const selectAttributeGroupIdsForItemTypeId = createSelector(selectItemTypeAttributeGroupMappings,
    (iagm: ItemTypeAttributeGroupMapping[], itemTypeId: Guid) => iagm.filter(m => m.ItemTypeId === itemTypeId).map(a => a.GroupId)
);
export const selectConnectionRulesForUpperItemType = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], props: { itemType: ItemType, connectionType?: ConnectionType }) => connectionRules.filter((value) =>
    props.itemType && value.ItemUpperType === props.itemType.TypeId)
);
export const selectConnectionRulesForLowerItemType = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], props: { itemType: ItemType, connectionType?: ConnectionType }) => connectionRules.filter((value) =>
    props.itemType && value.ItemLowerType === props.itemType.TypeId)
);

export const selectAttributeTypesInGroup = createSelector(selectAttributeTypes, (attributeTypes: AttributeType[], groupId: Guid) =>
    attributeTypes.filter(at => at.AttributeGroup === groupId)
);
export const selectAttributeTypesForItemType =
    createSelector(selectAttributeGroupIdsForItemTypeId, selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1)
);
export const selectMappingsForAttributeGroup = createSelector(selectItemTypeAttributeGroupMappings,
    (mappings: ItemTypeAttributeGroupMapping[], groupId: Guid) => mappings.filter(m => m.GroupId === groupId)
);
export const selectItemTypesForAttributeGroup = createSelector(selectItemTypes, selectMappingsForAttributeGroup,
    (itemTypes: ItemType[], mappings: ItemTypeAttributeGroupMapping[], groupId: Guid) => {
        return itemTypes.filter(it => mappings.map(m => m.ItemTypeId).includes(it.TypeId));
});
export const selectConnectionTypesForUpperItemType =
    createSelector(selectConnectionTypes, selectConnectionRulesForUpperItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1)
);
export const selectConnectionTypesForLowerItemType =
    createSelector(selectConnectionTypes, selectConnectionRulesForLowerItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1)
);
export const selectUpperItemTypesForItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForLowerItemType,
        selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], props: { itemType: ItemType, connectionType: ConnectionType }) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === props.connectionType.ConnTypeId).map(rule =>
                rule.ItemUpperType).findIndex(val => val === itemtype.TypeId) > -1)
);
export const selectLowerItemTypesForItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForUpperItemType,
        selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], props: { itemType: ItemType, connectionType: ConnectionType }) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.ConnType === props.connectionType.ConnTypeId).map(rule =>
                rule.ItemLowerType).findIndex(val => val === itemtype.TypeId) > -1)
);
