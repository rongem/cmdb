import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as AdminActions from 'src/app/admin/store/admin.actions';
import * as MetaDataActions from './meta-data.actions';
import { Result } from '../objects/result.model';
import { UserRole } from '../objects/user-role.enum';
import { Action } from '@ngrx/store';

export function getUrl(service: string) {
    if (service.endsWith('/')) {
        service = service.slice(0, -1);
    }
    return 'http://localhost:51717/API/REST.svc/' + service;
}

export function getHeader() {
    return new HttpHeaders({ 'Content-Type': 'application/json'});
}

export function post(http: HttpClient, urlPart: string, body: any,
                     successAction: Action = MetaDataActions.readState()) {
    // console.log(body);
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

