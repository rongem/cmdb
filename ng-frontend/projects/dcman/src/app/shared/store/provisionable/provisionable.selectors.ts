import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetaDataSelectors, ItemType, ConfigurationItem } from 'backend-access';

import * as fromApp from '../app.reducer';
import * as fromProv from './provisionable.reducer';
import * as fromSelectAsset from '../asset/asset.selectors';

import { Mappings } from '../../objects/appsettings/mappings.model';
import { RackServerHardware } from '../../objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';
import { llc, llcc } from '../functions';

export const selectState = createFeatureSelector<fromProv.State>(fromApp.PROVISIONABLESYSTEMS);

export const selectProvisionableTypes = createSelector(MetaDataSelectors.selectItemTypes, (itemTypes: ItemType[]) =>
    itemTypes.filter(t => Mappings.provisionedSystems.includes(llc(t.name)))
);

export const selectSystems = createSelector(selectState, state => state.provisionableSystems);

export const selectSystemsByTypeName = (type: string) => createSelector(selectSystems, (systems: ConfigurationItem[]) =>
    systems.filter(s => llcc(s.type, type))
);

export const selectSystemsByTypeId = (typeId: string) => createSelector(selectSystems, (systems: ConfigurationItem[]) =>
    systems.filter(s => s.typeId === typeId)
);

const selectUsedIds = createSelector(fromSelectAsset.selectRackServers, fromSelectAsset.selectBladeServers,
    (rackServers, bladeServers) => [
        ...rackServers.filter(s => !!(s).provisionedSystem).map(s => s.provisionedSystem.id),
        ...bladeServers.filter(s => !!s.provisionedSystem).map(s => s.provisionedSystem.id)
    ]
);

export const selectAvailableSystemsByTypeName = (type: string) => createSelector(selectSystemsByTypeName(type), selectUsedIds,
    (systems: ConfigurationItem[], usedIds: string[], ) => systems.filter(s => !usedIds.includes(s.id))
);

export const selectAvailableSystemsByTypeId = (typeId: string) => createSelector(selectSystemsByTypeId(typeId), selectUsedIds,
    (systems: ConfigurationItem[], usedIds: string[]) => systems.filter(s => !usedIds.includes(s.id))
);
