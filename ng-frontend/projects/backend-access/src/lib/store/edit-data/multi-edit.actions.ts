import { createAction, props } from '@ngrx/store';
import { Guid } from '../../guid';
import { FullConfigurationItem } from '../../rest-api/item-data/full/full-configuration-item.model';
import { ItemAttribute } from '../../rest-api/item-data/item-attribute.model';
import { LineMessage } from '../../rest-api/line-message.model';
import { Connection } from '../../rest-api/item-data/connection.model';
import { ItemLink } from '../../rest-api/item-data/item-link.model';


export const addItemId = createAction('[MultiEdit] Add Guid to selected Ids',
    props<{ itemId: Guid }>());

export const removeItemId = createAction('[MultiEdit] Remove Guid from selected Ids',
    props<{ itemId: Guid }>());

export const setItemIds = createAction('[MultiEdit] Set selected Ids',
    props<{ itemIds: Guid[] }>());

export const setSelectedItems = createAction('[MultiEdit] Set selectedItems',
    props<{ items: FullConfigurationItem[] }>());

export const clear = createAction('[MultiEdit] Clear ids and items');

export const createItemAttribute = createAction('[MultiEdit] Create item attribute',
    props<{ itemAttribute: ItemAttribute, logEntry: LineMessage }>()
);

export const updateItemAttribute = createAction('[MultiEdit] Update item attribute',
    props<{ itemAttribute: ItemAttribute, logEntry: LineMessage }>()
);

export const deleteItemAttribute = createAction('[MultiEdit] Delete item attribute',
    props<{ itemAttributeId: Guid, logEntry: LineMessage }>()
);

export const createConnection = createAction('[MultiEdit] Create connection',
    props<{ connection: Connection, logEntry: LineMessage }>()
);

export const deleteConnection = createAction('[MultiEdit] Delete connection',
    props<{ connId: Guid, logEntry: LineMessage }>()
);

export const createLink = createAction('[MultiEdit] Create external link for item',
    props<{ itemLink: ItemLink, logEntry: LineMessage }>()
);

export const deleteLink = createAction('[MultiEdit] Delete external link for item',
    props<{ itemLinkId: Guid, logEntry: LineMessage }>()
);
