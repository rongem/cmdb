import { createAction, props } from '@ngrx/store';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackServerHardware } from 'src/app/shared/objects/asset/rack-server-hardware.model';

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

export const readRackServers = createAction('[RackServers] Read rack server hardware');

export const setRackServers = createAction('[RackServers] Set rack server hardware',
    props<{rackservers: RackServerHardware[]}>()
);

export const rackserversFailed = createAction('[RackServers] Read rack server hardware failed');
