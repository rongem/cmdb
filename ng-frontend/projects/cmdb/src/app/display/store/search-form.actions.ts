import { createAction, props } from '@ngrx/store';
import { Guid, AttributeType, SearchContent, NeighborSearch, NeighborItem } from 'backend-access';

export const searchChangeMetaData = createAction('[Search] Change MetaData',
    props<{attributeTypes: AttributeType[]}>()
);

export const addNameOrValue = createAction('[Search] Add name or value text', props<{text: string}>());

export const addItemType = createAction('[Search] Add item type', props<{itemTypeId: Guid}>());

export const deleteItemType = createAction('[Search] Remove item type');

export const addAttributeType = createAction('[Search] Add additional attribute type', props<{attributeTypeId: Guid}>());

export const changeAttributeValue = createAction('[Search] Set value of existing attribute type',
    props<{attributeTypeId: Guid, attributeValue: string}>());

export const deleteAttributeType = createAction('[Search] Remove one attribute type',
    props<{attributeTypeId: Guid}>()
);

export const addConnectionTypeToUpper = createAction('[Search] Add connection type for an upward connection',
    props<{connectionTypeId: Guid, itemTypeId?: Guid}>()
);

export const changeConnectionCountToUpper = createAction('[Search] Change count for an upward connection',
    props<{index: number, count: string}>());

export const deleteConnectionTypeToUpper = createAction('[Search] Remove connection type for an upward connection',
    props<{index: number}>()
);

export const addConnectionTypeToLower = createAction('[Search] Add connection type for a downward connection',
    props<{connectionTypeId: Guid, itemTypeId?: Guid}>()
);

export const changeConnectionCountToLower = createAction('[Search] Change count for a downward connection',
    props<{index: number, count: string}>());

export const deleteConnectionTypeToLower = createAction('[Search] Remove connection type for a downard connection',
    props<{index: number}>()
);

export const setResponsibility = createAction('[Search] Set responsibilityToken',
    props<{token: string}>()
);

export const resetForm = createAction('[Search] Reset form');
