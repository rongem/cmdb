import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ReadFunctions, ReadActions, ErrorActions, EditActions, FullConfigurationItem, MetaDataSelectors } from 'backend-access';

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
                        this.store.dispatch(ErrorActions.error({error: error.message, fatal: false}));
                        return of(ReadActions.clearConfigurationItem({success: false }));
                    }),
            )
        )
    ));

    storeConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.storeConfigurationItem),
        withLatestFrom(
            this.store.select(fromSelectDisplay.selectDisplayConfigurationItem),
            this.store.select(MetaDataSelectors.selectUserName),
        ),
        switchMap(([action, item, userName]) => {
            if (action.configurationItem.id === item.id) {
                const configurationItem = FullConfigurationItem.mergeItem(
                    action.configurationItem, item.connectionsToUpper, item.connectionsToLower);
                configurationItem.userIsResponsible = configurationItem.responsibleUsers.includes(userName);
                return of(ReadActions.setConfigurationItem({configurationItem}));
            }
            return of(ReadActions.readConfigurationItem({itemId: action.configurationItem.id}));
        })
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
        this.readFullItem(id).subscribe(item =>
            this.store.dispatch(DisplayActions.addGraphItem({ item: new GraphItem(item, level) })));
    }

    private readFullItem(id: string) {
        this.store.dispatch(DisplayActions.addProcessedItemId({id}));
        return ReadFunctions.fullConfigurationItem(this.http, this.store, id);
    }
}

