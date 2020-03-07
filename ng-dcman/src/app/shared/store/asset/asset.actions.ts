import { createAction, props } from '@ngrx/store';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackServerHardware } from 'src/app/shared/objects/asset/rack-server-hardware.model';
import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';
import { BladeServerHardware } from 'src/app/shared/objects/asset/blade-server-hardware.model';
import { EnclosureMountable } from 'src/app/shared/objects/asset/enclosure-mountable.model';

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
    props<{rackServers: RackServerHardware[]}>()
);

export const rackServersFailed = createAction('[RackServers] Read rack server hardware failed');

export const readRackMountables = createAction('[RackMountables] Read rack mountable items of type',
    props<{itemType: string}>()
);

export const addRackMountables = createAction('[RackMountables] Add rack mountable items to list',
    props<{rackMountables: RackMountable[], itemType: string}>()
);

export const rackMountablesFailed = createAction('[RackMountables] Rack mountable items failed',
    props<{itemType: string}>()
);

export const clearRackMountables = createAction('[RackMountables] Clear all rack mountable items');

export const readBladeServers = createAction('[BladeServers] Read blade server hardware');

export const setBladeServers = createAction('[BladeServers] Set blade server hardware',
    props<{bladeServers: BladeServerHardware[]}>()
);

export const bladeServersFailed = createAction('[BladeServers] Read blade server hardware failed');

export const readEnclosureMountables = createAction('[EnclosureMountables] Read enclosure mountable items of type',
    props<{itemType: string}>()
);

export const addEnclosureMountables = createAction('[EnclosureMountables] Add enclosure mountable items to list',
    props<{enclosureMountables: EnclosureMountable[], itemType: string}>()
);

export const enclosureMountablesFailed = createAction('[EnclosureMountables] Enclosure mountable items failed',
    props<{itemType: string}>()
);

export const clearEnclosureMountables = createAction('[EnclosureMountables] Clear all enclosure mountable items');

