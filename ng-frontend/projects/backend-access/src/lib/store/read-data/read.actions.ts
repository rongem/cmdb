import { createAction, props } from '@ngrx/store';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { Result } from '../../objects/item-data/result.model';

export const setConfigurationItem = createAction('[Read] Set read item with all data',
    props<{ configurationItem: FullConfigurationItem }>());

export const readConfigurationItem = createAction('[Read] Read item from backend',
    props<{itemId: string}>());

export const clearConfigurationItem = createAction('[Read] Clear deleted Item',
    props<{result: Result}>());

