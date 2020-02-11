import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as MetaDataActions from './meta-data.actions';
import { Result } from '../objects/source/result.model';
import { Action } from '@ngrx/store';
import { AppConfigService } from '../app-config.service';
import { Guid } from '../guid';
import { FullConfigurationItem } from '../objects/source/full-configuration-item.model';

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
                     successAction: Action = MetaDataActions.readState()) {
    console.log(body);
    return http.post<Result>(getUrl(urlPart),
        body,
        { headers: getHeader() }).pipe(
            map(() => successAction),
            catchError((error) => of(MetaDataActions.error({error, invalidateData: false}))),
    );
}

export function put(http: HttpClient, urlPart: string, body: any,
                    successAction: Action = MetaDataActions.readState()) {
    // console.log(body);
    return http.put<Result>(getUrl(urlPart),
        body,
        { headers: getHeader() }).pipe(
            map(() => successAction),
            catchError((error) => of(MetaDataActions.error({error, invalidateData: false}))),
    );
}

export function del(http: HttpClient, urlPart: string, successAction: Action = MetaDataActions.readState()) {
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
