import { Action, createReducer, on } from '@ngrx/store';

import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import * as AssetActions from './asset.actions';

import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';

export interface State {
    racks: Rack[];
    racksLoading: boolean;
    racksReady: boolean;
    enclosures: BladeEnclosure[];
    enclosuresLoading: boolean;
    enclosuresReady: boolean;
}

const initialState: State = {
    racks: [],
    racksLoading: false,
    racksReady: false,
    enclosures: [],
    enclosuresLoading: false,
    enclosuresReady: false,
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
        )(assetState, assetAction);
    }

