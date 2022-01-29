import { createAction, props } from '@ngrx/store';
import { AttributeType, SearchConnection } from 'backend-access';

export const searchChangeMetaData = createAction('[Search] Change MetaData',
    props<{attributeTypes: AttributeType[]}>()
);

export const addNameOrValue = createAction('[Search] Add name or value text', props<{text: string}>());

export const addItemType = createAction('[Search] Add item type', props<{typeId: string}>());

export const deleteItemType = createAction('[Search] Remove item type');

export const addAttributeType = createAction('[Search] Add additional attribute type', props<{typeId: string}>());

export const changeAttributeValue = createAction('[Search] Set value of existing attribute type',
    props<{typeId: string; value: string}>()
);

export const deleteAttributeType = createAction('[Search] Remove one attribute type',
    props<{typeId: string}>()
);

export const addConnectionTypeToUpper = createAction('[Search] Add connection type for an upward connection',
    props<SearchConnection>()
);

export const changeConnectionCountToUpper = createAction('[Search] Change count for an upward connection',
    props<{index: number; count: string}>());

export const deleteConnectionTypeToUpper = createAction('[Search] Remove connection type for an upward connection',
    props<{index: number}>()
);

export const addConnectionTypeToLower = createAction('[Search] Add connection type for a downward connection',
    props<SearchConnection>()
);

export const changeConnectionCountToLower = createAction('[Search] Change count for a downward connection',
    props<{index: number; count: string}>());

export const deleteConnectionTypeToLower = createAction('[Search] Remove connection type for a downard connection',
    props<{index: number}>()
);

export const setChangedAfter = createAction('[Search] Set date for searching items changed after',
    props<{date?: Date}>()
);

export const setChangedBefore = createAction('[Search] Set date for searching items changed before',
    props<{date?: Date}>()
);

export const setResponsibility = createAction('[Search] Set responsibilityToken',
    props<{token: string}>()
);

export const resetForm = createAction('[Search] Reset form');
