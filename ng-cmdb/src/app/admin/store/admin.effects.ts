import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
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
    @Effect()
    fetchUsers = this.actions$.pipe(
        ofType(AdminActions.READ_USERS),
        switchMap(() => {
            return this.http.get<UserRoleMapping[]>(getUrl(USERS)).pipe(
                map((result: UserRoleMapping[]) => new AdminActions.SetUsers(result)),
                catchError((error) => of(new MetaDataActions.Error(error))),
            );
        })
    );

    @Effect()
    createUser = this.actions$.pipe(
        ofType(AdminActions.ADD_USER),
        switchMap((addUser: AdminActions.AddUser) => {
            console.log(addUser);
            return post(this.http, USER, { userRoleMapping: addUser.payload }, new AdminActions.ReadUsers());
        })
    );

    @Effect()
    toggleUser = this.actions$.pipe(
        ofType(AdminActions.TOGGLE_ROLE),
        switchMap((user: AdminActions.ToggleRole) =>
            this.http.put<Result>(getUrl(USER),
            { userToken: user.payload },
            { headers: getHeader() }).pipe(
                map(() => new AdminActions.ReadUsers()),
                catchError((error) => of(new MetaDataActions.Error(error))),
            )
        ),
    );

    @Effect()
    deleteUser = this.actions$.pipe(
        ofType(AdminActions.DELETE_USER),
        switchMap((value: AdminActions.DeleteUser) => 
            this.http.delete<Result>(getUrl(USER + value.payload.user.Username.replace('\\', '/') +
                '/' + value.payload.user.Role + '/' + value.payload.withResponsibilities),
                { headers: getHeader() }).pipe(
                    map(() => new AdminActions.ReadUsers()),
                    catchError((error) => of(new MetaDataActions.Error(error)))
            )
        ),
    );

    @Effect()
    convertAttributeTypeToItemType = this.actions$.pipe(
        ofType(AdminActions.CONVERT_ATTRIBUTE_TYPE_TO_ITEM_TYPE),
        switchMap((value: AdminActions.ConvertAttributeTypeToItemType) =>
            put(this.http, ATTRIBUTETYPE + value.payload.attributeType.TypeId + CONVERTTOITEMTYPE,
                {
                    newItemTypeName: value.payload.newItemTypeName,
                    colorCode: value.payload.colorCode,
                    connectionTypeId: value.payload.connectionType.ConnTypeId,
                    position: value.payload.position === 'below' ? 1 : 0,
                    attributeTypesToTransfer: value.payload.attributeTypesToTransfer
                }))
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
