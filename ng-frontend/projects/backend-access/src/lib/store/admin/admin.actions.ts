import { createAction, props } from '@ngrx/store';

import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { ConnectionType } from '../../objects/meta-data/connection-type.model';
import { ItemType } from '../../objects/meta-data/item-type.model';
import { UserInfo } from '../../objects/item-data/user-info.model';


export const readUsers = createAction('[Admin] Read all users');

export const storeUsers = createAction('[Admin] Set user list in store',
    props<{users: UserInfo[]}>());

export const storeUser = createAction('[Admin] Set single user in store',
    props<{user: UserInfo}>());

export const unstoreUser = createAction('[Admin] Remove single user',
    props<{user: UserInfo}>());

export const createUser = createAction('[Admin] Create a user',
    props<{user: UserInfo; passphrase?: string}>());

export const updateUser = createAction('[Admin] Update user',
    props<{user: UserInfo}>());

export const deleteUser = createAction('[Admin] Delete user role mapping',
    props<{ user: UserInfo; withResponsibilities: boolean}>());

export const addAttributeGroup = createAction('[Admin] Add an attribute group',
    props<{attributeGroup: AttributeGroup}>());

export const updateAttributeGroup = createAction('[Admin] Update an attribute group',
    props<{attributeGroup: AttributeGroup}>());

export const deleteAttributeGroup = createAction('[Admin] Delete an attribute group',
    props<{attributeGroup: AttributeGroup}>());

export const storeAttributeGroup = createAction('[Admin] Set an attribute group in store',
    props<{attributeGroup: AttributeGroup}>());

export const unstoreAttributeGroup = createAction('[Admin] Remove an attribute group from store',
    props<{attributeGroup: AttributeGroup}>());

export const addAttributeType = createAction('[Admin] Add an attribute type',
    props<{attributeType: AttributeType}>());

export const updateAttributeType = createAction('[Admin] Update an attribute type',
    props<{attributeType: AttributeType}>());

export const deleteAttributeType = createAction('[Admin] Delete an attribute type',
    props<{attributeType: AttributeType}>());

export const storeAttributeType = createAction('[Admin] Set an attribute type in store',
    props<{attributeType: AttributeType}>());

export const unstoreAttributeType = createAction('[Admin] Remove an attribute type from store',
    props<{attributeType: AttributeType}>());

export const addConnectionRule = createAction('[Admin] Add a connection rule',
    props<{connectionRule: ConnectionRule}>());

export const updateConnectionRule = createAction('[Admin] Update a connection rule',
    props<{connectionRule: ConnectionRule}>());

export const deleteConnectionRule = createAction('[Admin] Delete a connection rule',
    props<{connectionRule: ConnectionRule}>());

export const storeConnectionRule = createAction('[Admin] Set an connection rule in store',
    props<{connectionRule: ConnectionRule}>());

export const unstoreConnectionRule = createAction('[Admin] Remove an connection rule from store',
    props<{connectionRule: ConnectionRule}>());

export const addConnectionType = createAction('[Admin] Add a connection type',
    props<{connectionType: ConnectionType}>());

export const updateConnectionType = createAction('[Admin] Update a connection type',
    props<{connectionType: ConnectionType}>());

export const deleteConnectionType = createAction('[Admin] Delete a connection type',
    props<{connectionType: ConnectionType}>());

export const storeConnectionType = createAction('[Admin] Set an connection type in store',
    props<{connectionType: ConnectionType}>());

export const unstoreConnectionType = createAction('[Admin] Remove an connection type from store',
    props<{connectionType: ConnectionType}>());

export const addItemType = createAction('[Admin] Add an item type',
    props<{itemType: ItemType}>());

export const updateItemType = createAction('[Admin] Update an item type',
    props<{itemType: ItemType}>());

export const deleteItemType = createAction('[Admin] Delete an item type',
    props<{itemType: ItemType}>());

export const storeItemType = createAction('[Admin] Set an item type in store',
    props<{itemType: ItemType}>());

export const unstoreItemType = createAction('[Admin] Remove an item type from store',
    props<{itemType: ItemType}>());

export const convertAttributeTypeToItemType = createAction('[Admin] Convert attribute type to item type',
    props<{
        attributeType: AttributeType;
        newItemTypeName: string;
        colorCode: string;
        connectionType: ConnectionType;
        position: 'above' | 'below';
        attributeTypesToTransfer: AttributeType[];
    }>());
