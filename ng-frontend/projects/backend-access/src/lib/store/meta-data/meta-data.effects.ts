import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as MetaDataActions from './meta-data.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { RestMetaData } from '../../rest-api/meta-data/meta-data.model';
import { getUrl } from '../../functions';
import { MetaData } from '../../objects/meta-data/meta-data.model';

const METADATA = 'MetaData';

@Injectable()
export class MetaDataEffects {
    fetchMetaData$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.readState),
        switchMap(() => {
            return this.http.get<RestMetaData>(getUrl(METADATA)).pipe(
                map((result: RestMetaData) => {
                    this.store.dispatch(ErrorActions.clearError());
                    const metaData = new MetaData(result);
                    return MetaDataActions.setState({metaData});
                }),
                catchError((error) => {
                    this.store.dispatch(ErrorActions.error({error, fatal: true}));
                    return of(MetaDataActions.invalidate());
                })
            );
        }),
    ));

    constructor(private actions$: Actions,
                private store: Store,
                private http: HttpClient) {}
}

