import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as AdminActions from './admin.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { getUrl, post, put, del, getHeader } from 'src/app/shared/store/functions';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';
import { Result } from 'src/app/shared/objects/result.model';

const USER = 'User/';
const USERS = 'Users';
const ATTRIBUTETYPE = 'AttributeType/';
const CONVERTTOITEMTYPE = '/ConvertToItemType';

@Injectable()
export class AdminEffects {
    fetchUsers$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.readUsers),
        switchMap(() => this.http.get<UserRoleMapping[]>(getUrl(USERS)).pipe(
            map((result: UserRoleMapping[]) => AdminActions.setUsers({userRoleMappings: result})),
            catchError((error) => of(new MetaDataActions.Error(error))),
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
                catchError((error) => of(new MetaDataActions.Error(error))),
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
                    catchError((error) => of(new MetaDataActions.Error(error)))
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

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
