import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as MetaDataActions from './meta-data.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { readMetaData } from '../read-data/read.functions';

@Injectable()
export class MetaDataEffects {
    fetchMetaData$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.readState),
        switchMap(() => readMetaData(this.http).pipe(
            map(metaData => {
                this.store.dispatch(ErrorActions.clearError());
                return MetaDataActions.setState({metaData});
            }),
            catchError((error) => {
                this.store.dispatch(ErrorActions.error({error, fatal: true}));
                return of(MetaDataActions.invalidate());
            }),
        )),
    ));

    constructor(private actions$: Actions,
                private store: Store,
                private http: HttpClient) {}
}

