import { createAction, props } from '@ngrx/store';

import { Room } from 'src/app/shared/objects/asset/room.model';
import { Model } from 'src/app/shared/objects/model.model';

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
