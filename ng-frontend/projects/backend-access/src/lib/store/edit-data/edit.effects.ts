import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import * as ReadActions from '../read-data/read.actions';
import * as EditActions from './edit.actions';

import { createConfigurationItem, createFullConfigurationItem, updateConfigurationItem, deleteConfigurationItem,
    createConnection, updateConnection, deleteConnection,
    takeResponsibility, abandonResponsibility } from './edit.functions';

@Injectable()
export class EditEffects {
    constructor(private actions$: Actions,
                private store: Store,
                private http: HttpClient) {}

    createConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConfigurationItem),
        mergeMap(action => createConfigurationItem(this.http, this.store, action.configurationItem)),
        map(configurationItem => EditActions.storeConfigurationItem({configurationItem}))
    ));

    createFullConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createFullConfigurationItem),
        mergeMap(action => createFullConfigurationItem(this.http, this.store, action.item)),
        map(configurationItem => EditActions.storeFullConfigurationItem({configurationItem})),
    ));

    updateConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConfigurationItem),
        mergeMap(action => updateConfigurationItem(this.http, this.store, action.configurationItem)),
        map(configurationItem => EditActions.storeConfigurationItem({configurationItem}))
    ));

    deleteConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConfigurationItem),
        mergeMap(action => deleteConfigurationItem(this.http, this.store, action.itemId)),
        map(configurationItem => ReadActions.clearConfigurationItem({success: !!configurationItem})),
    ));

    createConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConnection),
        mergeMap(action => createConnection(this.http, this.store, action.connection)),
        map(connection => EditActions.storeConnection({connection})),
    ));

    updateConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConnection),
        mergeMap(action => updateConnection(this.http, this.store, action.connection)),
        map(connection => EditActions.storeConnection({connection})),
    ));

    deleteConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConnection),
        mergeMap(action => deleteConnection(this.http, this.store, action.connId)),
        map(connection => EditActions.unstoreConnection({connection})),
    ));

    takeResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.takeResponsibility),
        mergeMap(action => takeResponsibility(this.http, this.store, action.itemId)),
        map(configurationItem => EditActions.storeConfigurationItem({configurationItem}))
    ));

    abandonResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.abandonResponsibility),
        mergeMap(action => abandonResponsibility(this.http, this.store, action.itemId)),
        map(configurationItem => EditActions.storeConfigurationItem({configurationItem}))
    ));
}
