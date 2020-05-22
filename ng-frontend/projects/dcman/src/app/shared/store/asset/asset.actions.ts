import { createAction, props } from '@ngrx/store';

import { Rack } from '../../objects/asset/rack.model';
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { RackServerHardware } from '../../objects/asset/rack-server-hardware.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';
import { EnclosureMountable } from '../../objects/asset/enclosure-mountable.model';
import { RackValue } from '../../objects/form-values/rack-value.model';
import { AssetValue } from '../../objects/form-values/asset-value.model';

export const readRacks = createAction('[Racks] Read racks');

export const setRacks = createAction('[Racks] Set racks',
    props<{racks: Rack[]}>()
);

export const racksFailed = createAction('[Racks] Read racks failed');

export const readRack = createAction('[Rack] Read single rack',
    props<{rackId: string}>()
);

export const setRack = createAction('[Rack] Set single rack',
    props<{rack: Rack}>()
);

export const updateRack = createAction('[Racks] Update rack',
    props<{currentRack: Rack, updatedRack: RackValue}>()
);

export const deleteRack = createAction('[Racks] Delete rack',
    props<{rackId: string}>()
);

export const readEnclosures = createAction('[Enclosures] Read enclosures');

export const setEnclosures = createAction('[Enclosures] Set enclosures',
    props<{enclosures: BladeEnclosure[]}>()
);

export const enclosuresFailed = createAction('[Enclosures] Read enclosures failed');

export const readEnclosure = createAction('[Enclosure] Read single enclosure',
    props<{enclosureId: string}>()
);

export const setEnclosure = createAction('[Enclosure] Set single enclosure',
    props<{enclosure: BladeEnclosure}>()
);

export const updateEnclosure = createAction('[Enclosures] Update enclosure',
    props<{currentEnclosure: BladeEnclosure, updatedEnclosure: AssetValue}>()
);

export const deleteEnclosure = createAction('[Enclosures] Delete enclosure',
    props<{enclosureId: string}>()
);

export const readRackServers = createAction('[RackServers] Read rack server hardware');

export const readRackServerHardware = createAction('[RackServer] Read single rack server hardware',
    props<{itemId: string}>()
);

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

export const readBladesServerHardware = createAction('[BladeServer] Read single blade server hardware',
    props<{itemId: string}>()
);

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

export const createAsset = createAction('[Asset] Create asset item',
    props<{asset: AssetValue}>()
);

export const readRackMountable = createAction('[RackMountables] Read rack mountable item',
    props<{itemId: string}>()
);

export const readEnclosureMountable = createAction('[EnclosureMountables] Read enclosure mountable item',
    props<{itemId: string}>()
);

