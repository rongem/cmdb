import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';

import * as SearchActions from './search.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { search, searchFull, searchNeighbor, fullConfigurationItems } from './read.functions';
import { NeighborItem } from '../../objects/item-data/search/neighbor-item.model';

@Injectable()
export class SearchEffects {
    // search items with given properties
    performSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performSearch),
        switchMap(action => search(this.http, action.searchContent).pipe(
            map(configurationItems => {
                if (configurationItems && configurationItems.length > 0) {
                    this.store.dispatch(SearchActions.performSearchFull({searchContent: action.searchContent}));
                }
                return SearchActions.setResultList({configurationItems});
            }),
            catchError((error: HttpErrorResponse) => {
                this.store.dispatch(SearchActions.setResultList({configurationItems: []}));
                return of(ErrorActions.error({error, fatal: false}));
            }))
        ),
    ));

    // search items with given properties and return full items
    fillResultListFullAfterSearch$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.performSearchFull),
        switchMap(action => searchFull(this.http, this.store, action.searchContent).pipe(
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
        switchMap(action => searchNeighbor(this.http, action.searchContent).pipe(
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
            if (action.resultList.length === 0) {
                return of(action.resultList);
            }
            const itemIds = action.resultList.map(i => i.item.id);
            const resultList: NeighborItem[] = [];
            return fullConfigurationItems(this.http, this.store, itemIds).pipe(
                tap(fullItems => action.resultList.forEach(neighborItem =>{
                    const fullItem = fullItems.find(i => i.id === neighborItem.item.id);
                    resultList.push({...neighborItem, fullItem});
                })),
                map(() => resultList),
            );
        }),
        map(resultList => SearchActions.setNeighborSearchResultList({resultList, fullItemsIncluded: true}))
    ));

    constructor(private actions$: Actions,
        private store: Store,
        private http: HttpClient) {}
}

