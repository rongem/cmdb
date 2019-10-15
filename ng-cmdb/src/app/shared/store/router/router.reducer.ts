import { ActivatedRouteSnapshot, RouterStateSnapshot, Params, Data } from '@angular/router';
import { createFeatureSelector } from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';

export interface RouterState {
    url: string;
    queryParams: Params;
    params: Params;
    data: Data;
}

export interface State {
    route: fromRouter.RouterReducerState<RouterState>;
}

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterState>>('router');

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
