import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { AttributeGroup } from '../objects/attribute-group.model';
import { AttributeType } from '../objects/attribute-type.model';
import { ConnectionRule } from '../objects/connection-rule.model';
import { ConnectionType } from '../objects/connection-type.model';
import { ItemType } from '../objects/item-type.model';
import { MetaData } from '../objects/meta-data.model';

export const ADD_ATTRIBUTEGROUP = '[MetaData] Add an attribute group';
export const UPDATE_ATTRIBUTEGROUP = '[MetaData] Update an attribute group';
export const DELETE_ATTRIBUTEGROUP = '[MetaData] Delete an attribute group';
export const ADD_ATTRIBUTETYPE = '[MetaData] Add an attribute type';
export const UPDATE_ATTRIBUTETYPE = '[MetaData] Update an attribute type';
export const DELETE_ATTRIBUTETYPE = '[MetaData] Delete an attribute type';
export const ADD_CONNECTIONRULE = '[MetaData] Add a connection rule';
export const UPDATE_CONNECTIONRULE = '[MetaData] Update a connection rule';
export const DELETE_CONNECTIONRULE = '[MetaData] Delete a connection rule';
export const ADD_CONNECTIONTYPE = '[MetaData] Add a connection type';
export const UPDATE_CONNECTIONTYPE = '[MetaData] Update a connection type';
export const DELETE_CONNECTIONTYPE = '[MetaData] Delete a connection type';
export const ADD_ITEMTYPE = '[MetaData] Add an item type';
export const UPDATE_ITEMTYPE = '[MetaData] Update an item type';
export const DELETE_ITEMTYPE = '[MetaData] Delete an item type';
export const SET_CURRENT_ITEMTYPE = '[MetaData] Set current ItemType and all dependent types';
export const SET_STATE = '[MetaData] Set the whole state initially';
export const READ_STATE = '[MetaData] Read the whole state from REST service';
export const ERROR = '[MetaData] Read failed, state is invalid';

export class AddAttributeGroup implements Action {
    readonly type = ADD_ATTRIBUTEGROUP;

    constructor(public payload: AttributeGroup) {}
}

export class UpdateAttributeGroup implements Action {
    readonly type = UPDATE_ATTRIBUTEGROUP;

    constructor(public payload: { index: number; attributeGroup: AttributeGroup }) {}
}

export class DeleteAttributeGroup implements Action {
    readonly type = DELETE_ATTRIBUTEGROUP;

    constructor(public payload: number) {}
}

export class AddAttributeType implements Action {
    readonly type = ADD_ATTRIBUTETYPE;

    constructor(public payload: AttributeType) {}
}

export class UpdateAttributeType implements Action {
    readonly type = UPDATE_ATTRIBUTETYPE;

    constructor(public payload: { index: number; attributeType: AttributeType }) {}
}

export class DeleteAttributeType implements Action {
    readonly type = DELETE_ATTRIBUTETYPE;

    constructor(public payload: number) {}
}

export class AddConnectionRule implements Action {
    readonly type = ADD_CONNECTIONRULE;

    constructor(public payload: ConnectionRule) {}
}

export class UpdateConnectionRule implements Action {
    readonly type = UPDATE_CONNECTIONRULE;

    constructor(public payload: { index: number; connectionRule: ConnectionRule }) {}
}

export class DeleteConnectionRule implements Action {
    readonly type = DELETE_CONNECTIONRULE;

    constructor(public payload: number) {}
}

export class AddConnectionType implements Action {
    readonly type = ADD_CONNECTIONTYPE;

    constructor(public payload: ConnectionType) {}
}

export class UpdateConnectionType implements Action {
    readonly type = UPDATE_CONNECTIONTYPE;

    constructor(public payload: { index: number; connectionType: ConnectionType }) {}
}

export class DeleteConnectionType implements Action {
    readonly type = DELETE_CONNECTIONTYPE;

    constructor(public payload: number) {}
}

export class AddItemType implements Action {
    readonly type = ADD_ITEMTYPE;

    constructor(public payload: ItemType) {}
}

export class UpdateItemType implements Action {
    readonly type = UPDATE_ITEMTYPE;

    constructor(public payload: { index: number; itemType: ItemType }) {}
}

export class DeleteItemType implements Action {
    readonly type = DELETE_ITEMTYPE;

    constructor(public payload: number) {}
}

export class SetCurrentItemType implements Action {
    readonly type = SET_CURRENT_ITEMTYPE;

    constructor(public payload: ItemType) {}
}

export class SetState implements Action {
    readonly type = SET_STATE;

    constructor(public payload: MetaData) {}
}

export class ReadState implements Action {
    readonly type = READ_STATE;
}

export class Error implements Action {
    readonly type = ERROR;

    constructor(public payload: HttpErrorResponse) {}
}


export type MetaDataActions =
    | AddAttributeGroup
    | UpdateAttributeGroup
    | DeleteAttributeGroup
    | AddAttributeType
    | UpdateAttributeType
    | DeleteAttributeType
    | AddConnectionRule
    | UpdateConnectionRule
    | DeleteConnectionRule
    | AddConnectionType
    | UpdateConnectionType
    | DeleteConnectionType
    | AddItemType
    | UpdateItemType
    | DeleteItemType
    | SetCurrentItemType
    | SetState
    | ReadState
    | Error;
