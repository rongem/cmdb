import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as AdminActions from './admin.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { getUsers, createUser, updateUser, deleteUser, convertAttributeTypeToItemType,
    createAttributeGroup, updateAttributeGroup, deleteAttributeGroup, createAttributeType, updateAttributeType, deleteAttributeType,
    createConnectionType, updateConnectionType, deleteConnectionType, createConnectionRule, updateConnectionRule, deleteConnectionRule,
    createItemType, updateItemType, deleteItemType } from './admin.functions';
import { Store } from '@ngrx/store';

@Injectable()
export class AdminEffects {
    fetchUsers$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.readUsers),
        mergeMap(() => getUsers(this.http)),
        map(userRoleMappings => AdminActions.setUsers({users: userRoleMappings})),
        catchError((error) => of(ErrorActions.error({error, fatal: true}))),
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addUser),
        mergeMap(action => createUser(this.http, this.store, action.user)),
        map((user) => AdminActions.setUser({user}))
    ));

    updateUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateUser),
        mergeMap(action => updateUser(this.http, this.store, action.user)),
        map((user) => AdminActions.setUser({user}))),
    );

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteUser),
        mergeMap(action => deleteUser(this.http, this.store, action.user, action.withResponsibilities, AdminActions.readUsers())),
    ));

    convertAttributeTypeToItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.convertAttributeTypeToItemType),
        mergeMap(action => convertAttributeTypeToItemType(this.http, this.store, action.attributeType.id, action.newItemTypeName, action.colorCode,
            action.connectionType.id, action.position, action.attributeTypesToTransfer)
        ),
    ));

    createAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeGroup),
        mergeMap(action => createAttributeGroup(this.http, this.store, action.attributeGroup)),
    ));

    updateAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeGroup),
        mergeMap(action => updateAttributeGroup(this.http, this.store, action.attributeGroup)),
    ));

    deleteAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeGroup),
        mergeMap(action => deleteAttributeGroup(this.http, this.store, action.attributeGroup.id)),
    ));

    createAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeType),
        mergeMap(action => createAttributeType(this.http, this.store, action.attributeType)),
    ));

    updateAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeType),
        mergeMap(action => updateAttributeType(this.http, this.store, action.attributeType)),
    ));

    deleteAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeType),
        mergeMap(action => deleteAttributeType(this.http, this.store, action.attributeType.id)),
    ));

    createItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemType),
        mergeMap(action => createItemType(this.http, this.store, action.itemType)),
    ));

    updateItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateItemType),
        mergeMap(action => updateItemType(this.http, this.store, action.itemType)),
    ));

    deleteItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemType),
        mergeMap(action => deleteItemType(this.http, this.store, action.itemType.id)),
    ));

    createItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemTypeAttributeGroupMapping),
        mergeMap(action => createItemTypeAttributeGroupMapping(this.http, this.store, action.mapping)),
    ));

    deleteItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemTypeAttributeGroupMapping),
        mergeMap(action => deleteItemTypeAttributeGroupMapping(this.http, this.store, action.mapping)),
    ));

    createConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionType),
        mergeMap(action => createConnectionType(this.http, this.store, action.connectionType)),
    ));

    updateConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionType),
        mergeMap(action => updateConnectionType(this.http, this.store, action.connectionType)),
    ));

    deleteConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionType),
        mergeMap(action => deleteConnectionType(this.http, this.store, action.connectionType.id)),
    ));

    createConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionRule),
        mergeMap(action => createConnectionRule(this.http, this.store, action.connectionRule)),
    ));

    updateConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionRule),
        mergeMap(action => updateConnectionRule(this.http, this.store, action.connectionRule)),
    ));

    deleteConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionRule),
        mergeMap(action => deleteConnectionRule(this.http, this.store, action.connectionRule.id)),
    ));

    constructor(private actions$: Actions,
                private store: Store,
                private http: HttpClient) {}
}
