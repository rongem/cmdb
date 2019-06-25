import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as SearchActions from './search.actions';
import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';

@Injectable()
export class SearchEffects {
    @Effect()
    search = this.actions$.pipe(
        ofType(SearchActions.PERFORM_SEARCH),
        switchMap((action: SearchActions.PerformSearch) => {
            return this.http.post<ConfigurationItem[]>(getUrl('ConfigurationItems/Search'),
                    {search: action.payload},
                    {headers: getHeader() }).pipe(
                        map((configurationItems: ConfigurationItem[]) =>
                            new SearchActions.SetResultList(configurationItems)),
                        catchError(() => of(new SearchActions.DeleteResultList())),
            );
        }),
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
