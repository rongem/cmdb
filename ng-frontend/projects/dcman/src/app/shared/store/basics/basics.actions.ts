import { createAction, props } from '@ngrx/store';

import { Room } from '../../objects/asset/room.model';
import { Model } from '../../objects/model.model';

export const resetRetryCount = createAction('[MetaData] Reset retry count to zero');

export const validateSchema = createAction('[MetaData] Schema is valid');

export const invalidateSchema = createAction('[MetaData] Schema is invalid');

export const noAction = createAction('[*] No Action');

export const readRooms = createAction('[Rooms] Read rooms');

export const setRooms = createAction('[Rooms] Set rooms',
    props<{rooms: Room[]}>()
);

export const roomsFailed = createAction('[Rooms] Read rooms failed');

export const readModels = createAction('[Models] Read models');

export const setModels = createAction('[Models] Set models',
    props<{models: Model[]}>()
);

export const modelsFailed = createAction('[Models] Read models failed');

export const updateModel = createAction('[Models] Update model',
    props<{currentModel: Model, updatedModel: Model}>()
);

export const deleteModel = createAction('[Models] Delete model',
    props<{modelId: string}>()
);
