import { createAction, props } from '@ngrx/store';

import { Rack } from 'src/app/shared/objects/asset/rack.model';

export const readRacks = createAction('[Racks] Read racks');

export const setRacks = createAction('[Racks] Set racks',
    props<{racks: Rack[]}>()
);

export const racksFailed = createAction('[Racks] Read racks failed');
