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

    storeConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.storeConnection),
        withLatestFrom(
            this.store.select(fromSelectDisplay.selectDisplayConfigurationItem),
            this.store.select(MetaDataSelectors.selectUserName),
        ),
        switchMap(([action, item, userName]) => {
            const configurationItem = FullConfigurationItem.copyItem(item);
            configurationItem.userIsResponsible = configurationItem.responsibleUsers.includes(userName);
            const connection = configurationItem.connectionsToUpper.find(c => c.id === action.connection.id) ??
                configurationItem.connectionsToLower.find(c => c.id === action.connection.id);
            if (connection) { // updated existing connection
                connection.description = action.connection.description;
                return of(ReadActions.setConfigurationItem({configurationItem}));
            } // building a FullConnection would require a read for the target item, so that it doesn't matter if we re-read the full item
            return of(ReadActions.readConfigurationItem({itemId: item.id}));
        })
    ));

    unstoreConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.unstoreConnection),
        withLatestFrom(
            this.store.select(fromSelectDisplay.selectDisplayConfigurationItem),
            this.store.select(MetaDataSelectors.selectUserName),
        ),
        switchMap(([action, item, userName]) => {
            const configurationItem = FullConfigurationItem.copyItem(item);
            configurationItem.userIsResponsible = configurationItem.responsibleUsers.includes(userName);
            let connectionIndex = configurationItem.connectionsToUpper.findIndex(c => c.id === action.connection.id);
            if (connectionIndex > -1) {
                configurationItem.connectionsToUpper.splice(connectionIndex, 1);
                return of(ReadActions.setConfigurationItem({configurationItem}));
            }
            connectionIndex = configurationItem.connectionsToLower.findIndex(c => c.id === action.connection.id);
            if (connectionIndex > -1) {
                configurationItem.connectionsToLower.splice(connectionIndex, 1);
                return of(ReadActions.setConfigurationItem({configurationItem}));
            }
            console.error('could not find deleted connection in item');
            return of(ReadActions.readConfigurationItem({itemId: item.id}));
        }),
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

