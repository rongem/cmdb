import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';

import { RouterState, getRouterState } from '../../store/router/router.reducer';
import { Guid } from 'backend-access';

@Injectable()
export class RouterEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private router: Router) {}

    // loadRoom$ = createEffect(() => this.actions$.pipe(
    //     ofType(ROUTER_NAVIGATION),
    //     map((value: {payload: {routerState: RouterState}}) => value.payload.routerState),
    //     filter(value => value.url.startsWith('/room/') && value.params &&
    //         value.params.id && Guid.isGuid(value.params.id)),
    //     map(value => value.params.id as Guid),
    // ));

}

