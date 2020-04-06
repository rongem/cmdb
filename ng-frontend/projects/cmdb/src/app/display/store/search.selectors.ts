import { createSelector } from '@ngrx/store';

import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

import { Guid } from 'projects/cmdb/src/app/shared/guid';
import { ItemTypeAttributeGroupMapping } from 'projects/cmdb/src/app/shared/objects/item-type-attribute-group-mapping.model';
import { ItemType } from 'projects/cmdb/src/app/shared/objects/item-type.model';
import { AttributeType } from 'projects/cmdb/src/app/shared/objects/attribute-type.model';
import { ConnectionRule } from 'projects/cmdb/src/app/shared/objects/connection-rule.model';
import { ConnectionType } from 'projects/cmdb/src/app/shared/objects/connection-type.model';

export const getSearchState =  createSelector(fromSelectDisplay.getDisplayState,
    (state: fromDisplay.State) => state.search
);

export const selectSearchItemTypeId = createSelector(getSearchState,
    (state) => state.form.ItemType
);
export const selectSearchItemType = createSelector(selectSearchItemTypeId, fromSelectMetaData.selectItemTypes,
    (itemTypeId: Guid, itemTypes: ItemType[]) => itemTypes.find(it => it.TypeId === itemTypeId)
);

export const selectSearchUsedAttributeTypes = createSelector(getSearchState,
    (state) => state.form.Attributes ? [...new Set(state.form.Attributes.map(a => a.AttributeTypeId))] : []
);

export const selectAttributeGroupIdsForCurrentSearchItemType =
    createSelector(fromSelectMetaData.selectItemTypeAttributeGroupMappings, selectSearchItemType,
    (iagm: ItemTypeAttributeGroupMapping[], itemType: ItemType) =>
        iagm.filter(m => !itemType || m.ItemTypeId === itemType.TypeId).map(a => a.GroupId)
);

export const selectAttributeTypesForCurrentSearchItemType =
    createSelector(selectAttributeGroupIdsForCurrentSearchItemType, fromSelectMetaData.selectAttributeTypes,
        (groupIds: Guid[], attributeTypes: AttributeType[]) =>
        attributeTypes.filter(at => groupIds.indexOf(at.AttributeGroup) > -1)
);

export const selectSearchAvailableSearchAttributeTypes =
    createSelector(selectSearchUsedAttributeTypes, selectAttributeTypesForCurrentSearchItemType,
        (usedAttributeTypes, availableAttributeTypes) =>
        availableAttributeTypes.filter(at => usedAttributeTypes.findIndex(ua => ua === at.TypeId) < 0)
);

export const selectConnectionRulesForCurrentIsUpperSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectSearchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemUpperType === itemType.TypeId)
);
export const selectConnectionRulesForCurrentIsLowerSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionRules, selectSearchItemType,
    (connectionRules: ConnectionRule[], itemType: ItemType) => connectionRules.filter((value) =>
    itemType && value.ItemLowerType === itemType.TypeId)
);

export const selectConnectionTypesForCurrentIsUpperSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionTypes, selectConnectionRulesForCurrentIsUpperSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1)
);
export const selectConnectionTypesForCurrentIsLowerSearchItemType =
    createSelector(fromSelectMetaData.selectConnectionTypes, selectConnectionRulesForCurrentIsLowerSearchItemType,
    (connectionTypes: ConnectionType[], connectionRules: ConnectionRule[]) => connectionTypes.filter((connectionType) =>
        connectionRules.findIndex((cr) => cr.ConnType === connectionType.ConnTypeId) > -1)
);

// export const selectUpperItemTypesForCurrentSearchItemTypeAndConnectionType =
//     createSelector(selectConnectionRulesForCurrentIsLowerSearchItemType,
//         fromSelectMetaData.selectItemTypes,
//         (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
//             itemTypes.filter(itemtype =>
//             connectionRules.filter(rule =>
//                 rule.ConnType === connectionType.ConnTypeId).map(rule =>
//                 rule.ItemUpperType).findIndex(val => val === itemtype.TypeId) > -1)
// );
// export const selectLowerItemTypesForCurrentSearchItemTypeAndConnectionType =
//     createSelector(selectConnectionRulesForCurrentIsUpperSearchItemType,
//         fromSelectMetaData.selectItemTypes,
//         (connectionRules: ConnectionRule[], itemTypes: ItemType[], connectionType: ConnectionType) =>
//             itemTypes.filter(itemtype =>
//             connectionRules.filter(rule =>
//                 rule.ConnType === connectionType.ConnTypeId).map(rule =>
//                 rule.ItemLowerType).findIndex(val => val === itemtype.TypeId) > -1)
// );

