import { createAction, props } from '@ngrx/store';
import { ItemType } from 'backend-access';

export const setCurrentItemType = createAction('[Admin] Set current ItemType',
    props<{itemType: ItemType}>());

