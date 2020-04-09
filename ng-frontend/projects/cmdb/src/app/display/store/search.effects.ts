import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, map, catchError, tap, filter } from 'rxjs/operators';
import { FullConfigurationItem, ConfigurationItem, NeighborItem, Functions, StoreConstants } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as SearchActions from './search.actions';
import * as MetaDataActions from 'projects/cmdb/src/app/shared/store/meta-data.actions';
import * as MultiEditActions from 'backend-access';

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
            this.http.post<ConfigurationItem[]>(Functions.getUrl(StoreConstants.CONFIGURATIONITEM + StoreConstants.SEARCH),
                { search: action.searchContent },
                { headers: Functions.getHeader() }).pipe(
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
            this.http.post<FullConfigurationItem[]>(
                Functions.getUrl(StoreConstants.CONFIGURATIONITEM + StoreConstants.SEARCH + StoreConstants.FULL),
                { search: action.searchContent },
                { headers: Functions.getHeader() }).pipe(
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
            this.http.post<NeighborItem[]>(
                Functions.getUrl(StoreConstants.CONFIGURATIONITEM + StoreConstants.SEARCH + StoreConstants.NEIGHBOR),
                { search: action.searchContent },
                { headers: Functions.getHeader() }).pipe(
                    map(resultList => SearchActions.setNeighborSearchResultList({resultList, fullItemsIncluded: false})),
                    catchError((error: HttpErrorResponse) => {
                        this.store.dispatch(SearchActions.setNeighborSearchResultList({resultList: [], fullItemsIncluded: true}));
                        return of(MetaDataActions.error({error, invalidateData: false}));
                    })
            )),
    ));

    setNeighborResultList$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.setNeighborSearchResultList),
        filter(action => action.fullItemsIncluded === false),
        switchMap(action => {
            const items: Observable<FullConfigurationItem>[] = [];
            action.resultList.forEach(item => {
                items.push(this.http.get<FullConfigurationItem>(
                    Functions.getUrl(StoreConstants.CONFIGURATIONITEM + item.Item.ItemId + StoreConstants.FULL)).pipe(
                        tap(fullItem => item.FullItem = fullItem),
                ));
            });
            forkJoin(items).subscribe(() =>
                this.store.dispatch(SearchActions.setNeighborSearchResultList({resultList: action.resultList, fullItemsIncluded: true}))
            );
            return of(null);
        }),
    ), { dispatch: false });

    clearMultiEditLists$ = createEffect(() => this.actions$.pipe(
        ofType(SearchActions.setNeighborSearchResultList, DisplayActions.setResultListFull),
        map(() => MultiEditActions.clear()),
    ));
}

