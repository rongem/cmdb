import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';

import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';
import { GraphItem } from '../objects/graph-item.model';

@Injectable()
export class DisplayEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private title: Title,
                private http: HttpClient) {}

    readConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.readConfigurationItem),
        switchMap(action =>
            this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + action.itemId + '/Full'),
                { headers: getHeader() }).pipe(
                    map(item => DisplayActions.setConfigurationItem({configurationItem: item})),
                    catchError((error: HttpErrorResponse) => {
                        return of(DisplayActions.clearConfigurationItem({result: new Result(false, error.message)}));
                    }),
            )
        )
    ));

    setConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.setConfigurationItem),
        switchMap(action => {
            action.configurationItem.connectionsToLower.forEach(conn => {
                this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + conn.targetId + '/Full'),
                    { headers: getHeader() }).pipe(take(1)).subscribe(item =>
                        this.store.dispatch(DisplayActions.addGraphItem({item: new GraphItem(item, 1)})));
            });
            action.configurationItem.connectionsToUpper.forEach(conn => {
                this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + conn.targetId + '/Full'),
                    { headers: getHeader() }).pipe(take(1)).subscribe(item =>
                        this.store.dispatch(DisplayActions.addGraphItem({item: new GraphItem(item, -1)})));
            });
            return of(null);
        })
    ), {dispatch: false});

    setAppTitle$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.setConfigurationItem),
        switchMap(action => {
            this.title.setTitle(action.configurationItem.type + ': ' + action.configurationItem.name);
            return of(null);
        }),
    ), {dispatch: false});
}

