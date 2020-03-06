import { Action, createReducer, on } from '@ngrx/store';

import * as AssetActions from './asset.actions';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';
import { RackServerHardware } from 'src/app/shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from 'src/app/shared/objects/asset/blade-server-hardware.model';

export interface State {
    racks: Rack[];
    racksLoading: boolean;
    racksReady: boolean;
    enclosures: BladeEnclosure[];
    enclosuresLoading: boolean;
    enclosuresReady: boolean;
    rackServers: RackServerHardware[];
    rackServersLoading: boolean;
    rackServersReady: boolean;
    backupSystems: RackMountable[];
    backupSystemsLoading: boolean;
    backupSystemsReady: boolean;
    hardwareAppliances: RackMountable[];
    hardwareAppliancesLoading: boolean;
    hardwareAppliancesReady: boolean;
    pDUs: RackMountable[];
    pDUsLoading: boolean;
    pDUsReady: boolean;
    networkSwitches: RackMountable[];
    networkSwitchesLoading: boolean;
    networkSwitchesReady: boolean;
    sANSwitches: RackMountable[];
    sANSwitchesLoading: boolean;
    sANSwitchesReady: boolean;
    storageSystems: RackMountable[];
    storageSystemsLoading: boolean;
    storageSystemsReady: boolean;
    bladeServers: BladeServerHardware[];
    bladeServersLoading: boolean;
    bladeServersReady: boolean;
}

const initialState: State = {
    racks: [],
    racksLoading: false,
    racksReady: false,
    enclosures: [],
    enclosuresLoading: false,
    enclosuresReady: false,
    rackServers: [],
    rackServersLoading: false,
    rackServersReady: false,
    backupSystems: [],
    backupSystemsLoading: false,
    backupSystemsReady: false,
    hardwareAppliances: [],
    hardwareAppliancesLoading: false,
    hardwareAppliancesReady: false,
    pDUs: [],
    pDUsLoading: false,
    pDUsReady: false,
    networkSwitches: [],
    networkSwitchesLoading: false,
    networkSwitchesReady: false,
    sANSwitches: [],
    sANSwitchesLoading: false,
    sANSwitchesReady: false,
    storageSystems: [],
    storageSystemsLoading: false,
    storageSystemsReady: false,
    bladeServers: [],
    bladeServersLoading: false,
    bladeServersReady: false,
};

export function AssetReducer(assetState: State | undefined, assetAction: Action): State {
    return createReducer(
        initialState,
        on(AssetActions.readRacks, (state, action) => ({
            ...state,
            racks: [],
            racksLoading: true,
            racksReady: false,
        })),
        on(AssetActions.setRacks, (state, action) => ({
            ...state,
            racks: action.racks,
            racksLoading: false,
            racksReady: true,
        })),
        on(AssetActions.racksFailed, (state, action) => ({
            ...state,
            racks: [],
            racksLoading: false,
            racksReady: false,
        })),
        on(AssetActions.readEnclosures, (state, action) => ({
            ...state,
            enclosures: [],
            enclosuresLoading: true,
            enclosuresReady: false,
        })),
        on(AssetActions.setEnclosures, (state, action) => ({
            ...state,
            enclosures: action.enclosures,
            enclosuresLoading: false,
            enclosuresReady: true,
        })),
        on(AssetActions.enclosuresFailed, (state, action) => ({
            ...state,
            enclosures: [],
            enclosuresLoading: false,
            enclosuresReady: false,
        })),
        on(AssetActions.readRackServers, (state, action) => ({
            ...state,
            rackServers: [],
            rackServersLoading: true,
            rackServersReady: false,
        })),
        on(AssetActions.setRackServers, (state, action) => ({
            ...state,
            rackServers: action.rackServers,
            rackServersLoading: false,
            rackServersReady: true,
        })),
        on(AssetActions.rackServersFailed, (state, action) => ({
            ...state,
            rackServers: [],
            rackServersLoading: false,
            rackServersReady: false,
        })),
        on(AssetActions.readBackupSystems, (state, action) => ({
            ...state,
            backupSystems: [],
            backupSystemsLoading: true,
            backupSystemsReady: false,
        })),
        on(AssetActions.setBackupSystems, (state, action) => ({
            ...state,
            backupSystems: action.backupSystems,
            backupSystemsLoading: false,
            backupSystemsReady: true,
        })),
        on(AssetActions.backupSystemsFailed, (state, action) => ({
            ...state,
            backupSystems: [],
            backupSystemsLoading: false,
            backupSystemsReady: false,
        })),
        on(AssetActions.readNetworkSwitches, (state, action) => ({
            ...state,
            networkSwitches: [],
            networkSwitchesLoading: true,
            networkSwitchesReady: false,
        })),
        on(AssetActions.setNetworkSwitches, (state, action) => ({
            ...state,
            networkSwitches: action.networkSwitches,
            networkSwitchesLoading: false,
            networkSwitchesReady: true,
        })),
        on(AssetActions.networkSwitchesFailed, (state, action) => ({
            ...state,
            networkSwitches: [],
            networkSwitchesLoading: false,
            networkSwitchesReady: false,
        })),
        on(AssetActions.readSANSwitches, (state, action) => ({
            ...state,
            sANSwitches: [],
            sANSwitchesLoading: true,
            sANSwitchesReady: false,
        })),
        on(AssetActions.setSANSwitches, (state, action) => ({
            ...state,
            sANSwitches: action.sanSwitches,
            sANSwitchesLoading: false,
            sANSwitchesReady: true,
        })),
        on(AssetActions.sANSwitchesFailed, (state, action) => ({
            ...state,
            sANSwitches: [],
            sANSwitchesLoading: false,
            sANSwitchesReady: false,
        })),
        on(AssetActions.readStorageSystems, (state, action) => ({
            ...state,
            storageSystems: [],
            storageSystemsLoading: true,
            storageSystemsReady: false,
        })),
        on(AssetActions.setStorageSystems, (state, action) => ({
            ...state,
            storageSystems: action.storageSystems,
            storageSystemsLoading: false,
            storageSystemsReady: true,
        })),
        on(AssetActions.storageSystemsFailed, (state, action) => ({
            ...state,
            storageSystems: [],
            storageSystemsLoading: false,
            storageSystemsReady: false,
        })),
        on(AssetActions.readBladeServers, (state, action) => ({
            ...state,
            bladeServers: [],
            bladeServersLoading: true,
            bladeServersReady: false,
        })),
        on(AssetActions.setBladeServers, (state, action) => ({
            ...state,
            bladeServers: action.bladeServers,
            bladeServersLoading: false,
            bladeServersReady: true,
        })),
        on(AssetActions.bladeServersFailed, (state, action) => ({
            ...state,
            bladeServers: [],
            bladeServersLoading: false,
            bladeServersReady: false,
        })),
        )(assetState, assetAction);
    }

