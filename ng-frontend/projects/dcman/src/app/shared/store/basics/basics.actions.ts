import { createAction, props } from '@ngrx/store';

import { Room } from '../../objects/asset/room.model';
import { Model } from '../../objects/model.model';
import { RuleStore } from '../../objects/appsettings/rule-store.model';

export const resetRetryCount = createAction('[MetaData] Reset retry count to zero');

export const validateSchema = createAction('[MetaData] Schema is valid');

export const invalidateSchema = createAction('[MetaData] Schema is invalid');

export const noAction = createAction('[*] No Action');

export const setRuleStore = createAction('[MetaData] Set store for connection rules',
    props<{ruleStores: RuleStore[]}>()
);

export const readRooms = createAction('[Rooms] Read rooms');

export const readRoom = createAction('[Rooms] Read single room',
    props<{roomId: string}>()
);

export const setRooms = createAction('[Rooms] Set rooms',
    props<{rooms: Room[]}>()
);

export const setRoom = createAction('[Rooms] Set single room',
    props<{room: Room}>()
);

export const roomsFailed = createAction('[Rooms] Read rooms failed');

export const createRoom = createAction('[Rooms] Create room',
    props<{room: Room}>()
);

export const updateRoom = createAction('[Rooms] Update room',
    props<{currentRoom: Room, updatedRoom: Room}>()
);

export const deleteRoom = createAction('[Rooms] Delete room',
    props<{roomId: string}>()
);

export const readModels = createAction('[Models] Read models');

export const readModel = createAction('[Models] Read single model',
    props<{modelId: string}>()
);

export const setModels = createAction('[Models] Set models',
    props<{models: Model[]}>()
);

export const setModel = createAction('[Models] Set model',
    props<{model: Model}>()
);

export const modelsFailed = createAction('[Models] Read models failed');

export const createModel = createAction('[Models] Create model',
    props<{model: Model}>()
);

export const updateModel = createAction('[Models] Update model',
    props<{currentModel: Model, updatedModel: Model}>()
);

export const deleteModel = createAction('[Models] Delete model',
    props<{modelId: string}>()
);
