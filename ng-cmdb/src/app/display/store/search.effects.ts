import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as SearchActions from './search.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Store } from '@ngrx/store';

@Injectable()
export class SearchEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    metaDataChange$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.setState),
        switchMap((value) => of(SearchActions.searchChangeMetaData({
                attributeTypes: value.metaData.attributeTypes,
        }))),
    ));

    performSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performSearch),
        switchMap(action =>
            this.http.post<ConfigurationItem[]>(getUrl('ConfigurationItems/Search'),
                { search: action.searchContent },
                { headers: getHeader() }).pipe(
                    tap(configurationItems => {
                        if (configurationItems && configurationItems.length > 0) {
                            this.store.dispatch(SearchActions.performSearchFull({searchContent: action.searchContent}));
                        }
                    }),
                    map(configurationItems => DisplayActions.setResultList({configurationItems})),
                    catchError((error: HttpErrorResponse) => {
                        return of(MetaDataActions.error({error, invalidateData: false}));
                    })
            )
        )
    ));

    fillResultListFullAfterSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performSearchFull),
        switchMap(action =>
            this.http.post<FullConfigurationItem[]>(getUrl('ConfigurationItems/Search/Full'),
                { search: action.searchContent },
                { headers: getHeader() }).pipe(
                    map(configurationItems => DisplayActions.setResultListFull({configurationItems})),
                    catchError((error: HttpErrorResponse) => {
                        return of(MetaDataActions.error({error, invalidateData: false}));
                    })
            )),
    ));
}
