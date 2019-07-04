import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as ConfigurationItemActions from './configuration-item.actions';
import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';

@Injectable()
export class ConfigurationItemEffects {
    @Effect()
    getItem = this.actions$.pipe(
        ofType(ConfigurationItemActions.READ_ITEM),
        switchMap((action: ConfigurationItemActions.ReadItem) => {
            return this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + action.payload.toString() + '/Full'),
                { headers: getHeader() }).pipe(
                    map(item => new ConfigurationItemActions.SetItem(item)),
                    catchError((error: HttpErrorResponse) => {
                        return of(new ConfigurationItemActions.ClearItem(new Result(false, error.message)));
                    })
                );
        })
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

