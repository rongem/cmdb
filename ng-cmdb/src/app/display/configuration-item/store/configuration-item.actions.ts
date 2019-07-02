import { Action } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';

export const SET_ITEM = '[Configuration Item] Set Item with all data';
export const READ_ITEM = '[Configuration Item] Read item ';
export const CLEAR_ITEM = '[Configuration Item] Clear Item';

export class SetItem implements Action {
    readonly type = SET_ITEM;

    constructor(public payload: FullConfigurationItem) {}
}
export class ReadItem implements Action {
    readonly type = READ_ITEM;

    constructor(public payload: Guid) {}
}

export class ClearItem implements Action {
    readonly type = CLEAR_ITEM;

    constructor(public payload: Result) {}
}

export type ConfigurationItemActions =
    | SetItem
    | ReadItem
    | ClearItem;
