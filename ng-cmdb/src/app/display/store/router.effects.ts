import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, iif } from 'rxjs';
import { switchMap, concatMap, tap, map, skipUntil, filter, withLatestFrom, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as EditActions from './edit.actions';
import * as SearchActions from './search.actions';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { RouterState } from 'src/app/shared/store/router/router.reducer';
import { VisibleComponent } from './display.reducer';
import { Guid } from 'src/app/shared/guid';

@Injectable()
export class RouterEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    loadItem$ = createEffect(() => this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        map ((value: {payload: {routerState: RouterState}}) => value.payload.routerState),
        takeWhile(value => value.url.startsWith('/display/configuration-item/') && value.params &&
            value.params.id && Guid.isGuid(value.params.id)),
        map(value => value.params.id as Guid),
        withLatestFrom(this.store.pipe(select(fromSelectDisplay.selectDisplayConfigurationItem))),
        takeWhile(value => !value[1] || value[0] !== value[1].id),
        map(value => value[0]),
        switchMap(value => of(DisplayActions.readConfigurationItem({ itemId: value }))),
    ));
}

