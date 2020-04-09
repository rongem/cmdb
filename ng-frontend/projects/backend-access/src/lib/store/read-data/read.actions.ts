import { createAction, props } from '@ngrx/store';
import { FullConfigurationItem } from '../../rest-api/item-data/full/full-configuration-item.model';
import { Guid } from '../../guid';
import { Result } from '../../rest-api/result.model';

export const setConfigurationItem = createAction('[Read] Set Item with all data',
    props<{ configurationItem: FullConfigurationItem }>());

export const readConfigurationItem = createAction('[Read] Read item from backend',
    props<{itemId: Guid}>());

export const clearConfigurationItem = createAction('[Read] Clear deleted Item',
    props<{result: Result}>());

