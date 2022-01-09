import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { SearchContent } from '../../objects/item-data/search/search-content.model';
import { NeighborSearch } from '../../objects/item-data/search/neighbor-search.model';
import { NeighborItem } from '../../objects/item-data/search/neighbor-item.model';

export const performSearch = createAction('[Search] Perform search with given parameters and return the result list',
    props<{searchContent: SearchContent}>()
);

export const performSearchFull = createAction('[Search] Perform search and return the result list with full items',
    props<{searchContent: SearchContent}>()
);

export const performNeighborSearch = createAction('[NeighborSearch] Perform search with given parameters and return the result list',
    props<{searchContent: NeighborSearch}>()
);

export const setNeighborSearchResultList = createAction('[NeighborSearch] Set result list after search',
    props<{resultList: NeighborItem[]; fullItemsIncluded: boolean}>()
);

export const setResultList = createAction('[Search] Store result list after search',
    props<{configurationItems: ConfigurationItem[]}>());

export const setResultListFull = createAction('[search] Store result list with full configuration items',
    props<{configurationItems: FullConfigurationItem[]}>());

export const deleteResultList = createAction('[Search] Clear result list');
