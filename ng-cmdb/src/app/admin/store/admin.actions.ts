import { Action } from '@ngrx/store';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';

export const READ_USERS = '[Admin] Read all users';
export const SET_USERS = '[Admin] Set user list';
export const ADD_USER = '[Admin] Create a user role mapping';
export const TOGGLE_ROLE = '[Admin] Toggle user role from admin to editor and vica versa';
export const DELETE_USER = '[Admin] Delete user';
export const CONVERT_ATTRIBUTE_TYPE_TO_ITEM_TYPE = '[Admin] Convert attribute type to item type';

export class ReadUsers implements Action {
    readonly type = READ_USERS;
}

export class SetUsers implements Action {
    readonly type = SET_USERS;

    constructor(public payload: UserRoleMapping[]) {}
}

export class AddUser implements Action {
    readonly type = ADD_USER;

    constructor(public payload: UserRoleMapping) {}
}

export class ToggleRole implements Action {
    readonly type = TOGGLE_ROLE;

    constructor(public payload: string) {}
}

export class DeleteUser implements Action {
    readonly type = DELETE_USER;

    constructor(public payload: { user: UserRoleMapping, withResponsibilities: boolean}) {}
}

export class ConvertAttributeTypeToItemType implements Action {
    readonly type = CONVERT_ATTRIBUTE_TYPE_TO_ITEM_TYPE;

    constructor(public payload: {
        attributeType: AttributeType,
        newItemTypeName: string,
        colorCode: string,
        connectionType: ConnectionType,
        position: string,
        attributeTypesToTransfer: AttributeType[],
    }) {}
}

export type AdminActions =
    | ReadUsers
    | SetUsers
    | AddUser
    | ToggleRole
    | DeleteUser
    | ConvertAttributeTypeToItemType;
