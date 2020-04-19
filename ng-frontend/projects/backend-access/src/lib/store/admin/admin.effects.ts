import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as AdminActions from './admin.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { getUsers, createUser, toggleUser, deleteUser, convertAttributeTypeToItemType,
    createAttributeGroup, updateAttributeGroup, deleteAttributeGroup, createAttributeType, updateAttributeType, deleteAttributeType,
    createConnectionType, updateConnectionType, deleteConnectionType, createConnectionRule, updateConnectionRule, deleteConnectionRule,
    createItemType, updateItemType, deleteItemType, createItemTypeAttributeGroupMapping, deleteItemTypeAttributeGroupMapping } from './admin.functions';

@Injectable()
export class AdminEffects {
    fetchUsers$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.readUsers),
        mergeMap(() => getUsers(this.http).pipe(
            map(userRoleMappings => AdminActions.setUsers({userRoleMappings})),
            catchError((error) => of(ErrorActions.error({error, fatal: true}))),
        ))
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addUser),
        mergeMap(action => createUser(this.http, action.userRoleMapping, AdminActions.readUsers())),
    ));

    toggleUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.toggleRole),
        mergeMap(action => toggleUser(this.http, action.user, AdminActions.readUsers())),
    ));

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteUser),
        mergeMap(action => deleteUser(this.http, action.user, action.withResponsibilities, AdminActions.readUsers())),
    ));

    convertAttributeTypeToItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.convertAttributeTypeToItemType),
        mergeMap(action => convertAttributeTypeToItemType(this.http, action.attributeType.id, action.newItemTypeName, action.colorCode,
            action.connectionType.id, action.position, action.attributeTypesToTransfer)
        ),
    ));

    createAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeGroup),
        mergeMap(action => createAttributeGroup(this.http, action.attributeGroup)),
    ));

    updateAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeGroup),
        mergeMap(action => updateAttributeGroup(this.http, action.attributeGroup)),
    ));

    deleteAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeGroup),
        mergeMap(action => deleteAttributeGroup(this.http, action.attributeGroup.id)),
    ));

    createAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeType),
        mergeMap(action => createAttributeType(this.http, action.attributeType)),
    ));

    updateAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeType),
        mergeMap(action => updateAttributeType(this.http, action.attributeType)),
    ));

    deleteAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeType),
        mergeMap(action => deleteAttributeType(this.http, action.attributeType.id)),
    ));

    createItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemType),
        mergeMap(action => createItemType(this.http, action.itemType)),
    ));

    updateItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateItemType),
        mergeMap(action => updateItemType(this.http, action.itemType)),
    ));

    deleteItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemType),
        mergeMap(action => deleteItemType(this.http, action.itemType.id)),
    ));

    createItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemTypeAttributeGroupMapping),
        mergeMap(action => createItemTypeAttributeGroupMapping(this.http, action.mapping)),
    ));

    deleteItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemTypeAttributeGroupMapping),
        mergeMap(action => deleteItemTypeAttributeGroupMapping(this.http, action.mapping)),
    ));

    createConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionType),
        mergeMap(action => createConnectionType(this.http, action.connectionType)),
    ));

    updateConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionType),
        mergeMap(action => updateConnectionType(this.http, action.connectionType)),
    ));

    deleteConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionType),
        mergeMap(action => deleteConnectionType(this.http, action.connectionType.id)),
    ));

    createConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionRule),
        mergeMap(action => createConnectionRule(this.http, action.connectionRule)),
    ));

    updateConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionRule),
        mergeMap(action => updateConnectionRule(this.http, action.connectionRule)),
    ));

    deleteConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionRule),
        mergeMap(action => deleteConnectionRule(this.http, action.connectionRule.id)),
    ));

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
