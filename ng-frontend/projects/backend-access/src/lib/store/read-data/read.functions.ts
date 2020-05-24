import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { getUrl, getHeader } from '../../functions';
import { CONFIGURATIONITEM, CONNECTABLE, CONFIGURATIONITEMS, TYPE, NAME, HISTORY, AVAILABLE, PROPOSALS, FULL,
    BYTYPE, SEARCH, NEIGHBOR, METADATA } from '../../rest-api/rest-api.constants';
import { RestMetaData } from '../../rest-api/meta-data/meta-data.model';
import { MetaData } from '../../objects/meta-data/meta-data.model';
import { RestConfigurationItem } from '../../rest-api/item-data/configuration-item.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { RestHistoryEntry } from '../../rest-api/item-data/history-entry.model';
import { HistoryEntry } from '../../objects/item-data/history-entry.model';
import { RestFullConfigurationItem } from '../../rest-api/item-data/full/full-configuration-item.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { SearchContent } from '../../objects/item-data/search/search-content.model';
import { RestSearchContent } from '../../rest-api/item-data/search/search-content.model';
import { RestNeighborItem } from '../../rest-api/item-data/search/neighbor-item.model';
import { NeighborSearch } from '../../objects/item-data/search/neighbor-search.model';
import { NeighborItem } from '../../objects/item-data/search/neighbor-item.model';

export function readMetaData(http: HttpClient) {
    return http.get<RestMetaData>(getUrl(METADATA)).pipe(
        take(1),
        map((result: RestMetaData) => new MetaData(result)),
    );
}

export function connectableItemsForItem(http: HttpClient, itemId: string, ruleId: string) {
    return http.get<RestConfigurationItem[]>(getUrl(CONFIGURATIONITEM + itemId + CONNECTABLE + ruleId), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );
}

export function connectableItemsForRule(http: HttpClient, ruleId: string) {
    return http.get<RestConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + CONNECTABLE.substr(1) + ruleId), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );
}

export function availableItemsForRuleId(http: HttpClient, ruleId: string, count: number) {
    return http.get<RestConfigurationItem[]>(getUrl(CONFIGURATIONITEM + AVAILABLE + ruleId + '/' + count), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );
}

export function itemForTypeIdAndName(http: HttpClient, typeId: string, name: string) {
    return http.get<RestConfigurationItem>(getUrl(CONFIGURATIONITEM + TYPE + typeId + NAME + name), { headers: getHeader() }).pipe(
        take(1),
        map(ci => new ConfigurationItem(ci)),
    );
}

export function itemHistory(http: HttpClient, itemId: string) {
    return http.get<RestHistoryEntry[]>(getUrl(CONFIGURATIONITEM + itemId + HISTORY), { headers: getHeader() }).pipe(
        take(1),
        map(entries => entries.map(he => new HistoryEntry(he))),
    );
}

export function fullConfigurationItem(http: HttpClient, itemId: string) {
    return http.get<RestFullConfigurationItem>(getUrl(CONFIGURATIONITEM + itemId + FULL), { headers: getHeader() }).pipe(
        take(1),
        map(i => new FullConfigurationItem(i)),
    );
}

export function proposal(http: HttpClient, text: string) {
    return http.get<string[]>(getUrl(PROPOSALS + text), { headers: getHeader() }).pipe(
        take(1),
    );
}

export function configurationItemsByTypes(http: HttpClient, typeIds: string[]) {
    return http.post<RestConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPE), {typeIds}, { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(i => new ConfigurationItem(i))),
    );
}

export function fullConfigurationItemsByType(http: HttpClient, typeId: string) {
    return http.get<RestFullConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPE + typeId + FULL), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(i => new FullConfigurationItem(i)))
    );
}

export function search(http: HttpClient, searchContent: SearchContent) {
    return http.post<RestConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + SEARCH), { search: getSearchContent(searchContent) },
        { headers: getHeader() }).pipe(take(1), map(items => items.map(i => new ConfigurationItem(i))),
    );
}

export function searchFull(http: HttpClient, searchContent: SearchContent) {
    return http.post<RestFullConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + SEARCH + FULL), { search: getSearchContent(searchContent) },
        { headers: getHeader() }).pipe(take(1), map(items => items.map(i => new FullConfigurationItem(i))),
    );
}

export function searchNeighbor(http: HttpClient, searchContent: NeighborSearch) {
    return http.post<RestNeighborItem[]>(getUrl(CONFIGURATIONITEMS + SEARCH + NEIGHBOR),
        { search: {
            ItemType: searchContent.itemTypeId,
            MaxLevels: searchContent.maxLevels,
            SearchDirection: searchContent.searchDirection,
            SourceItem: searchContent.sourceItem,
            ExtraSearch: searchContent.extraSearch ? getSearchContent(searchContent.extraSearch) : undefined,
        }},
    { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(i => new NeighborItem(i))),
    );
}

function getSearchContent(searchContent: SearchContent): RestSearchContent {
    return {
        NameOrValue: searchContent.nameOrValue,
        ItemType: !!searchContent.itemTypeId ? searchContent.itemTypeId : undefined,
        Attributes: searchContent.attributes?.map(a => ({ AttributeTypeId: a.typeId, AttributeValue: a.value })),
        ConnectionsToLower: searchContent.connectionsToLower?.map(c => ({
            ConfigurationItemType: c.configurationItemTypeId,
            ConnectionType: c.connectionTypeId,
            Count: c.count,
        })),
        ConnectionsToUpper: searchContent.connectionsToUpper?.map(c => ({
            ConfigurationItemType: c.configurationItemTypeId,
            ConnectionType: c.connectionTypeId,
            Count: c.count,
        })),
        ChangedBefore: searchContent.changedBefore?.getTime() * 10000,
        ChangedAfter: searchContent.changedAfter?.getTime() * 10000,
        ResponsibleToken: searchContent.responsibleToken,
    };
}
