import { createAction, props } from '@ngrx/store';

import { Guid } from 'backend-access';
import { FullConfigurationItem } from 'projects/cmdb/src/app/shared/objects/full-configuration-item.model';
import { ItemAttribute } from 'projects/cmdb/src/app/shared/objects/item-attribute.model';
import { Connection } from 'projects/cmdb/src/app/shared/objects/connection.model';
import { ItemLink } from 'projects/cmdb/src/app/shared/objects/item-link.model';
import { LineMessage } from 'projects/cmdb/src/app/display/objects/line-message.model';

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
    props<{ itemAttribute: ItemAttribute, logEntry: LineMessage }>()
);

export const updateItemAttribute = createAction('[Display/MultiEdit] Update item attribute',
    props<{ itemAttribute: ItemAttribute, logEntry: LineMessage }>()
);

export const deleteItemAttribute = createAction('[Display/MultiEdit] Delete item attribute',
    props<{ itemAttributeId: Guid, logEntry: LineMessage }>()
);

export const createConnection = createAction('[Display/MultiEdit] Create connection',
    props<{ connection: Connection, logEntry: LineMessage }>()
);

export const deleteConnection = createAction('[Display/MultiEdit] Delete connection',
    props<{ connId: Guid, logEntry: LineMessage }>()
);

export const createLink = createAction('[Display/MultiEdit] Create external link for item',
    props<{ itemLink: ItemLink, logEntry: LineMessage }>()
);

export const deleteLink = createAction('[Display/MultiEdit] Delete external link for item',
    props<{ itemLinkId: Guid, logEntry: LineMessage }>()
);

export const noAction = createAction('[Display/MultiEdit] No action');

export const clearLog = createAction('[Display/MultiEdit] Clear log');

export const log = createAction('[Display/MultiEdit] Create log entry',
    props<{ logEntry: LineMessage }>()
);

