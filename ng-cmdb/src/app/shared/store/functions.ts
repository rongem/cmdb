import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as AdminActions from 'src/app/admin/store/admin.actions';
import * as MetaDataActions from './meta-data.actions';
import { Result } from '../objects/result.model';
import { UserRole } from '../objects/user-role.enum';

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
                     successAction: MetaDataActions.MetaDataActions | AdminActions.AdminActions = new MetaDataActions.ReadState()) {
    // console.log(body);
    return http.post<Result>(getUrl(urlPart),
        body,
        { headers: getHeader() }).pipe(
            map(() => successAction),
            catchError((error) => of(new MetaDataActions.Error(error))),
    );
}

export function put(http: HttpClient, urlPart: string, body: any) {
    // console.log(body);
    return http.put<Result>(getUrl(urlPart),
        body,
        { headers: getHeader() }).pipe(
            map(() => new MetaDataActions.ReadState()),
            catchError((error) => of(new MetaDataActions.Error(error))),
    );
}

export function del(http: HttpClient, urlPart: string) {
    return http.delete<Result>(getUrl(urlPart),
        { headers: getHeader() }).pipe(
            map(() => new MetaDataActions.ReadState()),
            catchError((error) => of(new MetaDataActions.Error(error))),
    );
}

