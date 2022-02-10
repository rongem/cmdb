import { createAction, props } from '@ngrx/store';
import { FullConfigurationItem } from 'backend-access';

export const addItemId = createAction('[MultiEdit] Add item id to selected Ids',
    props<{ itemId: string }>()
);

export const removeItemId = createAction('[MultiEdit] Remove item id from selected Ids',
    props<{ itemId: string }>()
);

export const setItemIds = createAction('[MultiEdit] Set selected Ids',
    props<{ itemIds: string[] }>()
);

export const setSelectedItems = createAction('[MultiEdit] Set selectedItems',
    props<{ items: FullConfigurationItem[] }>()
);

export const removeSelectedItem = createAction('[MultiEdit] Remove item from selectedItems',
    props<{ item: FullConfigurationItem }>()
);

export const replaceSelectedItem = createAction('[MultiEdit] Replace an existing item in store with an updated version',
    props<{ item: FullConfigurationItem }>()
);

export const clear = createAction('[MultiEdit] Clear ids and items');

export const setItemIdsToProcess = createAction('[MultiEdit] Set Ids of the items that will be processed',
    props<{ itemIds: string[] }>()
);

export const removeItemIdToProcess = createAction('[MultiEdit] Remove an id of an item that will be processed',
    props<{ itemId: string }>()
);
