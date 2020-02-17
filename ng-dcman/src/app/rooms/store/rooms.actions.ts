import { createAction, props } from '@ngrx/store';
import { Room } from 'src/app/shared/objects/asset/room.model';

export const setRooms = createAction('[Rooms] Set rooms',
    props<{rooms: Room[]}>()
);

export const readRooms = createAction('[Rooms] Read rooms');
