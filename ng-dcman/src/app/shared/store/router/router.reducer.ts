import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Params, Data } from '@angular/router';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import { Guid } from 'src/app/shared/guid';

export interface RouterState {
    url: string;
    queryParams: Params;
    params: Params;
    data: Data;
}

export interface State {
    route: fromRouter.RouterReducerState<RouterState>;
}

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterState>>(fromApp.ROUTER);

export const selectRouterStateId = createSelector(getRouterState, state =>
    (state.state && state.state.params ? state.state.params.id : undefined) as Guid
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
            params: state.params,
            queryParams: routerState.root.queryParams,
            data: routerState.root.data,
        };
    }
}
