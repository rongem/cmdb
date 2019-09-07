import { createAction, props } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { SearchContent } from 'src/app/display/search/search-content.model';
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

export const searchChangeMetaData = createAction('[Display/Search] Change MetaData',
    props<{attributeTypes: AttributeType[]}>());

export const searchAddNameOrValue = createAction('[Display/Search] Add name or value text',
    props<{text: string}>());

export const searchAddItemType = createAction('[Display/Search] Add item type',
    props<{itemTypeId: Guid}>());

export const searchDeleteItemType = createAction('[Display/Search] Remove item type');

export const searchAddAttributeType = createAction('[Display/Search] Add additional attribute type',
    props<{attributeTypeId: Guid}>());

export const searchDeleteAttributeType = createAction('[Display/Search] Remove one attribute type',
    props<{attributeTypeId: Guid}>());

export const searchAddConnectionTypeToUpper = createAction('[Display/Search] Add connection type for an upward connection',
    props<{connectionTypeId: Guid}>());

export const searchDeleteConnectionTypeToUpper = createAction('[Display/Search] Remove connection type for an upward connection',
    props<{connectionTypeId: Guid}>());

export const searchAddConnectionTypeToLower = createAction('[Display/Search] Add connection type for a downward connection',
    props<{connectionTypeId: Guid}>());

export const searchDeleteConnectionTypeToLower = createAction('[Display/Search] Remove connection type for a downard connection',
    props<{connectionTypeId: Guid}>());

export const setResultList = createAction('[Display/Search] Store result list after search',
    props<{configurationItems: ConfigurationItem[]}>());

export const setResultListFull = createAction('[Display/search] Store result list with full configuration items',
    props<{configurationItems: FullConfigurationItem[]}>());

export const deleteResultList = createAction('[Display/Search] Clear result list');

export const performSearch = createAction('[Display/Search] Perform search with given parameters and return the result list',
    props<{searchContent: SearchContent}>());

export const fillResultListFullAfterSearch = createAction('[Display/Search] Fill result list full after search',
    props<{searchContent: SearchContent}>());

export const filterResultsByItemType = createAction('[Display/Results] Filter result lists by item type',
    props<{ itemType: ItemType}>());

