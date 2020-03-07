import { Action, createReducer, on } from '@ngrx/store';

import * as AssetActions from './asset.actions';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';
import { RackServerHardware } from 'src/app/shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from 'src/app/shared/objects/asset/blade-server-hardware.model';
import { EnclosureMountable } from 'src/app/shared/objects/asset/enclosure-mountable.model';

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
    rackMountables: RackMountable[];
    rackMountablesLoading: {};
    rackMountablesReady: {};
    bladeServers: BladeServerHardware[];
    bladeServersLoading: boolean;
    bladeServersReady: boolean;
    enclosureMountables: EnclosureMountable[];
    enclosureMountablesLoading: {};
    enclosureMountablesReady: {}
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
    rackMountables: [],
    rackMountablesLoading: {},
    rackMountablesReady: {},
    bladeServers: [],
    bladeServersLoading: false,
    bladeServersReady: false,
    enclosureMountables: [],
    enclosureMountablesLoading: {},
    enclosureMountablesReady: {},
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
        on(AssetActions.clearRackMountables, (state, action) => ({
            ...state,
            rackMountables: [],
            rackMountablesLoading: {},
            rackMountablesReady: {},
        })),
        on(AssetActions.readRackMountables, (state, action) => ({
            ...state,
            rackMountablesLoading: {
                ...state.rackMountablesLoading,
                [action.itemType]: true,
            },
            rackMountablesReady: {
                 ...state.rackMountablesReady,
                 [action.itemType]: false,
            },
        })),
        on(AssetActions.addRackMountables, (state, action) => ({
            ...state,
            rackMountables: [...state.rackMountables, ...action.rackMountables],
            rackMountablesLoading: {
                ...state.rackMountablesLoading,
                [action.itemType]: false,
            },
            rackMountablesReady: {
                 ...state.rackMountablesReady,
                 [action.itemType]: true,
            },
        })),
        on(AssetActions.rackMountablesFailed, (state, action) => ({
            ...state,
            rackMountablesLoading: {
                ...state.rackMountablesLoading,
                [action.itemType]: false,
            },
            rackMountablesReady: {
                 ...state.rackMountablesReady,
                 [action.itemType]: false,
            },
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
        on(AssetActions.clearEnclosureMountables, (state, action) => ({
            ...state,
            enclosureMountables: [],
            enclosureMountablesLoading: {},
            enclosureMountablesReady: {},
        })),
        on(AssetActions.readEnclosureMountables, (state, action) => ({
            ...state,
            enclosureMountablesLoading: {
                ...state.enclosureMountablesLoading,
                [action.itemType]: true,
            },
            enclosureMountablesReady: {
                 ...state.enclosureMountablesReady,
                 [action.itemType]: false,
            },
        })),
        on(AssetActions.addEnclosureMountables, (state, action) => ({
            ...state,
            enclosureMountables: [...state.enclosureMountables, ...action.enclosureMountables],
            enclosureMountablesLoading: {
                ...state.enclosureMountablesLoading,
                [action.itemType]: false,
            },
            enclosureMountablesReady: {
                 ...state.enclosureMountablesReady,
                 [action.itemType]: true,
            },
        })),
        on(AssetActions.enclosureMountablesFailed, (state, action) => ({
            ...state,
            enclosureMountablesLoading: {
                ...state.enclosureMountablesLoading,
                [action.itemType]: false,
            },
            enclosureMountablesReady: {
                 ...state.enclosureMountablesReady,
                 [action.itemType]: false,
            },
        })),
        )(assetState, assetAction);
    }

