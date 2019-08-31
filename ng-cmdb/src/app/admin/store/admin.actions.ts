import { createAction, props } from '@ngrx/store';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';
import { AttributeGroup } from 'src/app/shared/objects/attribute-group.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';


export const readUsers = createAction('[Admin] Read all users');

export const setUsers = createAction('[Admin] Set user list',
    props<{userRoleMappings: UserRoleMapping[]}>());

export const addUser = createAction('[Admin] Create a user role mapping',
    props<{userRoleMapping: UserRoleMapping}>());

export const toggleRole = createAction('[Admin] Toggle user role from admin to editor and vica versa',
    props<{user: string}>());

export const deleteUser = createAction('[Admin] Delete user role mapping',
    props<{ user: UserRoleMapping, withResponsibilities: boolean}>());

export const addAttributeGroup = createAction('[Admin] Add an attribute group',
    props<{attributeGroup: AttributeGroup}>());

export const updateAttributeGroup = createAction('[Admin] Update an attribute group',
    props<{attributeGroup: AttributeGroup}>());

export const deleteAttributeGroup = createAction('[Admin] Delete an attribute group',
    props<{attributeGroup: AttributeGroup}>());

export const addAttributeType = createAction('[Admin] Add an attribute type',
    props<{attributeType: AttributeType}>());

export const updateAttributeType = createAction('[Admin] Update an attribute type',
    props<{attributeType: AttributeType}>());

export const deleteAttributeType = createAction('[Admin] Delete an attribute type',
    props<{attributeType: AttributeType}>());

export const addConnectionRule = createAction('[Admin] Add a connection rule',
    props<{connectionRule: ConnectionRule}>());

export const updateConnectionRule = createAction('[Admin] Update a connection rule',
    props<{connectionRule: ConnectionRule}>());

export const deleteConnectionRule = createAction('[Admin] Delete a connection rule',
    props<{connectionRule: ConnectionRule}>());

export const addConnectionType = createAction('[Admin] Add a connection type',
    props<{connectionType: ConnectionType}>());

export const updateConnectionType = createAction('[Admin] Update a connection type',
    props<{connectionType: ConnectionType}>());

export const deleteConnectionType = createAction('[Admin] Delete a connection type',
    props<{connectionType: ConnectionType}>());

export const addItemType = createAction('[Admin] Add an item type',
    props<{itemType: ItemType}>());

export const updateItemType = createAction('[Admin] Update an item type',
    props<{itemType: ItemType}>());

export const deleteItemType = createAction('[Admin] Delete an item type',
    props<{itemType: ItemType}>());

export const addItemTypeAttributeGroupMapping = createAction('[Admin] Add a mapping between an item type and an attribute group',
    props<{mapping: ItemTypeAttributeGroupMapping}>());

export const deleteItemTypeAttributeGroupMapping = createAction('[Admin] Delete a mapping between an item type and an attribute group',
    props<{mapping: ItemTypeAttributeGroupMapping}>());

export const convertAttributeTypeToItemType = createAction('[Admin] Convert attribute type to item type',
    props<{
        attributeType: AttributeType,
        newItemTypeName: string,
        colorCode: string,
        connectionType: ConnectionType,
        position: string,
        attributeTypesToTransfer: AttributeType[],
    }>());

export const setCurrentItemType = createAction('[Admin] Set current ItemType',
    props<{itemType: ItemType}>());

