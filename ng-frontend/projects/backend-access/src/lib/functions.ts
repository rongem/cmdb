import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';

import * as MetaDataActions from './store/meta-data/meta-data.actions';
import * as ErrorActions from './store/error-handling/error.actions';

import { AppConfigService } from './app-config/app-config.service';
import { RestResult } from './rest-api/result.model';
import { SearchContent } from './objects/item-data/search/search-content.model';
import { RestSearchContent } from './rest-api/item-data/search/search-content.model';

export function getUrl(service: string) {
    if (service.endsWith('/')) {
        service = service.slice(0, -1);
    }
    return AppConfigService.settings.backend.url + service;
}

export function getHeader() {
    return new HttpHeaders({ 'Content-Type': 'application/json'});
}

export function post(http: HttpClient,
                     urlPart: string,
                     body: any,
                     successAction: Action = MetaDataActions.readState(),
                     invalidateMetaDataOnError = false,
                     store?: Store,
                     additionalErrorAction?: Action) {
    // console.log(body);
    return http.post<RestResult>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
        map(() => successAction),
        catchError((error) => {
            if (invalidateMetaDataOnError === true && store) {
                store.dispatch(MetaDataActions.invalidate());
            }
            if (store && additionalErrorAction) {
                store.dispatch(additionalErrorAction);
            }
            return of(ErrorActions.error({error, fatal: invalidateMetaDataOnError}));
        }),
    );
}

export function put(http: HttpClient,
                    urlPart: string,
                    body: any,
                    successAction: Action = MetaDataActions.readState(),
                    invalidateMetaDataOnError = false,
                    store?: Store,
                    additionalErrorAction?: Action) {
    // console.log(body);
    return http.put<RestResult>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
        map(() => successAction),
        catchError((error) => {
            if (invalidateMetaDataOnError === true && store) {
                store.dispatch(MetaDataActions.invalidate());
            }
            if (store && additionalErrorAction) {
                store.dispatch(additionalErrorAction);
            }
            return of(ErrorActions.error({error, fatal: invalidateMetaDataOnError}));
        }),
    );
}

export function del(http: HttpClient,
                    urlPart: string,
                    successAction: Action = MetaDataActions.readState(),
                    invalidateMetaDataOnError = false,
                    store?: Store,
                    additionalErrorAction?: Action) {
    return http.delete<RestResult>(getUrl(urlPart), { headers: getHeader() }).pipe(
        map(() => successAction),
        catchError((error) => {
            if (invalidateMetaDataOnError === true && store) {
                store.dispatch(MetaDataActions.invalidate());
            }
            if (store && additionalErrorAction) {
                store.dispatch(additionalErrorAction);
            }
            return of(ErrorActions.error({error, fatal: invalidateMetaDataOnError}));
        }),
    );
}

export function getSearchContent(searchContent: SearchContent): RestSearchContent {
    return {
        NameOrValue: searchContent.nameOrValue,
        ItemType: searchContent.itemTypeId,
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
        ResponsibleToken: searchContent.responsibleToken,
    };
}
