import { Action } from '@ngrx/store';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { SearchContent } from '../search-content.model';

export const ADD_ITEM_TYPE = '[Search] Add item type';
export const DELETE_ITEM_TYPE = '[Search] Remove item type';
export const ADD_ATTRIBUTE_TYPE = '[Search] Add additional attribute type';
export const DELETE_ATTRIBUTE_TYPE = '[Search] Remove one attribute type';
export const ADD_CONNECTION_TYPE_TO_UPPER = '[Search] Add connection type for an upward connection';
export const DELETE_CONNECTION_TYPE_TO_UPPER = '[Search] Remove connection type for an upward connection';
export const ADD_CONNECTION_TYPE_TO_LOWER = '[Search] Add connection type for a downward connection';
export const DELETE_CONNECTION_TYPE_TO_LOWER = '[Search] Remove connection type for a downard connection';
export const SET_RESULT_LIST = '[Search] Store result list after search';
export const DELETE_RESULT_LIST = '[Search] Clear result list';
export const PERFORM_SEARCH = '[Search] Perform search with given parameters and return the result list';
export const SET_VISIBILITY = '[Search] Set the visibility of the search panel';


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

export class PerformSearch implements Action {
    readonly type = PERFORM_SEARCH;

    constructor(public payload: SearchContent) {}
}

export class SetVisibility implements Action {
    readonly type = SET_VISIBILITY;

    constructor(public payload: boolean) {}
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
    | DeleteResultList
    | PerformSearch
    | SetVisibility;
