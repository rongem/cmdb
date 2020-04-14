import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, mergeMap, map, catchError, take, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { FullConfigurationItem, Result, Functions, StoreConstants, ReadActions, ErrorActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

import { GraphItem } from '../objects/graph-item.model';

@Injectable()
export class DisplayEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private title: Title,
                private http: HttpClient) {}

    readConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(ReadActions.readConfigurationItem),
        switchMap(action =>
            this.readFullItem(action.itemId).pipe(
                    map(item => ReadActions.setConfigurationItem({configurationItem: item})),
                    catchError((error: HttpErrorResponse) => {
                        return of(ReadActions.clearConfigurationItem({result: new Result(false, error.message)}));
                    }),
            )
        )
    ));

    setConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(ReadActions.setConfigurationItem),
        withLatestFrom(this.store.select(fromSelectDisplay.selectProcessedItemIds)),
        switchMap(([action, ids]) => {
            action.configurationItem.connectionsToLower.forEach(conn => {
                if (!ids.includes(conn.targetId)) {
                    this.getGraphItem(conn.targetId, 1);
                }
            });
            action.configurationItem.connectionsToUpper.forEach(conn => {
                if (!ids.includes(conn.targetId)) {
                    this.getGraphItem(conn.targetId, -1);
                }
            });
            return of(null);
        })
    ), {dispatch: false});

    readGraphItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.readGraphItem),
        mergeMap(action => {
            return this.readFullItem(action.id).pipe(
                map(item => DisplayActions.addGraphItem({item: new GraphItem(item, action.level)})),
                catchError((error) => of(ErrorActions.error({error, fatal: false}))),
            );
        })
    ));

    setAppTitle$ = createEffect(() => this.actions$.pipe(
        ofType(ReadActions.setConfigurationItem),
        switchMap(action => {
            this.title.setTitle(action.configurationItem.type + ': ' + action.configurationItem.name);
            return of(null);
        }),
    ), {dispatch: false});

    private getGraphItem(id: string, level: number) {
        this.readFullItem(id).pipe(take(1)).subscribe(item =>
            this.store.dispatch(DisplayActions.addGraphItem({ item: new GraphItem(item, level) })));
    }

    private readFullItem(id: string) {
        this.store.dispatch(DisplayActions.addProcessedItemId({id}));
        return this.http.get<FullConfigurationItem>(Functions.getUrl(StoreConstants.CONFIGURATIONITEM + id + StoreConstants.FULL),
            { headers: Functions.getHeader() });
    }
}

