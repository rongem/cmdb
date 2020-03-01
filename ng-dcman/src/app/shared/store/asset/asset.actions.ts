import { createAction, props } from '@ngrx/store';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackMountable } from '../../objects/rack-mountable.model';

export const readRacks = createAction('[Racks] Read racks');

export const setRacks = createAction('[Racks] Set racks',
    props<{racks: Rack[]}>()
);

export const racksFailed = createAction('[Racks] Read racks failed');

export const readEnclosures = createAction('[Enclosures] Read enclosures');

export const setEnclosures = createAction('[Enclosures] Set enclosures',
    props<{enclosures: BladeEnclosure[]}>()
);

export const enclosuresFailed = createAction('[Enclosures] Read enclosures failed');

export const readRackServers = createAction('[RackServers] Read rackservers');

export const setRackServers = createAction('[RackServers] Set rackservers',
    props<{rackservers: RackMountable[]}>()
);

export const rackserversFailed = createAction('[RackServers] Read rackservers failed');
