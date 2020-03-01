import { Action, createReducer, on } from '@ngrx/store';

import * as AssetActions from './asset.actions';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackMountable } from 'src/app/shared/objects/rack-mountable.model';

export interface State {
    racks: Rack[];
    racksLoading: boolean;
    racksReady: boolean;
    enclosures: BladeEnclosure[];
    enclosuresLoading: boolean;
    enclosuresReady: boolean;
    rackServers: RackMountable[];
    rackServersLoading: boolean;
    rackServersReady: boolean;
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
            rackServers: action.rackservers,
            rackServersLoading: false,
            rackServersReady: true,
        })),
        on(AssetActions.rackserversFailed, (state, action) => ({
            ...state,
            rackServers: [],
            rackServersLoading: false,
            rackServersReady: false,
        })),
        )(assetState, assetAction);
    }

