import { createAction, props } from '@ngrx/store';
import { Guid } from 'projects/cmdb/src/app/shared/guid';

import { AttributeType } from 'projects/cmdb/src/app/shared/objects/attribute-type.model';
import { SearchContent } from 'projects/cmdb/src/app/display/search/objects/search-content.model';
import { NeighborSearch } from '../search/objects/neighbor-search.model';
import { NeighborItem } from '../search/objects/neighbor-item.model';

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

export const performSearch = createAction('[Search] Perform search with given parameters and return the result list',
    props<{searchContent: SearchContent}>()
);

export const performSearchFull = createAction('[Search] Perform search and return the result list with full items',
    props<{searchContent: SearchContent}>()
);

export const performNeighborSearch = createAction('[NeighborSearch] Perform search with given parameters and return the result list',
    props<{searchContent: NeighborSearch}>()
);

export const setNeighborSearchResultList = createAction('[NeighborSearch] Set result list after search',
    props<{resultList: NeighborItem[], fullItemsIncluded: boolean}>()
);
