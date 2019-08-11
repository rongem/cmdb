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

const USERS = 'Users';

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
    toggleUser = this.actions$.pipe(
        ofType(AdminActions.TOGGLE_ROLE),
        switchMap((user: AdminActions.ToggleRole) =>
            this.http.put<Result>(getUrl(USERS),
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
        switchMap((value: AdminActions.DeleteUser) => {
            console.log(value);
            return this.http.delete<Result>(getUrl('User/' + encodeURI(value.payload.user.Username) + 
                '/Role/' + value.payload.user.Role + '/' + value.payload.withResponsibilities),
                { headers: getHeader() }).pipe(
                    map(() => new AdminActions.ReadUsers()),
                    catchError((error) => of(new MetaDataActions.Error(error)))
            );
        }),
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
