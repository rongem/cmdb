import { Action } from '@ngrx/store';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

export const SET_ITEM = '[Configuration Item] Set Item with all data';
export const CLEAR_ITEM = '[Configuration Item] Clear Item';

export class SetItem implements Action {
    readonly type = SET_ITEM;

    constructor(public payload: FullConfigurationItem) {}
}

export class ClearItem implements Action {
    readonly type = CLEAR_ITEM;
}

export type ConfigurationItemActions =
    | SetItem
    | ClearItem;
