import { Action } from '@ngrx/store';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { UserInfo } from 'src/app/shared/objects/user-info.model';

export const SET_ITEM = 'CHANGE_ITEM';
export const SET_ATTRIBUTES = 'SET_ATTRIBUTES';
export const SET_CONNECTIONS_TO_LOWER = 'SET_CONNECTIONS_TO_LOWER';
export const SET_CONNECTIONS_TO_UPPER = 'SET_CONNECTIONS_TO_UPPER';
export const SET_RESPONSIBILITIES = 'SET_RESPONSIBILITIES';
export const SET_ITEM_READY = 'SET_ITEM_READY';

export class SetItem implements Action {
    readonly type = SET_ITEM;

    constructor(public payload: ConfigurationItem) {}
}

export class SetAttributes implements Action {
    readonly type = SET_ATTRIBUTES;

    constructor(public payload: ItemAttribute[]) {}
}

export class SetConnectionsToLower implements Action {
    readonly type = SET_CONNECTIONS_TO_LOWER;

    constructor(public payload: Connection[]) {}
}

export class SetConnectionsToUpper implements Action {
    readonly type = SET_CONNECTIONS_TO_UPPER;

    constructor(public payload: Connection[]) {}
}

export class SetResponsibilities implements Action {
    readonly type = SET_RESPONSIBILITIES;

    constructor(public payload: UserInfo[]) {}
}

export class SetItemReady implements Action {
    readonly type = SET_ITEM_READY;
}

export type ConfigurationItemActions =
    | SetItem
    | SetAttributes
    | SetConnectionsToLower
    | SetConnectionsToUpper
    | SetResponsibilities
    | SetItemReady;
