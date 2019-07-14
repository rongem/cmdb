import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as MetaDataActions from './meta-data.actions';
import { MetaData } from '../objects/meta-data.model';
import { getUrl } from './functions';


@Injectable()
export class MetaDataEffects {
    @Effect()
    fetchMetaData = this.actions$.pipe(
        ofType(MetaDataActions.READ_STATE),
        switchMap(() => {
            return this.http.get<MetaData>(getUrl('MetaData')).pipe(
                map((result: MetaData) => {
                    return new MetaDataActions.SetState(result);
                }),
                catchError((error) => {
                    console.log(error);
                    return of(new MetaDataActions.Error(error));
                })
            );
        }),
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

