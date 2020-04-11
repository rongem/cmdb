import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, map, catchError, tap, filter } from 'rxjs/operators';

import * as SearchActions from './search.actions';
import * as MultiEditActions from '../edit-data/multi-edit.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { getUrl, getHeader } from '../../functions';
import { ConfigurationItem } from '../../rest-api/item-data/configuration-item.model';
import { FullConfigurationItem } from '../../rest-api/item-data/full/full-configuration-item.model';
import { NeighborItem } from '../../rest-api/item-data/search/neighbor-item.model';
import { CONFIGURATIONITEM, CONFIGURATIONITEMS, SEARCH, FULL, NEIGHBOR } from '../constants';

@Injectable()
export class SearchEffects {
    constructor(private actions$: Actions,
                private store: Store,
                private http: HttpClient) {}

    // search items with given properties
    performSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performSearch),
        switchMap(action =>
            this.http.post<ConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + SEARCH),
                { search: action.searchContent },
                { headers: getHeader() }).pipe(
                    tap(configurationItems => {
                        if (configurationItems && configurationItems.length > 0) {
                            this.store.dispatch(SearchActions.performSearchFull({searchContent: action.searchContent}));
                        }
                    }),
                    map(configurationItems => SearchActions.setResultList({configurationItems})),
                    catchError((error: HttpErrorResponse) => {
                        this.store.dispatch(SearchActions.setResultList({configurationItems: []}));
                        return of(ErrorActions.error({error, fatal: false}));
                    })
            )
        )
    ));

    // search items with given properties and return full items
    fillResultListFullAfterSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performSearchFull),
        switchMap(action =>
            this.http.post<FullConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + SEARCH + FULL),
                { search: action.searchContent },
                { headers: getHeader() }).pipe(
                    map(configurationItems => SearchActions.setResultListFull({configurationItems})),
                    catchError((error: HttpErrorResponse) => {
                        this.store.dispatch(SearchActions.setResultListFull({configurationItems: []}));
                        return of(ErrorActions.error({error, fatal: false}));
                    })
            )),
    ));

    // search items with given properties descending from a single item
    performNeighborSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performNeighborSearch),
        switchMap(action =>
            this.http.post<NeighborItem[]>(getUrl(CONFIGURATIONITEM + SEARCH + NEIGHBOR),
                { search: action.searchContent },
                { headers: getHeader() }).pipe(
                    map(resultList => SearchActions.setNeighborSearchResultList({resultList, fullItemsIncluded: false})),
                    catchError((error: HttpErrorResponse) => {
                        this.store.dispatch(SearchActions.setNeighborSearchResultList({resultList: [], fullItemsIncluded: true}));
                        return of(ErrorActions.error({error, fatal: false}));
                    })
            )),
    ));

    // set the result list for neighbor search; start retrieving single full items for each item returned
    setNeighborResultList$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.setNeighborSearchResultList),
        filter(action => action.fullItemsIncluded === false),
        switchMap(action => {
            const items: Observable<FullConfigurationItem>[] = [];
            action.resultList.forEach(item => {
                items.push(this.http.get<FullConfigurationItem>(getUrl(CONFIGURATIONITEM + item.Item.ItemId + FULL)).pipe(
                        tap(fullItem => item.FullItem = fullItem),
                ));
            });
            forkJoin(items).subscribe(() =>
                this.store.dispatch(SearchActions.setNeighborSearchResultList({resultList: action.resultList, fullItemsIncluded: true}))
            );
            return of(null);
        }),
    ), { dispatch: false });

    // multi edit list must be cleared if a new search was performed
    clearMultiEditLists$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.setNeighborSearchResultList, SearchActions.setResultListFull),
        map(() => MultiEditActions.clear()),
    ));
}

