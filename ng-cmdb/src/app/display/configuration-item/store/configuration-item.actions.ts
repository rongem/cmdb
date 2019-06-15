import { Action } from '@ngrx/store';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

export const SET_ITEM = 'SET_ITEM';
export const CLEAR_ITEM = 'CLEAR_ITEM';

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
