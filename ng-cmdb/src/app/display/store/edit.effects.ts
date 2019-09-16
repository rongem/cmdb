import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as EditActions from './edit.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { getUrl, getHeader, put, post, del } from 'src/app/shared/store/functions';
import { Result } from 'src/app/shared/objects/result.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Store } from '@ngrx/store';

const CONFIGURATIONITEM = 'ConfigurationItem/';
const ATTRIBUTE = 'ItemAttribute/';
const CONNECTION = 'Connection/';

@Injectable()
export class EditEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    createConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConfigurationItem),
        switchMap(action => post(this.http, CONFIGURATIONITEM,
            { item: action.configurationItem },
            DisplayActions.readConfigurationItem({itemId: action.configurationItem.ItemId})))
    ));

    updateConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConfigurationItem),
        switchMap(action => put(this.http, CONFIGURATIONITEM + action.configurationItem.ItemId,
            { item: action.configurationItem },
            DisplayActions.readConfigurationItem({itemId: action.configurationItem.ItemId}))),
    ));

    deleteConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConfigurationItem),
        switchMap(action => del(this.http, CONFIGURATIONITEM + action.itemId,
            DisplayActions.clearConfigurationItem({result: { Success: true }})))
    ));

    createItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createItemAttribute),
        switchMap(action => post(this.http, ATTRIBUTE, { attribute: action.itemAttribute },
            DisplayActions.readConfigurationItem({itemId: action.itemAttribute.ItemId})))
    ));

    updateItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateItemAttribute),
        switchMap(action => put(this.http, ATTRIBUTE + action.itemAttribute.AttributeId,
            { attribute: action.itemAttribute },
            DisplayActions.readConfigurationItem({itemId: action.itemAttribute.ItemId})))
    ));

    deleteItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteItemAttribute),
        switchMap(action => del(this.http, ATTRIBUTE + action.itemAttribute.AttributeId,
            DisplayActions.readConfigurationItem({itemId: action.itemAttribute.ItemId})))
    ));

    createConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConnection),
        switchMap(action => post(this.http, CONNECTION,
            { connection: action.Connection },
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    updateConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConnection),
        switchMap(action => put(this.http, CONNECTION + action.Connection.ConnId,
            { connection: action.Connection },
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    deleteConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConnection),
        switchMap(action => del(this.http, CONNECTION + action.connId,
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    takeResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.takeResponsibility),
    ));

    abandonResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.abandonResponsibility),
    ));
}
