import { createAction, props } from '@ngrx/store';
import { AttributeType, SearchConnection, NeighborSearch } from 'backend-access';

export const searchChangeMetaData = createAction('[Neighbor search] Change MetaData',
    props<{attributeTypes: AttributeType[]}>()
);

export const setNeighborSearch = createAction('[Neighbor search] Set the basic search parameters',
    props<NeighborSearch>()
);

export const addNameOrValue = createAction('[Neighbor search] Add name or value text', props<{text: string}>());

export const addItemType = createAction('[Neighbor search] Add item type', props<{typeId: string}>());

export const deleteItemType = createAction('[Neighbor search] Remove item type');

export const addAttributeValue = createAction('[Neighbor search] Set value of existing attribute type',
    props<{typeId: string; value: string}>()
);

export const deleteAttributeType = createAction('[Neighbor search] Remove one attribute type',
    props<{typeId: string}>()
);

export const addConnectionTypeToUpper = createAction('[Neighbor search] Add connection type for an upward connection',
    props<SearchConnection>()
);

export const deleteConnectionTypeToUpper = createAction('[Neighbor search] Remove connection type for an upward connection',
    props<{index: number}>()
);

export const addConnectionTypeToLower = createAction('[Neighbor search] Add connection type for a downward connection',
    props<SearchConnection>()
);

export const deleteConnectionTypeToLower = createAction('[Neighbor search] Remove connection type for a downard connection',
    props<{index: number}>()
);

export const setChangedAfter = createAction('[Neighbor search] Set date for searching items changed after',
    props<{date?: Date}>()
);

export const setChangedBefore = createAction('[Neighbor search] Set date for searching items changed before',
    props<{date?: Date}>()
);

export const setResponsibility = createAction('[Neighbor search] Set responsibilityToken',
    props<{token: string}>()
);

export const resetForm = createAction('[Neighbor search] Reset form');
