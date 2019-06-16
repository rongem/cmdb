import { Action } from '@ngrx/store';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';

export const ADD_ITEM_TYPE = 'ADD_ITEM_TYPE';
export const DELETE_ITEM_TYPE = 'DELETE_ITEM_TYPE';
export const ADD_ATTRIBUTE_TYPE = 'SET_ATTRIBUTE_TYPE';
export const DELETE_ATTRIBUTE_TYPE = 'DELETE_ATTRIBUTE_TYPE';
export const ADD_CONNECTION_TYPE_TO_UPPER = 'ADD_CONNECTION_TYPE_TO_UPPER';
export const DELETE_CONNECTION_TYPE_TO_UPPER = 'DELETE_CONNECTION_TYPE_TO_UPPER';
export const ADD_CONNECTION_TYPE_TO_LOWER = 'ADD_CONNECTION_TYPE_TO_LOWER';
export const DELETE_CONNECTION_TYPE_TO_LOWER = 'DELETE_CONNECTION_TYPE_TO_LOWER';
export const SET_RESULT_LIST = 'SET_RESULT_LIST';
export const DELETE_RESULT_LIST = 'DELETE_RESULT_LIST';


export class AddItemType implements Action {
    readonly type = ADD_ITEM_TYPE;

    constructor(public payload: ItemType) {}
}

export class DeleteItemType implements Action {
    readonly type = DELETE_ITEM_TYPE;
}

export class AddAttributeType implements Action {
    readonly type = ADD_ATTRIBUTE_TYPE;

    constructor(public payload: AttributeType) {}
}

export class DeleteAttributeType implements Action {
    readonly type = DELETE_ATTRIBUTE_TYPE;

    constructor(public payload: AttributeType) {}
}

export class AddConnectionTypeToLower implements Action {
    readonly type = ADD_CONNECTION_TYPE_TO_LOWER;

    constructor(public payload: ConnectionType) {}
}

export class DeleteConnectionTypeToLower implements Action {
    readonly type = DELETE_CONNECTION_TYPE_TO_LOWER;

    constructor(public payload: ConnectionType) {}
}

export class AddConnectionTypeToUpper implements Action {
    readonly type = ADD_CONNECTION_TYPE_TO_UPPER;

    constructor(public payload: ConnectionType) {}
}

export class DeleteConnectionTypeToUpper implements Action {
    readonly type = DELETE_CONNECTION_TYPE_TO_UPPER;

    constructor(public payload: ConnectionType) {}
}

export class SetResultList implements Action {
    readonly type = SET_RESULT_LIST;

    constructor(public payload: ConfigurationItem[]) {}
}

export class DeleteResultList implements Action {
    readonly type = DELETE_RESULT_LIST;
}

export type SearchActions =
    | AddItemType
    | DeleteItemType
    | AddAttributeType
    | DeleteAttributeType
    | AddConnectionTypeToLower
    | DeleteConnectionTypeToLower
    | AddConnectionTypeToUpper
    | DeleteConnectionTypeToUpper
    | SetResultList
    | DeleteResultList;
