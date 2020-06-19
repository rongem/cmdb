import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from 'backend-access';

import { ProvisionedSystem } from '../../objects/asset/provisioned-system.model';
import { AssetStatus } from '../../objects/asset/asset-status.enum';
import { Asset } from '../../objects/prototypes/asset.model';

export const readProvisionableSystems = createAction('[Provisionable systems] Read all systems from backend');

export const setProvisionableSystems = createAction('[Provisionable systems] Set systems',
    props<{systems: ConfigurationItem[]}>()
);

export const provisionableSystemsFailed = createAction('[Provisionable systems] Failed reading all systems from backend');

export const removeProvisionedSystem = createAction('[ProvisionedSystem] Remove provisoned System (delete item)',
    props<{provisionedSystem: ProvisionedSystem, asset: Asset, status: AssetStatus}>()
);

