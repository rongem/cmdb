import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as ReadActions from './read.actions';

import { getUrl, getHeader } from '../../functions';
import { FullConfigurationItem } from '../../rest-api/item-data/full/full-configuration-item.model';
import { Result } from '../../rest-api/result.model';
import { CONFIGURATIONITEM, FULL } from '../constants';

@Injectable()
export class DisplayEffects {
    constructor(private actions$: Actions,
                private http: HttpClient) {}

    readConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(ReadActions.readConfigurationItem),
        mergeMap(action =>
            this.http.get<FullConfigurationItem>(
                getUrl(CONFIGURATIONITEM + action.itemId + FULL),
                { headers: getHeader() }).pipe(
                    map(item => ReadActions.setConfigurationItem({configurationItem: item})),
                    catchError((error: HttpErrorResponse) => {
                        return of(ReadActions.clearConfigurationItem({result: new Result(false, error.message)}));
                    }),
            )
        )
    ));
}
