import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';

import * as MetaDataActions from './store/meta-data/meta-data.actions';
import * as ErrorActions from './store/error-handling/error.actions';

import { AppConfigService } from './app-config/app-config.service';
import { Result } from './rest-api/result.model';

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
    return http.post<Result>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
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
    return http.put<Result>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
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
    return http.delete<Result>(getUrl(urlPart), { headers: getHeader() }).pipe(
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
