import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as MetaDataActions from './meta-data.actions';
import * as fromMetaData from './meta-data.selectors';

import { Result } from '../objects/rest-api/result.model';
import { Action, Store, select } from '@ngrx/store';
import { AppConfigService } from '../app-config.service';
import { Guid } from '../guid';
import { FullConfigurationItem } from '../objects/rest-api/full-configuration-item.model';
import { AppState } from './app.reducer';

export function getUrl(service: string) {
    if (service.endsWith('/')) {
        service = service.slice(0, -1);
    }
    return AppConfigService.settings.backend.url + service;
}

export function toHex(value: number) {
    const ret = value.toString(16);
    return ret.length === 1 ? '0' + ret : ret;
}

export function fromHex(value: string) {
    if (value.startsWith('#')) {
        value = value.substring(1);
    }
    return parseInt(value, 16);
}

export function getHeader() {
    return new HttpHeaders({ 'Content-Type': 'application/json'});
}

export function post(http: HttpClient, urlPart: string, body: any,
                     successAction: Action = MetaDataActions.readState({resetRetryCount: false}),
                     invalidateData = false) {
    // console.log(body);
    return http.post<Result>(getUrl(urlPart),
        body,
        { headers: getHeader() }).pipe(
            map(() => successAction),
            catchError((error) => of(MetaDataActions.error({error, invalidateData}))),
    );
}

export function put(http: HttpClient, urlPart: string, body: any,
                    successAction: Action = MetaDataActions.readState({resetRetryCount: false}),
                    invalidateData = false) {
    // console.log(body);
    return http.put<Result>(getUrl(urlPart),
        body,
        { headers: getHeader() }).pipe(
            map(() => successAction),
            catchError((error) => of(MetaDataActions.error({error, invalidateData}))),
    );
}

export function del(http: HttpClient, urlPart: string, successAction: Action = MetaDataActions.readState({resetRetryCount: false})) {
    return http.delete<Result>(getUrl(urlPart),
        { headers: getHeader() }).pipe(
            map(() => successAction),
            catchError((error) => of(MetaDataActions.error({error, invalidateData: false}))),
    );
}

export function getConfigurationItem(http: HttpClient, guid: Guid) {
    return http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + guid + '/Full')).pipe(
        catchError((error) => of(MetaDataActions.error({error, invalidateData: false}))),
    );
}

export function getConfigurationItemsByType(http: HttpClient, typeId: Guid) {
    return http.get<FullConfigurationItem[]>(getUrl('ConfigurationItems/ByType/' + typeId + '/Full'));
}

export function getConfigurationItemsByTypeName(store: Store<AppState>, http: HttpClient, typeName: string) {
    return store.pipe(
        select(fromMetaData.selectSingleItemTypeByName, typeName),
        switchMap(itemType => getConfigurationItemsByType(http, itemType.TypeId)),
    );
}
