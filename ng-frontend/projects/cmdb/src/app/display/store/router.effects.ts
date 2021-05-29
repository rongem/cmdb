import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { JwtLoginService, ReadActions } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromSelectDisplay from './display.selectors';

import { RouterState, getRouterState } from '../../shared/store/router/router.reducer';

@Injectable()
export class RouterEffects {
    loadItem$ = createEffect(() => this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        map((value: {payload: {routerState: RouterState}}) => value.payload.routerState),
        filter(value => this.jwt.validLogin.value === true && value.url.startsWith('/display/configuration-item/') && value.params &&
            value.params.id),
        map(value => (value.params.id as string).toLowerCase()),
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

    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private router: Router,
                private jwt: JwtLoginService) {
        this.jwt.validLogin.pipe(
            withLatestFrom(
                this.store.select(fromSelectDisplay.selectDisplayConfigurationItem),
                this.store.select(getRouterState),
            )
        ).subscribe(([validLogin, item, state]) => { // if an item url is called directly, there is no valid login, so loadItem$ fails
            if (validLogin === true) {
                if (state && state.state.url.startsWith('/display/configuration-item/') && state.state.params && state.state.params.id) {
                    const itemId: string = state.state.params.id;
                    if (!item || itemId !== item.id) {
                        this.store.dispatch(ReadActions.readConfigurationItem({ itemId }));
                    }
                }
            }
        });
    }
}

