import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as AdminActions from './admin.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { ATTRIBUTEGROUP, ATTRIBUTETYPE, CONNECTIONRULE, CONNECTIONTYPE, CONVERTTOITEMTYPE, ITEMTYPE,
    ITEMTYPEATTRIBUTEGROUPMAPPING, USER, USERS } from '../constants';

import { getUrl, post, put, del } from '../../functions';
import { UserRoleMapping } from '../../rest-api/user-role-mapping.model';

@Injectable()
export class AdminEffects {
    fetchUsers$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.readUsers),
        mergeMap(() => this.http.get<UserRoleMapping[]>(getUrl(USERS)).pipe(
            map((result: UserRoleMapping[]) => AdminActions.setUsers({userRoleMappings: result})),
            catchError((error) => of(ErrorActions.error({error, fatal: true}))),
        ))
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addUser),
        mergeMap((addUser) => post(this.http,
            USER, { userRoleMapping: addUser.userRoleMapping }, AdminActions.readUsers())
        )
    ));

    toggleUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.toggleRole),
        mergeMap((user) => put(this.http, USER, { userToken: user.user }, AdminActions.readUsers())
        ),
    ));

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteUser),
        mergeMap((value) => del(this.http, USER + value.user.Username.replace('\\', '/') +
                '/' + value.user.Role + '/' + value.withResponsibilities, AdminActions.readUsers())
        ),
    ));

    convertAttributeTypeToItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.convertAttributeTypeToItemType),
        mergeMap((value) =>
            put(this.http, ATTRIBUTETYPE + value.attributeType.TypeId + CONVERTTOITEMTYPE,
                {
                    newItemTypeName: value.newItemTypeName,
                    colorCode: value.colorCode,
                    connectionTypeId: value.connectionType.ConnTypeId,
                    position: value.position === 'below' ? 1 : 0,
                    attributeTypesToTransfer: value.attributeTypesToTransfer
                }))
    ));

    createAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeGroup),
        mergeMap((value) => post(this.http, ATTRIBUTEGROUP,
                { attributeGroup: {
                    GroupId: value.attributeGroup.GroupId.toString(),
                    GroupName: value.attributeGroup.GroupName } }
            )
        )
    ));

    updateAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeGroup),
        mergeMap((value) => put(this.http,
            ATTRIBUTEGROUP + value.attributeGroup.GroupId,
            { attributeGroup: value.attributeGroup })
        )
    ));

    deleteAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeGroup),
        mergeMap((value) => del(this.http,
            ATTRIBUTEGROUP + value.attributeGroup.GroupId))
    ));

    createAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeType),
        mergeMap((value) => post(this.http,
            ATTRIBUTETYPE, { attributeType: {
                    TypeId: value.attributeType.TypeId.toString(),
                    TypeName: value.attributeType.TypeName,
                    AttributeGroup: value.attributeType.AttributeGroup,
                }
            }
        ))
    ));

    updateAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeType),
        mergeMap((value) => put(this.http,
            ATTRIBUTETYPE + value.attributeType.TypeId,
            { attributeType: value.attributeType }
        ))
    ));

    deleteAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeType),
        mergeMap((value) => del(this.http,
            ATTRIBUTETYPE + value.attributeType.TypeId))
    ));

    createItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemType),
        mergeMap((createdType) => post(this.http,
            ITEMTYPE, { itemType: {
                TypeId: createdType.itemType.TypeId.toString(),
                TypeName: createdType.itemType.TypeName,
                TypeBackColor: createdType.itemType.TypeBackColor,
            }})
        )
    ));

    updateItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateItemType),
        mergeMap((value) => put(this.http,
            ITEMTYPE + value.itemType.TypeId,
            { itemType: value.itemType })
        )
    ));

    deleteItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemType),
        mergeMap((value) => del(this.http,
            ITEMTYPE + value.itemType.TypeId)
        )
    ));

    createItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemTypeAttributeGroupMapping),
        mergeMap((value) => post(
            this.http, ITEMTYPEATTRIBUTEGROUPMAPPING,
            { itemTypeAttributeGroupMapping: value.mapping }
        ))
    ));

    deleteItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemTypeAttributeGroupMapping),
        mergeMap((value) => del(this.http, ITEMTYPEATTRIBUTEGROUPMAPPING +
            'group/' + value.mapping.GroupId +
            '/itemType/' + value.mapping.ItemTypeId
        ))
    ));

    createConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionType),
        mergeMap((value) => post(
            this.http, CONNECTIONTYPE, { connectionType: {
                ConnTypeId: value.connectionType.ConnTypeId.toString(),
                ConnTypeName: value.connectionType.ConnTypeName,
                ConnTypeReverseName: value.connectionType.ConnTypeReverseName,
              }}
        ))
    ));

    updateConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionType),
        mergeMap((value) => put(
            this.http, CONNECTIONTYPE + value.connectionType.ConnTypeId,
            { connectionType: value.connectionType }
        ))
    ));

    deleteConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionType),
        mergeMap((value) => del(this.http,
            CONNECTIONTYPE + value.connectionType.ConnTypeId
        ))
    ));

    createConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionRule),
        mergeMap((value) => post(
            this.http, CONNECTIONRULE, { connectionRule: {
                RuleId: value.connectionRule.RuleId.toString(),
                ItemUpperType: value.connectionRule.ItemUpperType.toString(),
                ItemLowerType: value.connectionRule.ItemLowerType.toString(),
                ConnType: value.connectionRule.ConnType.toString(),
                MaxConnectionsToUpper: value.connectionRule.MaxConnectionsToUpper.toString(),
                MaxConnectionsToLower: value.connectionRule.MaxConnectionsToLower.toString(),
                ValidationExpression: value.connectionRule.ValidationExpression,
            }}
        ))
    ));

    updateConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionRule),
        mergeMap((updatedRule) => put(this.http,
            CONNECTIONRULE + updatedRule.connectionRule.RuleId,
            { connectionRule: updatedRule.connectionRule }
        ))
    ));

    deleteConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionRule),
        mergeMap((value) => del(this.http,
            CONNECTIONRULE + value.connectionRule.RuleId
        ))
    ));

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
