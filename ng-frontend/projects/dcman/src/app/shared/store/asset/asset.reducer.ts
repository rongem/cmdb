/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Action, createReducer, on } from '@ngrx/store';

import * as AssetActions from './asset.actions';

import { Rack } from '../../objects/asset/rack.model';
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../../objects/asset/enclosure-mountable.model';

export interface State {
    racks: Rack[];
    racksLoading: boolean;
    racksReady: boolean;
    enclosures: BladeEnclosure[];
    enclosuresLoading: boolean;
    enclosuresReady: boolean;
    rackMountables: RackMountable[];
    rackMountablesLoading: {[key: string]: boolean};
    rackMountablesReady: {[key: string]: boolean};
    enclosureMountables: EnclosureMountable[];
    enclosureMountablesLoading: {[key: string]: boolean};
    enclosureMountablesReady: {[key: string]: boolean};
}

const initialState: State = {
    racks: [],
    racksLoading: false,
    racksReady: false,
    enclosures: [],
    enclosuresLoading: false,
    enclosuresReady: false,
    rackMountables: [],
    rackMountablesLoading: {},
    rackMountablesReady: {},
    enclosureMountables: [],
    enclosureMountablesLoading: {},
    enclosureMountablesReady: {},
};

export function assetReducer(assetState: State | undefined, assetAction: Action): State {
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
        on(AssetActions.setRack, (state, action) => ({
            ...state,
            racks: [...state.racks.filter(r => r.id !== action.rack.id), action.rack].sort((a, b) => a.name.localeCompare(b.name)),
        })),
        on(AssetActions.deleteRack, (state, action) => ({
            ...state,
            racks: [...state.racks.filter(r => r.id !== action.rackId)],
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
        on(AssetActions.setEnclosure, (state, action) => ({
            ...state,
            enclosures: [...state.enclosures.filter(r => r.id !== action.enclosure.id), action.enclosure].sort((a, b) =>
                a.name.localeCompare(b.name)),
        })),
        on(AssetActions.deleteEnclosure, (state, action) => ({
            ...state,
            enclosures: [...state.enclosures.filter(r => r.id !== action.enclosureId)],
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
        on(AssetActions.setRackMountable, (state, action) => ({
            ...state,
            rackMountables: [...state.rackMountables.filter(r => r.id !== action.rackMountable.id), action.rackMountable].sort((a, b) =>
                a.name.localeCompare(b.name)),
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
        on(AssetActions.setEnclosureMountable, (state, action) => ({
            ...state,
            enclosureMountables: [...state.enclosureMountables.filter(r => r.id !== action.enclosureMountable.id),
                action.enclosureMountable].sort((a, b) => a.name.localeCompare(b.name)),
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

