import { createAction, props } from '@ngrx/store';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';

export const readUsers = createAction('[Admin] Read all users');

export const setUsers = createAction('[Admin] Set user list',
    props<{userRoleMappings: UserRoleMapping[]}>());

export const addUser = createAction('[Admin] Create a user role mapping',
    props<{userRoleMapping: UserRoleMapping}>());

export const toggleRole = createAction('[Admin] Toggle user role from admin to editor and vica versa',
    props<{user: string}>());


export const deleteUser = createAction('[Admin] Delete user role mapping',
    props<{ user: UserRoleMapping, withResponsibilities: boolean}>());


export const convertAttributeTypeToItemType = createAction('[Admin] Convert attribute type to item type',
    props<{
        attributeType: AttributeType,
        newItemTypeName: string,
        colorCode: string,
        connectionType: ConnectionType,
        position: string,
        attributeTypesToTransfer: AttributeType[],
    }>());
