import { Action } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { SearchContent } from 'src/app/display/search/search-content.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';

export const SET_CONFIGURATION_ITEM = '[Display/Configuration Item] Set Item with all data';
export const READ_CONFIGURATION_ITEM = '[Display/Configuration Item] Read item ';
export const CLEAR_CONFIGURATION_ITEM = '[Display/Configuration Item] Clear Item';
export const SEARCH_ADD_NAME_OR_VALUE = '[Display/Search] Add name or value text';
export const SEARCH_ADD_ITEM_TYPE = '[Display/Search] Add item type';
export const SEARCH_DELETE_ITEM_TYPE = '[Display/Search] Remove item type';
export const SEARCH_ADD_ATTRIBUTE_TYPE = '[Display/Search] Add additional attribute type';
export const SEARCH_DELETE_ATTRIBUTE_TYPE = '[Display/Search] Remove one attribute type';
export const SEARCH_ADD_CONNECTION_TYPE_TO_UPPER = '[Display/Search] Add connection type for an upward connection';
export const SEARCH_DELETE_CONNECTION_TYPE_TO_UPPER = '[Display/Search] Remove connection type for an upward connection';
export const SEARCH_ADD_CONNECTION_TYPE_TO_LOWER = '[Display/Search] Add connection type for a downward connection';
export const SEARCH_DELETE_CONNECTION_TYPE_TO_LOWER = '[Display/Search] Remove connection type for a downard connection';
export const SEARCH_SET_RESULT_LIST = '[Display/Search] Store result list after search';
export const SEARCH_DELETE_RESULT_LIST = '[Display/Search] Clear result list';
export const PERFORM_SEARCH = '[Display/Search] Perform search with given parameters and return the result list';

export class SetConfigurationItem implements Action {
    readonly type = SET_CONFIGURATION_ITEM;

    constructor(public payload: FullConfigurationItem) {}
}
export class ReadConfigurationItem implements Action {
    readonly type = READ_CONFIGURATION_ITEM;

    constructor(public payload: Guid) {}
}

export class ClearConfigurationItem implements Action {
    readonly type = CLEAR_CONFIGURATION_ITEM;

    constructor(public payload: Result) {}
}

export class SearchAddNameOrValue implements Action {
    readonly type = SEARCH_ADD_NAME_OR_VALUE;

    constructor(public payload: string) {}
}

export class SearchAddItemType implements Action {
    readonly type = SEARCH_ADD_ITEM_TYPE;

    constructor(public payload: {
        itemType: ItemType,
        allowedAttributeTypes: AttributeType[],
        allowedConnectionTypesToUpper: ConnectionType[],
        allowedConnectionTypesToLower: ConnectionType[],
        allowedConnectionRulesToUpper: ConnectionRule[],
        allowedConnectionRulesToLower: ConnectionRule[],
    }) {}
}

export class SearchDeleteItemType implements Action {
    readonly type = SEARCH_DELETE_ITEM_TYPE;

    constructor(public payload: AttributeType[]) {}
}

export class SearchAddAttributeType implements Action {
    readonly type = SEARCH_ADD_ATTRIBUTE_TYPE;

    constructor(public payload: AttributeType) {}
}

export class SearchDeleteAttributeType implements Action {
    readonly type = SEARCH_DELETE_ATTRIBUTE_TYPE;

    constructor(public payload: AttributeType) {}
}

export class SearchAddConnectionTypeToLower implements Action {
    readonly type = SEARCH_ADD_CONNECTION_TYPE_TO_LOWER;

    constructor(public payload: ConnectionType) {}
}

export class SearchDeleteConnectionTypeToLower implements Action {
    readonly type = SEARCH_DELETE_CONNECTION_TYPE_TO_LOWER;

    constructor(public payload: ConnectionType) {}
}

export class SearchAddConnectionTypeToUpper implements Action {
    readonly type = SEARCH_ADD_CONNECTION_TYPE_TO_UPPER;

    constructor(public payload: ConnectionType) {}
}

export class SearchDeleteConnectionTypeToUpper implements Action {
    readonly type = SEARCH_DELETE_CONNECTION_TYPE_TO_UPPER;

    constructor(public payload: ConnectionType) {}
}

export class SearchSetResultList implements Action {
    readonly type = SEARCH_SET_RESULT_LIST;

    constructor(public payload: ConfigurationItem[]) {}
}

export class SearchDeleteResultList implements Action {
    readonly type = SEARCH_DELETE_RESULT_LIST;
}

export class SearchPerformSearch implements Action {
    readonly type = PERFORM_SEARCH;

    constructor(public payload: SearchContent) {}
}

export type DisplayActions =
    | SetConfigurationItem
    | ReadConfigurationItem
    | ClearConfigurationItem
    | SearchAddNameOrValue
    | SearchAddItemType
    | SearchDeleteItemType
    | SearchAddAttributeType
    | SearchDeleteAttributeType
    | SearchAddConnectionTypeToLower
    | SearchDeleteConnectionTypeToLower
    | SearchAddConnectionTypeToUpper
    | SearchDeleteConnectionTypeToUpper
    | SearchSetResultList
    | SearchDeleteResultList
    | SearchPerformSearch;

