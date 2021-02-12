import { HttpClient } from '@angular/common/http';
import { take, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { getUrl, getHeader } from '../../functions';
import { CONFIGURATIONITEM, CONNECTABLEASLOWERITEM, CONFIGURATIONITEMS, TYPE, NAME, HISTORY, AVAILABLE, PROPOSALS, FULL,
    BYTYPE, SEARCH, NEIGHBOR, METADATA, BYTYPES } from '../../rest-api/rest-api.constants';
import { MetaData } from '../../objects/meta-data/meta-data.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
// import { HistoryEntry } from '../../objects/item-data/history-entry.model';
import { RestItem } from '../../rest-api/item-data/rest-item.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { SearchContent } from '../../objects/item-data/search/search-content.model';
import { NeighborSearch } from '../../objects/item-data/search/neighbor-search.model';
import { NeighborItem } from '../../objects/item-data/search/neighbor-item.model';
import { RestNeighborItem } from '../../rest-api/item-data/search/rest-neighbor-item.model';
import { RestMetaData } from '../../rest-api/meta-data/meta-data.model';
import { AppConfigService } from '../../app-config/app-config.service';
import { RestFullItem } from '../../rest-api/item-data/full/rest-full-item.model';
import * as MetaDataSelectors from '../../store/meta-data/meta-data.selectors';

export function readMetaData(http: HttpClient) {
    return http.get<RestMetaData>(getUrl(METADATA)).pipe(
        take(1),
        map((result: RestMetaData) => new MetaData(result)),
    );
}

export function connectableItemsForItem(http: HttpClient, itemId: string, ruleId: string) {
    return http.get<RestItem[]>(getUrl(CONFIGURATIONITEM + itemId + CONNECTABLEASLOWERITEM + ruleId), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );
}

export function connectableItemsForRule(http: HttpClient, ruleId: string) {
    return http.get<RestItem[]>(getUrl(CONFIGURATIONITEMS + CONNECTABLEASLOWERITEM.substr(1) + ruleId), { headers: getHeader() }).pipe(
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

// export function itemHistory(http: HttpClient, itemId: string) {
//     return http.get<RestHistoryEntry[]>(getUrl(CONFIGURATIONITEM + itemId + HISTORY), { headers: getHeader() }).pipe(
//         take(1),
//         map(entries => entries.map(he => new HistoryEntry(he))),
//     );
// }

export function configurationItem(http: HttpClient, itemId: string) {
    return http.get<RestItem>(getUrl(CONFIGURATIONITEM + itemId), { headers: getHeader() }).pipe(
        take(1),
        map(i => new ConfigurationItem(i)),
    );
}

export function fullConfigurationItem(http: HttpClient, store: Store, itemId: string) {
    return http.get<RestFullItem>(getUrl(CONFIGURATIONITEM + itemId + FULL), { headers: getHeader() }).pipe(
        take(1),
        withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
        map(([i, username]) => new FullConfigurationItem(i, i.responsibleUsers?.includes(username))),
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

export function fullConfigurationItemsByType(http: HttpClient, store: Store, typeId: string) {
    return http.get<RestFullItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPES + typeId + FULL), { headers: getHeader() }).pipe(
            take(1),
            withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
            map(([items, username]) => items.map(i => new FullConfigurationItem(i, i.responsibleUsers?.includes(username))))
        );
}

export function search(http: HttpClient, searchContent: SearchContent) {
    return http.request<RestItem[]>('SEARCH', getUrl(CONFIGURATIONITEMS + SEARCH), {
        body: getSearchContent(searchContent),
        headers: getHeader(),
    }).pipe(take(1), map(items => items.map(i => new ConfigurationItem(i))));
}

export function searchFull(http: HttpClient, store: Store, searchContent: SearchContent) {
    return http.request<RestFullItem[]>('SEARCH', getUrl(CONFIGURATIONITEMS + SEARCH + FULL),
        { body: getSearchContent(searchContent), headers: getHeader() }).pipe(
            take(1),
            withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
            map(([items, username]) => items.map(i => new FullConfigurationItem(i, i.responsibleUsers?.includes(username)))
        ),
    );
}

export function searchNeighbor(http: HttpClient, searchContent: NeighborSearch) {
    return http.request<RestNeighborItem[]>('SEARCH', getUrl(CONFIGURATIONITEMS + SEARCH + NEIGHBOR), { body: {
            ItemType: searchContent.itemTypeId,
            MaxLevels: searchContent.maxLevels,
            SearchDirection: searchContent.searchDirection,
            SourceItem: searchContent.sourceItem,
            ExtraSearch: searchContent.extraSearch ? getSearchContent(searchContent.extraSearch) : undefined,
        },
        headers: getHeader(),
    }).pipe(
        take(1),
        map(items => items.map(i => new NeighborItem(i))),
    );
}

// it seems unnecessary, since objects are equal, but it provides an abstraction layer
function getSearchContent(searchContent: SearchContent) {
    return {
        nameOrValue: searchContent.nameOrValue,
        itemType: searchContent.itemTypeId ?? undefined,
        attributes: searchContent.attributes?.map(a => ({ typeId: a.typeId, value: a.value })),
        connectionsToLower: searchContent.connectionsToLower?.map(c => ({
            configurationItemType: c.configurationItemTypeId,
            connectionType: c.connectionTypeId,
            count: c.count,
        })),
        connectionsToUpper: searchContent.connectionsToUpper?.map(c => ({
            configurationItemType: c.configurationItemTypeId,
            connectionType: c.connectionTypeId,
            count: c.count,
        })),
        changedBefore: searchContent.changedBefore,
        changedAfter: searchContent.changedAfter,
        responsibleToken: searchContent.responsibleToken,
    };
}

export function isUserResponsibleForItem(store: Store, item: ConfigurationItem) {
    return store.select(MetaDataSelectors.selectUserName).pipe(
        map(name => item.responsibleUsers?.includes(name)));
}
