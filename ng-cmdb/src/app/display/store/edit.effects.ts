import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as DisplayActions from './display.actions';
import * as EditActions from './edit.actions';

import { put, post, del } from 'src/app/shared/store/functions';

const CONFIGURATIONITEM = 'ConfigurationItem/';
const ATTRIBUTE = 'ItemAttribute/';
const CONNECTION = 'Connection/';
const RESPONSIBILITY = '/Responsibility';
const ITEMLINK = 'ItemLink/';

@Injectable()
export class EditEffects {
    constructor(private actions$: Actions,
                private http: HttpClient) {}

    createConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConfigurationItem),
        concatMap(action => post(this.http, CONFIGURATIONITEM,
            { item: action.configurationItem },
            DisplayActions.readConfigurationItem({itemId: action.configurationItem.ItemId})))
    ));

    updateConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConfigurationItem),
        concatMap(action => put(this.http, CONFIGURATIONITEM + action.configurationItem.ItemId,
            { item: action.configurationItem },
            DisplayActions.readConfigurationItem({itemId: action.configurationItem.ItemId}))),
    ));

    deleteConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConfigurationItem),
        concatMap(action => del(this.http, CONFIGURATIONITEM + action.itemId,
            DisplayActions.clearConfigurationItem({result: { Success: true }})))
    ));

    createItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createItemAttribute),
        concatMap(action => post(this.http, ATTRIBUTE, { attribute: action.itemAttribute },
            DisplayActions.readConfigurationItem({itemId: action.itemAttribute.ItemId})))
    ));

    updateItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateItemAttribute),
        concatMap(action => put(this.http, ATTRIBUTE + action.itemAttribute.AttributeId,
            { attribute: action.itemAttribute },
            DisplayActions.readConfigurationItem({itemId: action.itemAttribute.ItemId})))
    ));

    deleteItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteItemAttribute),
        concatMap(action => del(this.http, ATTRIBUTE + action.itemAttribute.AttributeId,
            DisplayActions.readConfigurationItem({itemId: action.itemAttribute.ItemId})))
    ));

    createConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConnection),
        concatMap(action => post(this.http, CONNECTION,
            { connection: action.connection },
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    updateConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConnection),
        concatMap(action => put(this.http, CONNECTION + action.connection.ConnId,
            { connection: action.connection },
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    deleteConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConnection),
        concatMap(action => del(this.http, CONNECTION + action.connId,
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    takeResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.takeResponsibility),
        concatMap(action => post(this.http, CONFIGURATIONITEM + action.itemId + RESPONSIBILITY,
            undefined, DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    abandonResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.abandonResponsibility),
        switchMap(action => del(this.http, CONFIGURATIONITEM + action.itemId + RESPONSIBILITY,
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    deleteInvalidResponsibility = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteInvalidResponsibility),
        switchMap(action => put(this.http, CONFIGURATIONITEM + action.itemId + RESPONSIBILITY,
            { userToken: action.userToken },
            DisplayActions.readConfigurationItem({itemId: action.itemId})))
    ));

    createLink$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createLink),
        concatMap(action => post(this.http, ITEMLINK, { link: action.itemLink },
            DisplayActions.readConfigurationItem({itemId: action.itemLink.ItemId})))
    ));

    deleteLink$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteLink),
        concatMap(action => del(this.http, ITEMLINK + action.itemLink.LinkId,
            DisplayActions.readConfigurationItem({itemId: action.itemLink.ItemId})))
    ));
}
