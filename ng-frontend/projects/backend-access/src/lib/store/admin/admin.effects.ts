import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import * as AdminActions from './admin.actions';
import * as ErrorActions from '../error-handling/error.actions';
import * as MetaDataActions from '../meta-data/meta-data.actions';

import { getUsers, createUser, updateUser, deleteUser, convertAttributeTypeToItemType,
    createAttributeGroup, updateAttributeGroup, deleteAttributeGroup, createAttributeType, updateAttributeType, deleteAttributeType,
    createConnectionType, updateConnectionType, deleteConnectionType, createConnectionRule, updateConnectionRule, deleteConnectionRule,
    createItemType, updateItemType, deleteItemType } from './admin.functions';

@Injectable()
export class AdminEffects {
    fetchUsers$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.readUsers),
        mergeMap(() => getUsers(this.http)),
        map(users => AdminActions.storeUsers({users})),
        catchError((error) => of(ErrorActions.error({error, fatal: true}))),
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.createUser),
        mergeMap(action => createUser(this.http, this.store, action.user, action.passphrase)),
        map((user) => AdminActions.storeUser({user}))
    ));

    updateUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateUser),
        mergeMap(action => updateUser(this.http, this.store, action.user)),
        map((user) => AdminActions.storeUser({user}))),
    );

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteUser),
        mergeMap(action => deleteUser(this.http, this.store, action.user, action.withResponsibilities)),
        map(user => AdminActions.unstoreUser({user})),
    ));

    convertAttributeTypeToItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.convertAttributeTypeToItemType),
        mergeMap(action => convertAttributeTypeToItemType(this.http, this.store, action.attributeType.id, action.newItemTypeName, action.colorCode,
            action.connectionType.id, action.position, action.attributeTypesToTransfer)),
        map(() => MetaDataActions.readState()),
    ));

    createAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeGroup),
        mergeMap(action => createAttributeGroup(this.http, this.store, action.attributeGroup)),
        map(attributeGroup => AdminActions.storeAttributeGroup({attributeGroup})),
    ));

    updateAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeGroup),
        mergeMap(action => updateAttributeGroup(this.http, this.store, action.attributeGroup)),
        map(attributeGroup => AdminActions.storeAttributeGroup({attributeGroup})),
    ));

    deleteAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeGroup),
        mergeMap(action => deleteAttributeGroup(this.http, this.store, action.attributeGroup.id)),
        map(attributeGroup => AdminActions.unstoreAttributeGroup({attributeGroup})),
    ));

    createAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeType),
        mergeMap(action => createAttributeType(this.http, this.store, action.attributeType)),
        map(attributeType => AdminActions.storeAttributeType({attributeType})),
    ));

    updateAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeType),
        mergeMap(action => updateAttributeType(this.http, this.store, action.attributeType)),
        map(attributeType => AdminActions.storeAttributeType({attributeType})),
    ));

    deleteAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeType),
        mergeMap(action => deleteAttributeType(this.http, this.store, action.attributeType.id)),
        map(attributeType => AdminActions.unstoreAttributeType({attributeType})),
    ));

    createItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemType),
        mergeMap(action => createItemType(this.http, this.store, action.itemType)),
        map(itemType => AdminActions.storeItemType({itemType})),
    ));

    updateItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateItemType),
        mergeMap(action => updateItemType(this.http, this.store, action.itemType)),
        map(itemType => AdminActions.storeItemType({itemType})),
    ));

    deleteItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemType),
        mergeMap(action => deleteItemType(this.http, this.store, action.itemType.id)),
        map(itemType => AdminActions.unstoreItemType({itemType})),
    ));

    createConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionType),
        mergeMap(action => createConnectionType(this.http, this.store, action.connectionType)),
        map(connectionType => AdminActions.storeConnectionType({connectionType})),
    ));

    updateConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionType),
        mergeMap(action => updateConnectionType(this.http, this.store, action.connectionType)),
        map(connectionType => AdminActions.storeConnectionType({connectionType})),
    ));

    deleteConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionType),
        mergeMap(action => deleteConnectionType(this.http, this.store, action.connectionType.id)),
        map(connectionType => AdminActions.unstoreConnectionType({connectionType})),
    ));

    createConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionRule),
        mergeMap(action => createConnectionRule(this.http, this.store, action.connectionRule)),
        map(connectionRule => AdminActions.storeConnectionRule({connectionRule})),
    ));

    updateConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionRule),
        mergeMap(action => updateConnectionRule(this.http, this.store, action.connectionRule)),
        map(connectionRule => AdminActions.storeConnectionRule({connectionRule})),
    ));

    deleteConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionRule),
        mergeMap(action => deleteConnectionRule(this.http, this.store, action.connectionRule.id)),
        map(connectionRule => AdminActions.unstoreConnectionRule({connectionRule})),
    ));

    constructor(private actions$: Actions,
                private store: Store,
                private http: HttpClient) {}
}
