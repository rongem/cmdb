import { createAction, props } from '@ngrx/store';
import { ConfigurationItem, FullConfigurationItem } from 'backend-access';

import { ProvisionedSystem } from '../../objects/asset/provisioned-system.model';
import { AssetStatus } from '../../objects/asset/asset-status.enum';
import { Asset } from '../../objects/prototypes/asset.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';
import { RackServerHardware } from '../../objects/asset/rack-server-hardware.model';

export const readProvisionableSystems = createAction('[Provisionable systems] Read all systems from backend');

export const setProvisionableSystems = createAction('[Provisionable systems] Set systems',
    props<{systems: ConfigurationItem[]}>()
);

export const provisionableSystemsFailed = createAction('[Provisionable systems] Failed reading all systems from backend');

export const removeProvisionedSystem = createAction('[ProvisionedSystem] Remove provisoned System (delete item)',
    props<{provisionedSystem: ProvisionedSystem, asset: Asset, status: AssetStatus}>()
);

export const connectExistingSystemToServerHardware = createAction('[Provisionable System] Connect existing provisionable system to server hardware',
    props<{
        provisionableSystemId: string,
        provisionableTypeName: string,
        serverHardware: BladeServerHardware |  RackServerHardware,
        status: AssetStatus
    }>()
);

export const disconnectProvisionedSystem = createAction('[ProvisionedSystem] Disconnect provisoned System (do not delete item)',
    props<{provisionedSystem: ProvisionedSystem, serverHardware: BladeServerHardware |  RackServerHardware}>()
);

export const createAndConnectProvisionableSystem = createAction('[Provisionable System] Create new provisionable system and connect it to server hardware',
    props<{typeName: string, name: string, serverHardware: BladeServerHardware |  RackServerHardware, status: AssetStatus}>()
);

export const addProvisionableSystem = createAction('[Provisionable System] Add provisionable system',
    props<{system: ConfigurationItem}>()
);

