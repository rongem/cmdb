import { createAction, props } from '@ngrx/store';
import { Room } from 'src/app/shared/objects/assets/room.model';

export const setRooms = createAction('[Rooms] Set rooms',
    props<{rooms: Room[]}>()
);
