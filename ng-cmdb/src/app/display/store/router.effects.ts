import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';

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
        filter(value => value.url.startsWith('/display/configuration-item/') && value.params &&
            value.params.id && Guid.isGuid(value.params.id)),
        map(value => value.params.id as Guid),
        withLatestFrom(this.store.select(fromSelectDisplay.selectDisplayConfigurationItem)),
        filter(([id, item]) => !item || id !== item.id),
        switchMap(([itemId, item]) => of(DisplayActions.readConfigurationItem({ itemId }))),
    ));

    clearItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.clearConfigurationItem),
        withLatestFrom(this.store.select(getRouterState)),
        map(([action, value]) => value.state),
        filter(value => value.url.startsWith('/display/configuration-item/') &&
            value.params && value.params.id),
        tap(() => this.router.navigate(['display', 'search'])),
    ), { dispatch: false });
}

