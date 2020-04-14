import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Guid, ReadActions } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromSelectDisplay from './display.selectors';

import { RouterState, getRouterState } from '../../shared/store/router/router.reducer';

@Injectable()
export class RouterEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private router: Router) {}

    loadItem$ = createEffect(() => this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        map((value: {payload: {routerState: RouterState}}) => value.payload.routerState),
        filter(value => value.url.startsWith('/display/configuration-item/') && value.params &&
            value.params.id && Guid.isGuid(value.params.id)),
        map(value => Guid.parse(value.params.id).toString()),
        withLatestFrom(this.store.select(fromSelectDisplay.selectDisplayConfigurationItem)),
        filter(([id, item]) => !item || id !== item.id),
        switchMap(([itemId, item]) => of(ReadActions.readConfigurationItem({ itemId }))),
    ));

    clearItem$ = createEffect(() => this.actions$.pipe(
        ofType(ReadActions.clearConfigurationItem),
        withLatestFrom(this.store.select(getRouterState)),
        map(([action, value]) => value.state),
        filter(value => value.url.startsWith('/display/configuration-item/') &&
            value.params && value.params.id),
        tap(() => this.router.navigate(['display', 'search'])),
    ), { dispatch: false });
}

