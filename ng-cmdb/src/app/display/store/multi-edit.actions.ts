import { createAction, props } from '@ngrx/store';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

export const addItemId = createAction('[MultiEdit] Add Guid to selected Ids',
    props<{ itemId: Guid }>());

export const removeItemId = createAction('[MultiEdit] Remove Guid from selected Ids',
    props<{ itemId: Guid }>());

export const setItemIds = createAction('[MultiEdit] Set selected Ids',
    props<{ itemIds: Guid[] }>());

export const setSelectedItems = createAction('[MultiEdit] Set selectedItems',
    props<{ items: FullConfigurationItem[] }>());

export const clear = createAction('[MultiEdit] Clear ids and items');
