import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as ReadActions from '../read-data/read.actions';
import * as EditActions from './edit.actions';

import { createConfigurationItem, createFullConfigurationItem, updateConfigurationItem, deleteConfigurationItem,
    createItemAttribute, updateItemAttribute, deleteItemAttribute,
    createConnection, updateConnection, deleteConnection,
    takeResponsibility, abandonResponsibility, deleteInvalidResponsibility,
    createItemLink, deleteItemLink } from './edit.functions';

@Injectable()
export class EditEffects {
    constructor(private actions$: Actions,
                private http: HttpClient) {}

    createConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConfigurationItem),
        concatMap(action => createConfigurationItem(this.http, action.configurationItem,
            ReadActions.readConfigurationItem({itemId: action.configurationItem.id}))
        ),
    ));

    createFullConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createFullConfigurationItem),
        concatMap(action => createFullConfigurationItem(this.http, action.item,
            ReadActions.readConfigurationItem({itemId: action.item.id}))
        ),
    ));

    updateConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConfigurationItem),
        concatMap(action => updateConfigurationItem(this.http, action.configurationItem,
            ReadActions.readConfigurationItem({itemId: action.configurationItem.id}))
        ),
    ));

    deleteConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConfigurationItem),
        concatMap(action => deleteConfigurationItem(this.http, action.itemId,
            ReadActions.clearConfigurationItem({ success: true }))
        ),
    ));

    createItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createItemAttribute),
        concatMap(action => createItemAttribute(this.http, action.itemAttribute,
            ReadActions.readConfigurationItem({itemId: action.itemAttribute.itemId}))
        ),
    ));

    updateItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateItemAttribute),
        concatMap(action => updateItemAttribute(this.http, action.itemAttribute,
            ReadActions.readConfigurationItem({itemId: action.itemAttribute.itemId}))
        ),
    ));

    deleteItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteItemAttribute),
        concatMap(action => deleteItemAttribute(this.http, action.itemAttribute.id,
            ReadActions.readConfigurationItem({itemId: action.itemAttribute.itemId}))
        ),
    ));

    createConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConnection),
        concatMap(action => createConnection(this.http, action.connection, ReadActions.readConfigurationItem({itemId: action.itemId}))),
    ));

    updateConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConnection),
        concatMap(action => updateConnection(this.http, action.connection, ReadActions.readConfigurationItem({itemId: action.itemId}))),
    ));

    deleteConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConnection),
        concatMap(action => deleteConnection(this.http, action.connId, ReadActions.readConfigurationItem({itemId: action.itemId}))),
    ));

    takeResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.takeResponsibility),
        concatMap(action => takeResponsibility(this.http, action.itemId, ReadActions.readConfigurationItem({itemId: action.itemId}))),
    ));

    abandonResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.abandonResponsibility),
        concatMap(action => abandonResponsibility(this.http, action.itemId, ReadActions.readConfigurationItem({itemId: action.itemId}))),
    ));

    deleteInvalidResponsibility = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteInvalidResponsibility),
        concatMap(action => deleteInvalidResponsibility(this.http, action.itemId, action.userToken,
            ReadActions.readConfigurationItem({itemId: action.itemId}))
        ),
    ));

    createLink$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createLink),
        concatMap(action => createItemLink(this.http, action.itemLink,
            ReadActions.readConfigurationItem({itemId: action.itemLink.itemId}))
        ),
    ));

    deleteLink$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteLink),
        concatMap(action => deleteItemLink(this.http, action.itemLink.id,
            ReadActions.readConfigurationItem({itemId: action.itemLink.itemId}))
        ),
    ));
}
