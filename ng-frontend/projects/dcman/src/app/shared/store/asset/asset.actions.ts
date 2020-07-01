import { createAction, props } from '@ngrx/store';
import { ItemType } from 'backend-access';

import { Rack } from '../../objects/asset/rack.model';
import { Asset } from '../../objects/prototypes/asset.model';
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../../objects/asset/enclosure-mountable.model';
import { RackValue } from '../../objects/form-values/rack-value.model';
import { AssetValue } from '../../objects/form-values/asset-value.model';
import { AssetStatus } from '../../objects/asset/asset-status.enum';

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

export const updateAsset = createAction('[Asset] Update asset',
    props<{currentAsset: Asset, updatedAsset: AssetValue}>()
);

export const unmountRackMountable = createAction('[Asset] Unmount rack  mountable from rack',
    props<{rackMountable: RackMountable, status: AssetStatus}>()
);

export const unmountEnclosureMountable = createAction('[Asset] Unmount enclosure mountable from blade enclosure',
    props<{enclosureMountable: EnclosureMountable, status: AssetStatus}>()
);

export const takeAssetResponsibility = createAction('[Asset] Take responsibility for asset',
    props<{asset: Asset}>()
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

export const deleteEnclosure = createAction('[Enclosures] Delete enclosure',
    props<{enclosureId: string}>()
);

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

export const readRackMountable = createAction('[RackMountable] Read single rack mountable item',
    props<{itemId: string, itemType: ItemType}>()
);

export const setRackMountable = createAction('[RackMountables] Add or replace rack mountable item',
    props<{rackMountable: RackMountable}>()
);

export const readEnclosureMountable = createAction('[EnclosureMountable] Read single enclosure mountable item',
    props<{itemId: string, itemType: ItemType}>()
);

export const setEnclosureMountable = createAction('[EnclosureMountable] Add or replace enclosure mountable item',
    props<{enclosureMountable: EnclosureMountable}>()
);

export const mountRackMountableToRack = createAction('[RackMountable] Mount a rack mountable asset into a rack',
    props<{heightUnits: string, rackMountable: RackMountable, rack: Rack}>()
);

export const mountEnclosureMountableToEnclosure = createAction('[EnclosureMountable] Mount an enclsoure mountable asset into a blade enclosure',
    props<{enclosureMountable: EnclosureMountable, slot: string, enclosure: BladeEnclosure}>()
);

