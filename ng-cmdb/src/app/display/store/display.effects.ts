import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, take, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';
import { GraphItem } from '../objects/graph-item.model';
import { Guid } from 'src/app/shared/guid';

@Injectable()
export class DisplayEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private title: Title,
                private http: HttpClient) {}

    readConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.readConfigurationItem),
        switchMap(action =>
            this.readFullItem(action.itemId).pipe(
                    map(item => DisplayActions.setConfigurationItem({configurationItem: item})),
                    catchError((error: HttpErrorResponse) => {
                        return of(DisplayActions.clearConfigurationItem({result: new Result(false, error.message)}));
                    }),
            )
        )
    ));

    setConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.setConfigurationItem),
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
        switchMap(action => {
            return this.readFullItem(action.id).pipe(
                map(item => DisplayActions.addGraphItem({item: new GraphItem(item, action.level)})),
                catchError((error) => of(MetaDataActions.error({error, invalidateData: false}))),
            );
        })
    ));

    setAppTitle$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.setConfigurationItem),
        switchMap(action => {
            this.title.setTitle(action.configurationItem.type + ': ' + action.configurationItem.name);
            return of(null);
        }),
    ), {dispatch: false});

    private getGraphItem(id: Guid, level: number) {
        this.readFullItem(id).pipe(take(1)).subscribe(item =>
            this.store.dispatch(DisplayActions.addGraphItem({ item: new GraphItem(item, level) })));
    }

    private readFullItem(id: Guid) {
        this.store.dispatch(DisplayActions.addProcessedItemId({id}));
        return this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + id + '/Full'),
            { headers: getHeader() });
    }
}

