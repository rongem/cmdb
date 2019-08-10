import { Action } from '@ngrx/store';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';

export const READ_USERS = '[Admin] Read all users';
export const SET_USERS = '[Admin] Set user list';

export class ReadUsers implements Action {
    readonly type = READ_USERS;
}

export class SetUsers implements Action {
    readonly type = SET_USERS;

    constructor(public payload: UserRoleMapping[]) {}
}

export type AdminActions =
    | ReadUsers
    | SetUsers;
