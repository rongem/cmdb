import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors, ItemType, ConfigurationItem } from 'backend-access';

import * as fromApp from '../app.reducer';
import * as fromProv from './provisionable.reducer';
import * as fromSelectAsset from '../asset/asset.selectors';

import { Mappings } from '../../objects/appsettings/mappings.model';
import { RackServerHardware } from '../../objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';

export const selectState = createFeatureSelector<fromProv.State>(fromApp.PROVISIONABLESYSTEMS);

export const selectProvisionableTypes = createSelector(MetaDataSelectors.selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.provisionedSystems.includes(t.name.toLocaleLowerCase()))
);

export const selectSystems = createSelector(selectState, state => state.provisionableSystems);

export const selectSystemsByType = createSelector(selectSystems, (systems: ConfigurationItem[], type: string) =>
    systems.filter(s => s.type.toLocaleLowerCase() === type.toLocaleLowerCase())
);

const selectUsedIds = createSelector(fromSelectAsset.selectRackServers, fromSelectAsset.selectBladeServers,
    (rackServers: RackServerHardware[], bladeServers: BladeServerHardware[]) => [
        ...rackServers.filter(s => !!s.provisionedSystem).map(s => s.provisionedSystem.id),
        ...bladeServers.filter(s => !!s.provisionedSystem).map(s => s.provisionedSystem.id)
    ]
);

export const selectAvailableSystemsByType = createSelector(selectSystemsByType, selectUsedIds,
    (systems: ConfigurationItem[], usedIds: string[], type: string) => systems.filter(s => !usedIds.includes(s.id))
);
