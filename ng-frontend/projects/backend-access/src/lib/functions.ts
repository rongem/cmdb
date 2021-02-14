import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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

export function post<T>(http: HttpClient, urlPart: string, body: any): Observable<T> {
    // console.log(body);
    return http.post<T>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
        take(1),
    );
}

// export function post<T>(http: HttpClient,
//                         urlPart: string,
//                         body: any,
//                         successAction: Action = MetaDataActions.readState(),
//                         invalidateMetaDataOnError = false,
//                         store?: Store,
//                         additionalErrorAction?: Action) {
//     // console.log(body);
//     return http.post<T>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
//         map(() => successAction),
//         catchError(error => {
//             if (invalidateMetaDataOnError === true && store) {
//                 store.dispatch(MetaDataActions.invalidate());
//             }
//             if (store && additionalErrorAction) {
//                 store.dispatch(additionalErrorAction);
//             }
//             return of(ErrorActions.error({error, fatal: invalidateMetaDataOnError}));
//         }),
//     );
// }

export function put<T>(http: HttpClient, urlPart: string, body: any): Observable<T> {
    // console.log(body);
    return http.put<T>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
        take(1),
    );
}

// export function put<T>(http: HttpClient,
//                        urlPart: string,
//                        body: any,
//                        successAction: Action = MetaDataActions.readState(),
//                        invalidateMetaDataOnError = false,
//                        store?: Store,
//                        additionalErrorAction?: Action) {
//     // console.log(body);
//     return http.put<T>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
//         map(() => successAction),
//         catchError((error) => {
//             if (invalidateMetaDataOnError === true && store) {
//                 store.dispatch(MetaDataActions.invalidate());
//             }
//             if (store && additionalErrorAction) {
//                 store.dispatch(additionalErrorAction);
//             }
//             return of(ErrorActions.error({error, fatal: invalidateMetaDataOnError}));
//         }),
//     );
// }

export function del<T>(http: HttpClient, urlPart: string): Observable<T> {
    // console.log(body);
    return http.delete<T>(getUrl(urlPart), { headers: getHeader() }).pipe(
        take(1),
    );
}

// export function del<T>(http: HttpClient,
//                        urlPart: string,
//                        successAction: Action = MetaDataActions.readState(),
//                        invalidateMetaDataOnError = false,
//                        store?: Store,
//                        additionalErrorAction?: Action) {
//     return http.delete<T>(getUrl(urlPart), { headers: getHeader() }).pipe(
//         map(() => successAction),
//         catchError((error) => {
//             if (invalidateMetaDataOnError === true && store) {
//                 store.dispatch(MetaDataActions.invalidate());
//             }
//             if (store && additionalErrorAction) {
//                 store.dispatch(additionalErrorAction);
//             }
//             return of(ErrorActions.error({error, fatal: invalidateMetaDataOnError}));
//         }),
//     );
// }
