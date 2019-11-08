import { createAction, props } from '@ngrx/store';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { ItemLink } from 'src/app/shared/objects/item-link.model';

export const addItemId = createAction('[MultiEdit] Add Guid to selected Ids',
    props<{ itemId: Guid }>());

export const removeItemId = createAction('[MultiEdit] Remove Guid from selected Ids',
    props<{ itemId: Guid }>());

export const setItemIds = createAction('[MultiEdit] Set selected Ids',
    props<{ itemIds: Guid[] }>());

export const setSelectedItems = createAction('[MultiEdit] Set selectedItems',
    props<{ items: FullConfigurationItem[] }>());

export const clear = createAction('[MultiEdit] Clear ids and items');

export const createItemAttribute = createAction('[Display/MultiEdit] Create item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const updateItemAttribute = createAction('[Display/MultiEdit] Update item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const deleteItemAttribute = createAction('[Display/MultiEdit] Delete item attribute',
    props<{ itemAttributeId: Guid }>()
);

export const createConnection = createAction('[Display/MultiEdit] Create connection',
    props<{ connection: Connection }>()
);

export const deleteConnection = createAction('[Display/MultiEdit] Delete connection',
    props<{ connId: Guid }>()
);

export const createLink = createAction('[Display/MultiEdit] Create external link for item',
    props<{ itemLink: ItemLink }>()
);

export const deleteLink = createAction('[Display/MultiEdit] Delete external link for item',
    props<{ itemLinkId: Guid }>()
);

export const noAction = createAction('[Display/MultiEdit] No action');

