import { createSelector, createFeatureSelector } from '@ngrx/store';

import { METADATA } from '../../store/store.constants';
import { State } from './meta-data.reducer';
import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ItemType } from '../../objects/meta-data/item-type.model';
import { ConnectionType } from '../../objects/meta-data/connection-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';

export const selectState = createFeatureSelector<State>(METADATA);

export const selectDataValid = createSelector(selectState, state => state.validData);
export const selectLoadingData = createSelector(selectState, state => state.loadingData);

export const selectAttributeGroups = createSelector(selectState, state => state.attributeGroups);
export const selectAttributeTypes = createSelector(selectState, state => state.attributeTypes);
export const selectItemTypes = createSelector(selectState, state => state.itemTypes);
export const selectConnectionTypes = createSelector(selectState, state => state.connectionTypes);
export const selectConnectionRules = createSelector(selectState, state => state.connectionRules);
export const selectUserName = createSelector(selectState, state => state.userName);
export const selectUserRole = createSelector(selectState, state => state.userRole);

export const selectSingleAttributeGroup = createSelector(selectAttributeGroups,
    (attributeGroups: AttributeGroup[], attributeGroupId: string) => attributeGroups.find(ag => ag.id === attributeGroupId)
);
export const selectSingleAttributeType = createSelector(selectAttributeTypes,
    (attributeTypes: AttributeType[], attributeTypeId: string) => attributeTypes.find(at => at.id === attributeTypeId)
);
export const selectSingleItemType = createSelector(selectItemTypes,
    (itemTypes: ItemType[], itemTypeId: string) => itemTypes.find(i => i.id === itemTypeId)
);
export const selectSingleItemTypeByName = createSelector(selectItemTypes,
    (itemTypes: ItemType[], typeName: string) => itemTypes.find(i => i.name.toLocaleLowerCase() === typeName.toLocaleLowerCase())
);
export const selectSingleConnectionType = createSelector(selectConnectionTypes,
    (connectionTypes: ConnectionType[], connectionTypeId: string) => connectionTypes.find(c => c.id === connectionTypeId)
);
export const selectSingleConnectionRule = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], ruleId: string) => connectionRules.find(c => c.id === ruleId)
);

export const selectConnectionRulesForUpperItemType = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], props: { itemType: ItemType; connectionType?: ConnectionType }) => connectionRules.filter((value) =>
    props.itemType && value.upperItemTypeId === props.itemType.id)
);
export const selectConnectionRulesForLowerItemType = createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[], props: { itemType: ItemType; connectionType?: ConnectionType }) => connectionRules.filter((value) =>
    props.itemType && value.lowerItemTypeId === props.itemType.id)
);

export const selectAttributeTypesInGroup = createSelector(selectAttributeTypes, (attributeTypes: AttributeType[], groupId: string) =>
    attributeTypes.filter(at => at.attributeGroupId === groupId)
);
export const selectAttributeTypesForItemType =
    createSelector(selectSingleItemType, selectAttributeTypes,
        (itemType: ItemType, attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => itemType.attributeGroups.map(ag => ag.id).includes(at.attributeGroupId))
);
export const selectItemTypesForAttributeGroup = createSelector(selectItemTypes, (itemTypes: ItemType[], groupId: string) =>
    itemTypes.filter(it => it.attributeGroups.map(ag => ag.id).includes(groupId))
);
export const selectConnectionTypesForUpperItemType =
    createSelector(selectConnectionTypes, selectConnectionRulesForUpperItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((rule) => rule.connectionTypeId === connectionType.id) > -1)
);
export const selectConnectionTypesForLowerItemType =
    createSelector(selectConnectionTypes, selectConnectionRulesForLowerItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((rule) => rule.connectionTypeId === connectionType.id) > -1)
);
export const selectUpperItemTypesForItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForLowerItemType,
        selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], props: { itemType: ItemType; connectionType: ConnectionType }) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.connectionTypeId === props.connectionType.id).map(rule =>
                rule.upperItemTypeId).findIndex(val => val === itemtype.id) > -1)
);
export const selectLowerItemTypesForItemTypeAndConnectionType =
    createSelector(selectConnectionRulesForUpperItemType,
        selectItemTypes,
        (connectionRules: ConnectionRule[], itemTypes: ItemType[], props: { itemType: ItemType; connectionType: ConnectionType }) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.connectionTypeId === props.connectionType.id).map(rule =>
                rule.lowerItemTypeId).findIndex(val => val === itemtype.id) > -1)
);

export const selectItemTypesByAttributeGroup = createSelector(selectItemTypes, (itemTypes: ItemType[], attributeGroupId: string) =>
    itemTypes.filter(it => !!it.attributeGroups.find(ag => ag.id === attributeGroupId))
);
