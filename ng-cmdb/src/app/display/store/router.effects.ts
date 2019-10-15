import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom, takeWhile, tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { RouterState, getRouterState } from 'src/app/shared/store/router/router.reducer';
import { Guid } from 'src/app/shared/guid';

@Injectable()
export class RouterEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private router: Router) {}

    loadItem$ = createEffect(() => this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        map((value: {payload: {routerState: RouterState}}) => value.payload.routerState),
        takeWhile(value => value.url.startsWith('/display/configuration-item/') && value.params &&
            value.params.id && Guid.isGuid(value.params.id)),
        map(value => value.params.id as Guid),
        withLatestFrom(this.store.pipe(select(fromSelectDisplay.selectDisplayConfigurationItem))),
        takeWhile(value => !value[1] || value[0] !== value[1].id),
        map(value => value[0]),
        switchMap(value => of(DisplayActions.readConfigurationItem({ itemId: value }))),
    ));

    clearItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.clearConfigurationItem),
        withLatestFrom(this.store.pipe(select(getRouterState))),
        map(value => value[1].state),
        takeWhile(value => value.url.startsWith('/display/configuration-item/') &&
            value.params && value.params.id),
        tap(() => this.router.navigate(['display', 'search'])),
    ), { dispatch: false });
}

