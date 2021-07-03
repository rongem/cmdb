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

export const selectSingleAttributeGroup = (attributeGroupId: string) => createSelector(selectAttributeGroups,
    (attributeGroups: AttributeGroup[]) => attributeGroups.find(ag => ag.id === attributeGroupId)
);
export const selectSingleAttributeType = (attributeTypeId: string) => createSelector(selectAttributeTypes,
    (attributeTypes: AttributeType[]) => attributeTypes.find(at => at.id === attributeTypeId)
);
export const selectSingleItemType = (itemTypeId: string) => createSelector(selectItemTypes,
    (itemTypes: ItemType[]) => itemTypes.find(i => i.id === itemTypeId)
);
export const selectSingleItemTypeByName = (typeName: string) => createSelector(selectItemTypes,
    (itemTypes: ItemType[]) => itemTypes.find(i => i.name.toLocaleLowerCase() === typeName.toLocaleLowerCase())
);
export const selectSingleConnectionType = (connectionTypeId: string) => createSelector(selectConnectionTypes,
    (connectionTypes: ConnectionType[]) => connectionTypes.find(c => c.id === connectionTypeId)
);
export const selectSingleConnectionRule = (ruleId: string) => createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[]) => connectionRules.find(c => c.id === ruleId)
);

export const selectConnectionRulesForUpperItemType = (itemType: ItemType) => createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[]) => connectionRules.filter((value) => itemType && value.upperItemTypeId === itemType.id)
);
export const selectConnectionRulesForLowerItemType = (itemType: ItemType) => createSelector(selectConnectionRules,
    (connectionRules: ConnectionRule[]) => connectionRules.filter((value) =>
    itemType && value.lowerItemTypeId === itemType.id)
);

export const selectAttributeTypesInGroup = (groupId: string) => createSelector(selectAttributeTypes, (attributeTypes: AttributeType[]) =>
    attributeTypes.filter(at => at.attributeGroupId === groupId)
);
export const selectAttributeTypesForItemType = (itemTypeId: string) => createSelector(selectSingleItemType(itemTypeId), selectAttributeTypes,
        (itemType: ItemType, attributeTypes: AttributeType[]) =>
            attributeTypes.filter(at => itemType.attributeGroups.map(ag => ag.id).includes(at.attributeGroupId))
);
export const selectItemTypesForAttributeGroup = (groupId: string) => createSelector(selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(it => it.attributeGroups.map(ag => ag.id).includes(groupId))
);
export const selectConnectionTypesForUpperItemType = (itemType: ItemType) =>
    createSelector(selectConnectionTypes, selectConnectionRulesForUpperItemType(itemType),
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((rule) => rule.connectionTypeId === connectionType.id) > -1)
);
export const selectConnectionTypesForLowerItemType = (itemType: ItemType) =>
    createSelector(selectConnectionTypes, selectConnectionRulesForLowerItemType(itemType),
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((rule) => rule.connectionTypeId === connectionType.id) > -1)
);
export const selectUpperItemTypesForItemTypeAndConnectionType = (itemType: ItemType, connectionType: ConnectionType) =>
    createSelector(selectConnectionRulesForLowerItemType(itemType),
        selectItemTypes, (connectionRules: ConnectionRule[], itemTypes: ItemType[]) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.connectionTypeId === connectionType.id).map(rule =>
                rule.upperItemTypeId).findIndex(val => val === itemtype.id) > -1)
);
export const selectLowerItemTypesForItemTypeAndConnectionType = (itemType: ItemType, connectionType: ConnectionType) =>
    createSelector(selectConnectionRulesForUpperItemType(itemType),
        selectItemTypes, (connectionRules: ConnectionRule[], itemTypes: ItemType[]) =>
            itemTypes.filter(itemtype =>
            connectionRules.filter(rule =>
                rule.connectionTypeId === connectionType.id).map(rule =>
                rule.lowerItemTypeId).findIndex(val => val === itemtype.id) > -1)
);

export const selectItemTypesByAttributeGroup = (attributeGroupId: string) => createSelector(selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(it => !!it.attributeGroups.find(ag => ag.id === attributeGroupId))
);
