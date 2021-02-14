import { createAction, props } from '@ngrx/store';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { LineMessage } from '../../objects/item-data/line-message.model';
import { Connection } from '../../objects/item-data/connection.model';
import { ItemLink } from '../../objects/item-data/item-link.model';


export const addItemId = createAction('[MultiEdit] Add item id to selected Ids',
    props<{ itemId: string }>());

export const removeItemId = createAction('[MultiEdit] Remove item id from selected Ids',
    props<{ itemId: string }>());

export const setItemIds = createAction('[MultiEdit] Set selected Ids',
    props<{ itemIds: string[] }>());

export const setSelectedItems = createAction('[MultiEdit] Set selectedItems',
    props<{ items: FullConfigurationItem[] }>());

export const clear = createAction('[MultiEdit] Clear ids and items');

// export const createItemAttribute = createAction('[MultiEdit] Create item attribute',
//     props<{ itemAttribute: ItemAttribute, logEntry: LineMessage }>()
// );

// export const updateItemAttribute = createAction('[MultiEdit] Update item attribute',
//     props<{ itemAttribute: ItemAttribute, logEntry: LineMessage }>()
// );

// export const deleteItemAttribute = createAction('[MultiEdit] Delete item attribute',
//     props<{ itemAttributeId: string, logEntry: LineMessage }>()
// );

// export const createConnection = createAction('[MultiEdit] Create connection',
//     props<{ connection: Connection, logEntry: LineMessage }>()
// );

// export const deleteConnection = createAction('[MultiEdit] Delete connection',
//     props<{ connectionId: string, logEntry: LineMessage }>()
// );

// export const createLink = createAction('[MultiEdit] Create external link for item',
//     props<{ itemLink: ItemLink, logEntry: LineMessage }>()
// );

// export const deleteLink = createAction('[MultiEdit] Delete external link for item',
//     props<{ itemLinkId: string, logEntry: LineMessage }>()
// );
