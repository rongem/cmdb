import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as AdminActions from './admin.actions';
import * as ErrorActions from '../error-handling/error.actions';

import { ATTRIBUTEGROUP, ATTRIBUTETYPE, CONNECTIONRULE, CONNECTIONTYPE, CONVERTTOITEMTYPE, GROUP, ITEMTYPE,
    ITEMTYPEATTRIBUTEGROUPMAPPING, USER, USERS } from '../constants';

import { getUrl, post, put, del } from '../../functions';
import { UserRoleMapping } from '../../objects/meta-data/user-role-mapping.model';
import { RestUserRoleMapping } from '../../rest-api/user-role-mapping.model';

@Injectable()
export class AdminEffects {
    fetchUsers$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.readUsers),
        mergeMap(() => this.http.get<RestUserRoleMapping[]>(getUrl(USERS)).pipe(
            map((result: RestUserRoleMapping[]) => {
                const userRoleMappings: UserRoleMapping[] = result.map(u => new UserRoleMapping(u.Username, u.IsGroup, u.Role));
                return AdminActions.setUsers({userRoleMappings});
            }),
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
        mergeMap((value) => del(this.http, USER + value.user.username.replace('\\', '/') +
                '/' + value.user.role + '/' + value.withResponsibilities, AdminActions.readUsers())
        ),
    ));

    convertAttributeTypeToItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.convertAttributeTypeToItemType),
        mergeMap((value) =>
            put(this.http, ATTRIBUTETYPE + value.attributeType.id + CONVERTTOITEMTYPE,
                {
                    newItemTypeName: value.newItemTypeName,
                    colorCode: value.colorCode,
                    connectionTypeId: value.connectionType.id,
                    position: value.position === 'below' ? 1 : 0,
                    attributeTypesToTransfer: value.attributeTypesToTransfer
                }))
    ));

    createAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeGroup),
        mergeMap((value) => post(this.http, ATTRIBUTEGROUP,
                { attributeGroup: {
                    GroupId: value.attributeGroup.id,
                    GroupName: value.attributeGroup.name } }
            )
        )
    ));

    updateAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeGroup),
        mergeMap((value) => put(this.http,
            ATTRIBUTEGROUP + value.attributeGroup.id,
            { attributeGroup: value.attributeGroup })
        )
    ));

    deleteAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeGroup),
        mergeMap((value) => del(this.http,
            ATTRIBUTEGROUP + value.attributeGroup.id))
    ));

    createAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeType),
        mergeMap((value) => post(this.http,
            ATTRIBUTETYPE, { attributeType: {
                    TypeId: value.attributeType.id,
                    TypeName: value.attributeType.name,
                    AttributeGroup: value.attributeType.attributeGroupId,
                }
            }
        ))
    ));

    updateAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeType),
        mergeMap((value) => put(this.http,
            ATTRIBUTETYPE + value.attributeType.id,
            { attributeType: value.attributeType }
        ))
    ));

    deleteAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeType),
        mergeMap((value) => del(this.http,
            ATTRIBUTETYPE + value.attributeType.id))
    ));

    createItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemType),
        mergeMap((createdType) => post(this.http,
            ITEMTYPE, { itemType: {
                TypeId: createdType.itemType.id,
                TypeName: createdType.itemType.name,
                TypeBackColor: createdType.itemType.backColor,
            }})
        )
    ));

    updateItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateItemType),
        mergeMap((value) => put(this.http,
            ITEMTYPE + value.itemType.id,
            { itemType: value.itemType })
        )
    ));

    deleteItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemType),
        mergeMap((value) => del(this.http,
            ITEMTYPE + value.itemType.id)
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
            GROUP + value.mapping.attributeGroupId +
            '/' + ITEMTYPE + value.mapping.itemTypeId
        ))
    ));

    createConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionType),
        mergeMap((value) => post(
            this.http, CONNECTIONTYPE, { connectionType: {
                ConnTypeId: value.connectionType.id,
                ConnTypeName: value.connectionType.name,
                ConnTypeReverseName: value.connectionType.reverseName,
              }}
        ))
    ));

    updateConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionType),
        mergeMap((value) => put(
            this.http, CONNECTIONTYPE + value.connectionType.id,
            { connectionType: value.connectionType }
        ))
    ));

    deleteConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionType),
        mergeMap((value) => del(this.http,
            CONNECTIONTYPE + value.connectionType.id
        ))
    ));

    createConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionRule),
        mergeMap((value) => post(
            this.http, CONNECTIONRULE, { connectionRule: {
                RuleId: value.connectionRule.ruleId,
                ItemUpperType: value.connectionRule.upperItemTypeId,
                ItemLowerType: value.connectionRule.lowerItemTypeId,
                ConnType: value.connectionRule.connectionTypeId,
                MaxConnectionsToUpper: value.connectionRule.maxConnectionsToUpper.toString(),
                MaxConnectionsToLower: value.connectionRule.maxConnectionsToLower.toString(),
                ValidationExpression: value.connectionRule.validationExpression,
            }}
        ))
    ));

    updateConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionRule),
        mergeMap((updatedRule) => put(this.http,
            CONNECTIONRULE + updatedRule.connectionRule.ruleId,
            { connectionRule: updatedRule.connectionRule }
        ))
    ));

    deleteConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionRule),
        mergeMap((value) => del(this.http,
            CONNECTIONRULE + value.connectionRule.ruleId
        ))
    ));

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
