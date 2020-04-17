import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { RestConfigurationItem } from '../../rest-api/item-data/configuration-item.model';
import { getUrl, getHeader } from '../../functions';
import { CONFIGURATIONITEM, CONNECTABLE, CONFIGURATIONITEMS, TYPE, NAME, HISTORY, AVAILABLE, PROPOSALS, FULL, BYTYPE } from '../constants';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { RestHistoryEntry } from '../../rest-api/item-data/history-entry.model';
import { HistoryEntry } from '../../objects/item-data/history-entry.model';
import { RestFullConfigurationItem } from '../../rest-api/item-data/full/full-configuration-item.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';

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
    return http.get<string[]>(getUrl(PROPOSALS + text)).pipe(
        take(1),
    );
}

export function getConfigurationItemsByTypes(http: HttpClient, typeIds: string[]) {
    return http.post<RestConfigurationItem[]>(getUrl(CONFIGURATIONITEM + BYTYPE), {typeIds}, { headers: getHeader() }).pipe(
        take(1),
        map(items => items.map(i => new ConfigurationItem(i))),
    );
}
