import { createAction, props } from '@ngrx/store';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackServerHardware } from 'src/app/shared/objects/asset/rack-server-hardware.model';
import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';
import { BladeServerHardware } from 'src/app/shared/objects/asset/blade-server-hardware.model';

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

export const readBackupSystems = createAction('[BackupSystems] Read backup systems');

export const setBackupSystems = createAction('[BackupSystems] Set backup systems',
    props<{backupSystems: RackMountable[]}>()
);

export const backupSystemsFailed = createAction('[BackupSystems] Read backup systems failed');

export const readNetworkSwitches = createAction('[NetworkSwitches] Read network switches');

export const setNetworkSwitches = createAction('[NetworkSwitches] Set network switches',
    props<{networkSwitches: RackMountable[]}>()
);

export const networkSwitchesFailed = createAction('[NetworkSwitches] Read network switches failed');

export const readStorageSystems = createAction('[StorageSystems] Read storage systems');

export const setStorageSystems = createAction('[StorageSystems] Set storage systems',
    props<{storageSystems: RackMountable[]}>()
);

export const storageSystemsFailed = createAction('[StorageSystems] Read storage systems failed');

export const readSANSwitches = createAction('[SANSwitches] Read SAN switches');

export const setSANSwitches = createAction('[SANSwitches] Set SAN switches',
    props<{sanSwitches: RackMountable[]}>()
);

export const sANSwitchesFailed = createAction('[SANSwitches] Read SAN switches failed');

export const readBladeServers = createAction('[BladeServers] Read blade server hardware');

export const setBladeServers = createAction('[BladeServers] Set blade server hardware',
    props<{bladeServers: BladeServerHardware[]}>()
);

export const bladeServersFailed = createAction('[BladeServers] Read blade server hardware failed');

