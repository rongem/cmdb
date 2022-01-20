/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, take, withLatestFrom } from 'rxjs';

import { getUrl, getHeader } from '../../functions';
import { CONFIGURATIONITEM, CONNECTABLEASLOWERITEM, CONFIGURATIONITEMS, TYPE, NAME, HISTORY, AVAILABLE, PROPOSALS, FULL,
    BYTYPE, METADATA, BYTYPES, ITEM, RULE, SEARCHTEXT, RECENT } from '../../rest-api/rest-api.constants';
import { MetaData } from '../../objects/meta-data/meta-data.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { ItemHistory } from '../../objects/item-data/item-history.model';
import { IRestItemHistory } from '../../rest-api/item-data/rest-item-history.model';
import { IRestItem } from '../../rest-api/item-data/rest-item.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { SearchContent } from '../../objects/item-data/search/search-content.model';
import { Direction, NeighborSearch } from '../../objects/item-data/search/neighbor-search.model';
import { NeighborItem } from '../../objects/item-data/search/neighbor-item.model';
import { IRestNeighborItem } from '../../rest-api/item-data/search/rest-neighbor-item.model';
import { IRestMetaData } from '../../rest-api/meta-data/meta-data.model';
import { AppConfigService } from '../../app-config/app-config.service';
import { IRestFullItem } from '../../rest-api/item-data/full/rest-full-item.model';
import * as MetaDataSelectors from '../../store/meta-data/meta-data.selectors';
import { IRestSearchContent } from '../../rest-api/item-data/search/rest-search-content.model';

export const readMetaData = (http: HttpClient) => http.get<IRestMetaData>(getUrl(METADATA)).pipe(
    take(1),
    map((result: IRestMetaData) => new MetaData(result)),
);

export const connectableItemsForItem = (http: HttpClient, itemId: string, ruleId: string) =>
    http.get<IRestItem[]>(getUrl(CONFIGURATIONITEMS + CONNECTABLEASLOWERITEM + ITEM + itemId + RULE + ruleId), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );

export const connectableItemsForRule = (http: HttpClient, ruleId: string) =>
    http.get<IRestItem[]>(getUrl(CONFIGURATIONITEMS + CONNECTABLEASLOWERITEM + RULE.substring(1) + ruleId), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );

export const availableItemsForRuleId = (http: HttpClient, ruleId: string, count: number) =>
    http.get<IRestItem[]>(getUrl(CONFIGURATIONITEMS + AVAILABLE + ruleId + '/' + count),
        { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(ci => new ConfigurationItem(ci))),
    );

export const itemForTypeIdAndName = (http: HttpClient, typeId: string, name: string) =>
    http.get<IRestItem>(getUrl(CONFIGURATIONITEM + TYPE + typeId + NAME + name), { headers: getHeader() }).pipe(
        take(1),
        map(ci => new ConfigurationItem(ci)),
    );

export const itemHistory = (http: HttpClient, itemId: string) =>
    http.get<IRestItemHistory>(getUrl(CONFIGURATIONITEM + itemId + HISTORY), { headers: getHeader() }).pipe(
        take(1),
        map(entry => new ItemHistory(entry)),
    );

export const configurationItem = (http: HttpClient, itemId: string) => http.get<IRestItem>(getUrl(CONFIGURATIONITEM + itemId), { headers: getHeader() }).pipe(
    take(1),
    map(i => new ConfigurationItem(i)),
);

export const fullConfigurationItem = (http: HttpClient, store: Store, itemId: string) =>
    http.get<IRestFullItem>(getUrl(CONFIGURATIONITEM + itemId + FULL), { headers: getHeader() }).pipe(
        take(1),
        withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
        map(([i, username]) => new FullConfigurationItem(i, i.responsibleUsers?.includes(username))),
    );

export const fullConfigurationItems = (http: HttpClient, store: Store, itemIds: string[]) =>
    http.get<IRestFullItem[]>(getUrl(CONFIGURATIONITEMS + itemIds.join(',') + FULL), { headers: getHeader() }).pipe(
        take(1),
        withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
        map(([items, username]) => items.map(i => new FullConfigurationItem(i, i.responsibleUsers?.includes(username)))),
    );

export const configurationItemByAttributeId = (http: HttpClient, attributeId: string) =>
    http.get<IRestItem>(getUrl(CONFIGURATIONITEM + 'Attribute/' + attributeId), { headers: getHeader() }).pipe(
        take(1),
        map(i => new ConfigurationItem(i)),
    );

export const configurationItemByLinkId = (http: HttpClient, linkId: string) =>
    http.get<IRestItem>(getUrl(CONFIGURATIONITEM + 'Link/' + linkId), { headers: getHeader() }).pipe(
        take(1),
        map(i => new ConfigurationItem(i)),
    );

export const proposal = (http: HttpClient, text: string) => http.get<string[]>(getUrl(PROPOSALS + text), { headers: getHeader() }).pipe(take(1));

export const configurationItemsByTypes = (http: HttpClient, typeIds: string[]) => AppConfigService.settings.backend.version === 1 ?
    http.post<IRestItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPE), {typeIds}, { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(i => new ConfigurationItem(i))),
    ) :
    http.get<IRestItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPES + typeIds.join(',')), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(i => new ConfigurationItem(i))),
    );

export const fullConfigurationItemsByType = (http: HttpClient, store: Store, typeId: string) =>
    http.get<IRestFullItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPES + typeId + FULL), { headers: getHeader() }).pipe(
        take(1),
        withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
        map(([items, username]) => items.map(i => new FullConfigurationItem(i, i.responsibleUsers?.includes(username))))
    );

export const getRecentlyChangedItems = (http: HttpClient, store: Store, listCount: number) =>
    http.get<IRestItem[]>(getUrl(CONFIGURATIONITEMS + RECENT + listCount.toString())).pipe(
        take(1),
        withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
        map(([items, username]) => items.map(i => new FullConfigurationItem(i, i.responsibleUsers?.includes(username)))),
);

export const search = (http: HttpClient, searchContent: SearchContent) =>http.post<IRestItem[]>(getUrl(CONFIGURATIONITEMS + SEARCHTEXT),
    getSearchContent(searchContent), { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(i => new ConfigurationItem(i)))
);

export const searchFull = (http: HttpClient, store: Store, searchContent: SearchContent) =>
    http.post<IRestFullItem[]>(getUrl(CONFIGURATIONITEMS + FULL.substring(1) + '/' + SEARCHTEXT), getSearchContent(searchContent),
        { headers: getHeader() }).pipe(
            take(1),
            withLatestFrom(store.select(MetaDataSelectors.selectUserName)),
            map(([items, username]) => items.map(i => new FullConfigurationItem(i, i.responsibleUsers?.includes(username)))
        ),
    );

export const searchNeighbor = (http: HttpClient, searchContent: NeighborSearch) => {
    let searchDirection: string;
    switch (searchContent.searchDirection) {
        case Direction.both:
            searchDirection = 'both';
            break;
        case Direction.upward:
            searchDirection = 'up';
            break;
        case Direction.downward:
            searchDirection = 'down';
            break;
        default:
            throw new Error('illegal direction');

    }
    return http.post<IRestNeighborItem[]>(getUrl(CONFIGURATIONITEM + searchContent.sourceItem) + '/' + SEARCHTEXT, {
        itemTypeId: searchContent.itemTypeId,
        maxLevels: searchContent.maxLevels,
        searchDirection,
        extraSearch: searchContent.extraSearch ? getSearchContent(searchContent.extraSearch) : undefined,
    }, {  headers: getHeader(),
    }).pipe(
        take(1),
        map(items => items.map(i => new NeighborItem(i))),
    );
};

// it provides an abstraction layer
const getSearchContent = (searchContent: SearchContent): IRestSearchContent => ({
    nameOrValue: searchContent.nameOrValue !== '' ? searchContent.nameOrValue : undefined,
    itemTypeId: searchContent.itemTypeId ?? undefined,
    attributes: searchContent.attributes && searchContent.attributes.length > 0 ?
        searchContent.attributes.map(a => ({ typeId: a.typeId, value: a.value })) : undefined,
    connectionsToLower: searchContent.connectionsToLower && searchContent.connectionsToLower.length > 0 ?
        searchContent.connectionsToLower.map(c => ({
        itemTypeId: c.itemTypeId,
        connectionTypeId: c.connectionTypeId,
        count: c.count,
    })) : undefined,
    connectionsToUpper: searchContent.connectionsToUpper && searchContent.connectionsToUpper.length > 0 ?
        searchContent.connectionsToUpper.map(c => ({
        itemTypeId: c.itemTypeId,
        connectionTypeId: c.connectionTypeId,
        count: c.count,
    })) : undefined,
    changedBefore: searchContent.changedBefore,
    changedAfter: searchContent.changedAfter,
    responsibleUser: searchContent.responsibleToken !== '' ? searchContent.responsibleToken : undefined,
});

export const isUserResponsibleForItem = (store: Store, item: ConfigurationItem) => store.select(MetaDataSelectors.selectUserName).pipe(
        map(name => item.responsibleUsers?.includes(name)));

