import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as MetaDataActions from './meta-data.actions';
import { MetaData } from '../objects/meta-data.model';
import { getUrl } from './functions';

const METADATA = 'MetaData';

@Injectable()
export class MetaDataEffects {
    fetchMetaData$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.readState),
        switchMap(() => {
            return this.http.get<MetaData>(getUrl(METADATA)).pipe(
                map((metaData: MetaData) => MetaDataActions.setState({metaData})),
                catchError((error) => of(MetaDataActions.error({error, invalidateData: true})))
            );
        }),
    ));

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

