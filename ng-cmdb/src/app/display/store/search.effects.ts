import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, map, catchError, tap, filter, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as SearchActions from './search.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Store } from '@ngrx/store';
import { NeighborItem } from '../search/neighbor-item.model';

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
                        this.store.dispatch(DisplayActions.setResultList({configurationItems: []}));
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
                        this.store.dispatch(DisplayActions.setResultListFull({configurationItems: []}));
                        return of(MetaDataActions.error({error, invalidateData: false}));
                    })
            )),
    ));

    performNeighborSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performNeighborSearch),
        switchMap(action =>
            this.http.post<NeighborItem[]>(getUrl('ConfigurationItems/Search/Neighbor'),
                { search: action.searchContent },
                { headers: getHeader() }).pipe(
                    map(resultList => SearchActions.setNeighborSearchResultList({resultList, fullItemsIncluded: false})),
                    catchError((error: HttpErrorResponse) => {
                        this.store.dispatch(SearchActions.setNeighborSearchResultList({resultList: [], fullItemsIncluded: true}));
                        return of(MetaDataActions.error({error, invalidateData: false}));
                    })
            )),
    ));

    setNeighborResultList = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.setNeighborSearchResultList),
        filter(action => action.fullItemsIncluded === false),
        switchMap(action => {
            const items: Observable<FullConfigurationItem>[] = [];
            action.resultList.forEach(item => {
                items.push(this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + item.Item.ItemId + '/Full')).pipe(
                    tap(fullItem => item.FullItem = fullItem),
                ));
            });
            forkJoin(items).subscribe(() =>
                this.store.dispatch(SearchActions.setNeighborSearchResultList({resultList: action.resultList, fullItemsIncluded: true}))
            );
            return of(null);
        }),
    ), { dispatch: false });
}

