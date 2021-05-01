import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as ReadActions from './read.actions';

import { fullConfigurationItem } from './read.functions';

@Injectable()
export class DisplayEffects {
    readConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(ReadActions.readConfigurationItem),
        mergeMap(action =>
            fullConfigurationItem(this.http, this.store, action.itemId).pipe(
                map(configurationItem => ReadActions.setConfigurationItem({configurationItem})),
                catchError((error: HttpErrorResponse) => of(ReadActions.clearConfigurationItem({success: false}))),
            )
        )
    ));

    constructor(private actions$: Actions,
        private store: Store,
        private http: HttpClient) {}
}
