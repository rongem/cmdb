import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';

import * as MetaDataActions from './store/meta-data/meta-data.actions';
import * as ErrorActions from './store/error-handling/error.actions';

import { AppConfigService } from './app-config/app-config.service';

export function getUrl(service: string) {
    if (service.endsWith('/')) {
        service = service.slice(0, -1);
    }
    return AppConfigService.settings.backend.url + service;
}

export function getHeader(suppressContentType = false) {
    return new HttpHeaders({'Content-Type': suppressContentType ? undefined : 'application/json'});
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
        catchError(error => {
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

// export function post2(http: HttpClient,
//                       urlPart: string,
//                       body: any,
//                       successCallback: (value: any) => void,
//                       invalidateMetaDataOnError = false,
//                       store?: Store,
//                       additionalErrorCallback?: (error: any) => void) {
//     return http.post(getUrl(urlPart), body, { headers: getHeader()}).pipe(
//         map(result => successCallback(result)),
//         catchError(error => {
//             if (invalidateMetaDataOnError === true && store) {
//                 store.dispatch(MetaDataActions.invalidate());
//             }
//             if (additionalErrorCallback) {
//                 additionalErrorCallback(error);
//             }
//             return of(ErrorActions.error({error, fatal: invalidateMetaDataOnError}));
//         })
//     )
// }

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
