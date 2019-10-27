import { createAction, props } from '@ngrx/store';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { VisibleComponent } from './display.reducer';
import { ItemType } from 'src/app/shared/objects/item-type.model';

export const setVisibilityState = createAction('[Display] Set visibility of the search panel',
    props<{ visibilityState: VisibleComponent }>());

export const setConfigurationItem = createAction('[Display/Configuration Item] Set Item with all data',
    props<{ configurationItem: FullConfigurationItem }>());

export const readConfigurationItem = createAction('[Display/Configuration Item] Read item',
    props<{itemId: Guid}>());

export const clearConfigurationItem = createAction('[Display/Configuration Item] Clear Item',
    props<{result: Result}>());

export const setResultList = createAction('[Display/Search] Store result list after search',
    props<{configurationItems: ConfigurationItem[]}>());

export const setResultListFull = createAction('[Display/search] Store result list with full configuration items',
    props<{configurationItems: FullConfigurationItem[]}>());

export const deleteResultList = createAction('[Display/Search] Clear result list');

export const filterResultsByItemType = createAction('[Display/Results] Filter result lists by item type',
    props<{ itemType: ItemType}>());

