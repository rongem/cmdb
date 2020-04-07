import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as AdminActions from './admin.actions';
import * as MetaDataActions from 'projects/cmdb/src/app/shared/store/meta-data.actions';

import { getUrl, post, put, del, getHeader } from 'projects/cmdb/src/app/shared/store/functions';
import { UserRoleMapping, Result } from 'backend-access';

const USER = 'User/';
const USERS = 'Users';
const ATTRIBUTETYPE = 'AttributeType/';
const CONVERTTOITEMTYPE = '/ConvertToItemType';
const ATTRIBUTEGROUP = 'AttributeGroup/';
const ITEMTYPE = 'ItemType/';
const ITEMTYPEATTRIBUTEGROUPMAPPING = 'ItemTypeAttributeGroupMapping/';
const CONNECTIONTYPE = 'ConnectionType/';
const CONNECTIONRULE = 'ConnectionRule/';

@Injectable()
export class AdminEffects {
    fetchUsers$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.readUsers),
        switchMap(() => this.http.get<UserRoleMapping[]>(getUrl(USERS)).pipe(
            map((result: UserRoleMapping[]) => AdminActions.setUsers({userRoleMappings: result})),
            catchError((error) => of(MetaDataActions.error({error, invalidateData: true}))),
        ))
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addUser),
        switchMap((addUser) => post(this.http,
            USER, { userRoleMapping: addUser.userRoleMapping }, AdminActions.readUsers())
        )
    ));

    toggleUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.toggleRole),
        switchMap((user) =>
            this.http.put<Result>(getUrl(USER),
            { userToken: user.user },
            { headers: getHeader() }).pipe(
                map(() => AdminActions.readUsers()),
                catchError((error) => of(MetaDataActions.error({error, invalidateData: false}))),
            )
        ),
    ));

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteUser),
        switchMap((value) =>
            this.http.delete<Result>(getUrl(USER + value.user.Username.replace('\\', '/') +
                '/' + value.user.Role + '/' + value.withResponsibilities),
                { headers: getHeader() }).pipe(
                    map(() => AdminActions.readUsers()),
                    catchError((error) => of(MetaDataActions.error({error, invalidateData: false})))
            )
        ),
    ));

    convertAttributeTypeToItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.convertAttributeTypeToItemType),
        switchMap((value) =>
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
        switchMap((value) => post(this.http, ATTRIBUTEGROUP,
                { attributeGroup: {
                    GroupId: value.attributeGroup.GroupId.toString(),
                    GroupName: value.attributeGroup.GroupName } }
            )
        )
    ));

    updateAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateAttributeGroup),
        switchMap((value) => put(this.http,
            ATTRIBUTEGROUP + value.attributeGroup.GroupId,
            { attributeGroup: value.attributeGroup })
        )
    ));

    deleteAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeGroup),
        switchMap((value) => del(this.http,
            ATTRIBUTEGROUP + value.attributeGroup.GroupId))
    ));

    createAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addAttributeType),
        switchMap((value) => post(this.http,
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
        switchMap((value) => put(this.http,
            ATTRIBUTETYPE + value.attributeType.TypeId,
            { attributeType: value.attributeType }
        ))
    ));

    deleteAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteAttributeType),
        switchMap((value) => del(this.http,
            ATTRIBUTETYPE + value.attributeType.TypeId))
    ));

    createItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemType),
        switchMap((createdType) => post(this.http,
            ITEMTYPE, { itemType: {
                TypeId: createdType.itemType.TypeId.toString(),
                TypeName: createdType.itemType.TypeName,
                TypeBackColor: createdType.itemType.TypeBackColor,
            }})
        )
    ));

    updateItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateItemType),
        switchMap((value) => put(this.http,
            ITEMTYPE + value.itemType.TypeId,
            { itemType: value.itemType })
        )
    ));

    deleteItemType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemType),
        switchMap((value) => del(this.http,
            ITEMTYPE + value.itemType.TypeId)
        )
    ));

    createItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addItemTypeAttributeGroupMapping),
        switchMap((value) => post(
            this.http, ITEMTYPEATTRIBUTEGROUPMAPPING,
            { itemTypeAttributeGroupMapping: value.mapping }
        ))
    ));

    deleteItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteItemTypeAttributeGroupMapping),
        switchMap((value) => del(this.http, ITEMTYPEATTRIBUTEGROUPMAPPING +
            'group/' + value.mapping.GroupId +
            '/itemType/' + value.mapping.ItemTypeId
        ))
    ));

    createConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionType),
        switchMap((value) => post(
            this.http, CONNECTIONTYPE, { connectionType: {
                ConnTypeId: value.connectionType.ConnTypeId.toString(),
                ConnTypeName: value.connectionType.ConnTypeName,
                ConnTypeReverseName: value.connectionType.ConnTypeReverseName,
              }}
        ))
    ));

    updateConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionType),
        switchMap((value) => put(
            this.http, CONNECTIONTYPE + value.connectionType.ConnTypeId,
            { connectionType: value.connectionType }
        ))
    ));

    deleteConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionType),
        switchMap((value) => del(this.http,
            CONNECTIONTYPE + value.connectionType.ConnTypeId
        ))
    ));

    createConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.addConnectionRule),
        switchMap((value) => post(
            this.http, CONNECTIONRULE, { connectionRule: {
                RuleId: value.connectionRule.RuleId.toString(),
                ItemUpperType: value.connectionRule.ItemUpperType.toString(),
                ItemLowerType: value.connectionRule.ItemLowerType.toString(),
                ConnType: value.connectionRule.ConnType.toString(),
                MaxConnectionsToUpper: value.connectionRule.MaxConnectionsToUpper.toString(),
                MaxConnectionsToLower: value.connectionRule.MaxConnectionsToLower.toString(),
              }}
        ))
    ));

    updateConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConnectionRule),
        switchMap((updatedRule) => put(this.http,
            CONNECTIONRULE + updatedRule.connectionRule.RuleId,
            { connectionRule: updatedRule.connectionRule }
        ))
    ));

    deleteConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteConnectionRule),
        switchMap((value) => del(this.http,
            CONNECTIONRULE + value.connectionRule.RuleId
        ))
    ));

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
