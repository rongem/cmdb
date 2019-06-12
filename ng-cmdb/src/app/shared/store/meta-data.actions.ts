import { Action } from '@ngrx/store';

import { AttributeGroup } from '../objects/attribute-group.model';
import { AttributeType } from '../objects/attribute-type.model';
import { ConnectionRule } from '../objects/connection-rule.model';
import { ConnectionType } from '../objects/connection-type.model';
import { ItemType } from '../objects/item-type.model';
import { MetaState } from './meta-data.reducer';

export const INITIALIZATION_FINISHED = 'INITIALIZATION';
export const ADD_ATTRIBUTEGROUP = 'ADD_ATTRIBUTEGROUP';
export const UPDATE_ATTRIBUTEGROUP = 'UPDATE_ATTRIBUTEGROUPS';
export const DELETE_ATTRIBUTEGROUP = 'DELETE_ATTRIBUTEGROUPS';
export const ADD_ATTRIBUTETYPE = 'ADD_ATTRIBUTETYPE';
export const UPDATE_ATTRIBUTETYPE = 'UPDATE_ATTRIBUTETYPES';
export const DELETE_ATTRIBUTETYPE = 'DELETE_ATTRIBUTETYPES';
export const ADD_CONNECTIONRULE = 'ADD_CONNECTIONRULE';
export const UPDATE_CONNECTIONRULE = 'UPDATE_CONNECTIONRULES';
export const DELETE_CONNECTIONRULE = 'DELETE_CONNECTIONRULES';
export const ADD_CONNECTIONTYPE = 'ADD_CONNECTIONTYPE';
export const UPDATE_CONNECTIONTYPE = 'UPDATE_CONNECTIONTYPES';
export const DELETE_CONNECTIONTYPE = 'DELETE_CONNECTIONTYPES';
export const ADD_ITEMTYPE = 'ADD_ITEMTYPE';
export const UPDATE_ITEMTYPE = 'UPDATE_ITEMTYPES';
export const DELETE_ITEMTYPE = 'DELETE_ITEMTYPES';
export const SET_STATE = 'SET_STATE';

export class InitializationFinished implements Action {
    readonly type = INITIALIZATION_FINISHED;

    constructor(public payload: boolean) {}
}

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

export class SetState implements Action {
    readonly type = SET_STATE;

    constructor(public payload: MetaState) {}
}

export type MetaDataActions =
    | InitializationFinished
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
    | SetState;
