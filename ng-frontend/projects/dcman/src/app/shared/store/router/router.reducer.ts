import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Params, Data } from '@angular/router';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Guid } from 'backend-access';

import * as fromRouter from '@ngrx/router-store';
import * as fromApp from '../app.reducer';
import { llc } from '../functions';
import { ExtendedAppConfigService } from '../../app-config.service';

export interface RouterState {
    url: string;
    queryParams: Params;
    params: Params;
    fragment: string;
    data: Data;
}

export interface State {
    route: fromRouter.RouterReducerState<RouterState>;
}

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterState>>(fromApp.ROUTER);

export const selectRouterStateId = createSelector(getRouterState, state =>
    (state.state && state.state.params && state.state.params.id ?
        state.state.params.id : undefined) as string
);

@Injectable()
export class RouterCustomSerializer implements fromRouter.RouterStateSerializer<RouterState> {
    serialize(routerState: RouterStateSnapshot): RouterState {
        let state: ActivatedRouteSnapshot = routerState.root;
        while (state.firstChild) {
            state = state.firstChild;
        }
        return {
            url: routerState.url,
            params: state.params ? {
                ...state.params,
                id: ExtendedAppConfigService.settings.backend.version === 1 ? (state.params.id && Guid.isGuid(llc(state.params.id)) ?
                    Guid.parse(llc(state.params.id)).toString() : undefined) :
                    state.params.id,
            } : undefined,
            queryParams: routerState.root.queryParams,
            fragment: routerState.root.fragment,
            data: routerState.root.data,
        };
    }
}
