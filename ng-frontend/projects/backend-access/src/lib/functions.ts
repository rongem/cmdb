/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take } from 'rxjs';

import { AppConfigService } from './app-config/app-config.service';

export const getUrl = (service: string) => {
    if (service.endsWith('/')) {
        service = service.slice(0, -1);
    }
    return AppConfigService.settings.backend.url + service;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const getHeader = (suppressContentType = false) => new HttpHeaders({'Content-Type': suppressContentType ? undefined : 'application/json'});

export function post<T>(http: HttpClient, urlPart: string, body: any): Observable<T> {
    // console.log(body);
    return http.post<T>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
        take(1),
    );
}

export function put<T>(http: HttpClient, urlPart: string, body: any): Observable<T> {
    // console.log(body);
    return http.put<T>(getUrl(urlPart), body, { headers: getHeader() }).pipe(
        take(1),
    );
}

export function del<T>(http: HttpClient, urlPart: string): Observable<T> {
    // console.log(body);
    return http.delete<T>(getUrl(urlPart), { headers: getHeader() }).pipe(
        take(1),
    );
}
