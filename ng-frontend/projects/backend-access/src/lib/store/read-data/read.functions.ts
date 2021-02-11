import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { getUrl, getHeader } from '../../functions';
import { CONFIGURATIONITEM, CONNECTABLE, CONFIGURATIONITEMS, TYPE, NAME, HISTORY, AVAILABLE, PROPOSALS, FULL,
    BYTYPE, SEARCH, NEIGHBOR, METADATA, RESPONSIBILITY, BYTYPES } from '../../rest-api/rest-api.constants';
import { MetaData } from '../../objects/meta-data/meta-data.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { HistoryEntry } from '../../objects/item-data/history-entry.model';
import { RestItem } from '../../rest-api/item-data/rest-item.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { SearchContent } from '../../objects/item-data/search/search-content.model';
import { NeighborSearch } from '../../objects/item-data/search/neighbor-search.model';
import { NeighborItem } from '../../objects/item-data/search/neighbor-item.model';
import { RestNeighborItem } from '../../rest-api/item-data/search/rest-neighbor-item.model';
import { RestMetaData } from '../../rest-api/meta-data/meta-data.model';
import { AppConfigService } from '../../app-config/app-config.service';
import { RestFullConfigurationItem } from '../../rest-api/item-data/full-configuration-item.model';

export function readMetaData(http: HttpClient) {
    return http.get<RestMetaData>(getUrl(METADATA)).pipe(
        take(1),
        map((result: RestMetaData) => new MetaData(result)),
    );
}

export function connectableItemsForItem(http: HttpClient, itemId: string, ruleId: string) {
    return http.get<RestItem[]>(getUrl(CONFIGURATIONITEM + itemId + CONNECTABLE + ruleId), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );
}

export function connectableItemsForRule(http: HttpClient, ruleId: string) {
    return http.get<RestItem[]>(getUrl(CONFIGURATIONITEMS + CONNECTABLE.substr(1) + ruleId), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );
}

export function availableItemsForRuleId(http: HttpClient, ruleId: string, count: number) {
    return http.get<RestItem[]>(getUrl(CONFIGURATIONITEMS + AVAILABLE + ruleId + '/' + count),
        { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );
}

export function itemForTypeIdAndName(http: HttpClient, typeId: string, name: string) {
    return http.get<RestItem>(getUrl(CONFIGURATIONITEM + TYPE + typeId + NAME + name), { headers: getHeader() }).pipe(
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

export function configurationItem(http: HttpClient, itemId: string) {
    return http.get<RestItem>(getUrl(CONFIGURATIONITEM + itemId), { headers: getHeader() }).pipe(
        take(1),
        map(i => new ConfigurationItem(i)),
    );
}

export function fullConfigurationItem(http: HttpClient, itemId: string) {
    return http.get<RestFullConfigurationItem>(getUrl(CONFIGURATIONITEM + itemId + FULL), { headers: getHeader() }).pipe(
        take(1),
        map(i => new FullConfigurationItem(i)),
    );
}

export function configurationItemByAttributeId(http: HttpClient, attributeId: string) {
    return http.get<RestItem>(getUrl(CONFIGURATIONITEM + 'Attribute/' + attributeId), { headers: getHeader() }).pipe(
        take(1),
        map(i => new ConfigurationItem(i)),
    );
}

export function configurationItemByLinkId(http: HttpClient, linkId: string) {
    return http.get<RestItem>(getUrl(CONFIGURATIONITEM + 'Link/' + linkId), { headers: getHeader() }).pipe(
        take(1),
        map(i => new ConfigurationItem(i)),
    );
}

export function proposal(http: HttpClient, text: string) {
    return http.get<string[]>(getUrl(PROPOSALS + text), { headers: getHeader() }).pipe(
        take(1),
    );
}

export function configurationItemsByTypes(http: HttpClient, typeIds: string[]) {
    return AppConfigService.settings.backend.version === 1 ?
        http.post<RestItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPE), {typeIds}, { headers: getHeader() }).pipe(
            take(1),
            map(items => items.map(i => new ConfigurationItem(i))),
        ) :
        http.get<RestItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPES + typeIds.join(',')), { headers: getHeader() }).pipe(
            take(1),
            map(items => items.map(i => new ConfigurationItem(i))),
        );
}

export function fullConfigurationItemsByType(http: HttpClient, typeId: string) {
    return AppConfigService.settings.backend.version === 1 ?
        http.get<RestFullConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPE + typeId + FULL), { headers: getHeader() }).pipe(
            take(1),
            map(items => items.map(i => new FullConfigurationItem(i)))
        ) :
        http.get<RestFullConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPES + typeId + FULL), { headers: getHeader() }).pipe(
            take(1),
            map(items => items.map(i => new FullConfigurationItem(i)))
        );
}

export function search(http: HttpClient, searchContent: SearchContent) {
    return http.request<RestItem[]>('SEARCH', getUrl(CONFIGURATIONITEMS + SEARCH), { search: getSearchContent(searchContent) },
        { headers: getHeader() }).pipe(take(1), map(items => items.map(i => new ConfigurationItem(i))),
    );
}

export function searchFull(http: HttpClient, searchContent: SearchContent) {
    return http.request<RestFullConfigurationItem[]>('SEARCH', getUrl(CONFIGURATIONITEMS + SEARCH + FULL),
        { search: getSearchContent(searchContent) },
        { headers: getHeader() }).pipe(take(1), map(items => items.map(i => new FullConfigurationItem(i))),
    );
}

export function searchNeighbor(http: HttpClient, searchContent: NeighborSearch) {
    return http.request<RestNeighborItem[]>('SEARCH', getUrl(CONFIGURATIONITEMS + SEARCH + NEIGHBOR),
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

function getSearchContent(searchContent: SearchContent) {
    return AppConfigService.settings.backend.version === 1 ? {
        NameOrValue: searchContent.nameOrValue,
        ItemType: searchContent.itemTypeId ?? undefined,
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
    } : { // tbd
    };
}

export function isUserResponsibleForItem(http: HttpClient, itemId: string) {
    return http.get<boolean>(getUrl(CONFIGURATIONITEM + itemId + RESPONSIBILITY), { headers: getHeader() }).pipe(
        take(1)
    );
}
