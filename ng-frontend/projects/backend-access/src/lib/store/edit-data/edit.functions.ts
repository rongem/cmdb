/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map, Observable, of, take } from 'rxjs';

import * as ErrorActions from '../../store/error-handling/error.actions';

import {
    CONFIGURATIONITEM,
    IMPORTDATATABLE,
    IMPORTCONVERTFILETOTABLE,
    FULL,
    CONNECTION,
    RESPONSIBILITY,
    DESCRIPTION
} from '../../rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { TransferTable } from '../../objects/import/transfer-table.model';
import { IRestLineMessage } from '../../rest-api/rest-line-message.model';
import { LineMessage } from '../../objects/import/line-message.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { Connection } from '../../objects/item-data/connection.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { IRestItem } from '../../rest-api/item-data/rest-item.model';
import { IRestFullItem } from '../../rest-api/item-data/full/rest-full-item.model';
import { IRestConnection } from '../../rest-api/item-data/rest-connection.model';
import { RestImportResult } from '../../rest-api/rest-import-result.model';
import { ImportResult } from '../../objects/import/import-result.model';

export const importDataTable = (http: HttpClient, itemTypeId: string, table: TransferTable) =>
    http.put<IRestLineMessage[]>(getUrl(IMPORTDATATABLE), {
        columns: table.columns,
        rows: table.rows,
        itemTypeId
    }, { headers: getHeader() }).pipe(
        take(1),
        map(messages => messages.map(m => new LineMessage(m))),
    );

export const uploadAndConvertFileToTable = (http: HttpClient, file: File) => {
    const formData: FormData = new FormData();
    formData.append('workbook', file, file.name);
    return http.post<RestImportResult>(getUrl(IMPORTCONVERTFILETOTABLE), formData).pipe(
        take(1),
        map(result => new ImportResult(result)),
    );
};

export const createConfigurationItem = (http: HttpClient, store: Store, item: ConfigurationItem): Observable<ConfigurationItem> =>
    post<IRestItem>(http, CONFIGURATIONITEM, {
        typeId: item.typeId,
        name: item.name,
        attributes: item.attributes ? item.attributes.map(a => ({
            typeId: a.typeId,
            value: a.value,
        })) : [],
        links: item.links ? item.links.map(l => ({
            uri: l.uri,
            description: l.description,
        })) : [],
        responsibleUsers: item.responsibleUsers ?? [],
    }).pipe(
        map(restItem => new ConfigurationItem(restItem)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const createFullConfigurationItem = (http: HttpClient, store: Store, item: FullConfigurationItem): Observable<FullConfigurationItem> =>
    post<IRestFullItem>(http, CONFIGURATIONITEM + FULL.substring(1), {
        id: item.id,
        typeId: item.typeId,
        name: item.name,
        attributes: item.attributes?.map(a => ({
            typeId: a.typeId,
            value: a.value,
        })),
        connectionsToUpper: item.connectionsToUpper?.map(c => ({
            ruleId: c.ruleId,
            targetId: c.targetId,
            description: c.description,
        })),
        connectionsToLower: item.connectionsToLower?.map(c => ({
            ruleId: c.ruleId,
            targetId: c.targetId,
            description: c.description,
        })),
        links: item.links?.map(l => ({
            uri: l.uri,
            description: l.description,
        })),
    }).pipe(
        map(restItem => new FullConfigurationItem(restItem)),
        catchError(error => {
            store.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const updateConfigurationItem = (http: HttpClient, store: Store, item: ConfigurationItem): Observable<ConfigurationItem> =>
    put<IRestItem>(http, CONFIGURATIONITEM + item.id, {
        id: item.id,
        typeId: item.typeId,
        name: item.name,
        typeName: item.type,
        lastChange: item.lastChange,
        version: item.version,
        attributes: item.attributes ? item.attributes.map(a => ({
            typeId: a.typeId,
            value: a.value,
        })) : [],
        links: item.links ? item.links.map(l => ({
            uri: l.uri,
            description: l.description,
        })) : [],
        responsibleUsers: [...item.responsibleUsers],
    }).pipe(
        map(restItem => new ConfigurationItem(restItem)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const deleteConfigurationItem = (http: HttpClient, store: Store, itemId: string): Observable<ConfigurationItem> =>
    del<IRestItem>(http, CONFIGURATIONITEM + itemId).pipe(
        map(restItem => new ConfigurationItem(restItem)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const createConnection = (http: HttpClient, store: Store, connection: Connection): Observable<Connection> =>
    post<IRestConnection>(http, CONNECTION, {
        id: connection.id,
        typeId: connection.typeId,
        upperItemId: connection.upperItemId,
        lowerItemId: connection.lowerItemId,
        ruleId: connection.ruleId,
        description: connection.description,
    }).pipe(
        map(restConnection => new Connection(restConnection)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const updateConnection = (http: HttpClient, store: Store, connection: Connection): Observable<Connection> =>
    put<IRestConnection>(http, CONNECTION + connection.id + DESCRIPTION, {description: connection.description}).pipe(
        map(restConnection => new Connection(restConnection)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const deleteConnection = (http: HttpClient, store: Store, connectionId: string): Observable<Connection> =>
    del<IRestConnection>(http, CONNECTION + connectionId).pipe(
        map(restConnection => new Connection(restConnection)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const takeResponsibility = (http: HttpClient, store: Store, itemId: string): Observable<ConfigurationItem> =>
    post<IRestItem>(http, CONFIGURATIONITEM + itemId + RESPONSIBILITY, undefined).pipe(
        map(restItem => new ConfigurationItem(restItem)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const abandonResponsibility = (http: HttpClient, store: Store, itemId: string): Observable<ConfigurationItem> =>
    del<IRestItem>(http, CONFIGURATIONITEM + itemId + RESPONSIBILITY).pipe(
        map(restItem => new ConfigurationItem(restItem)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

// identifies a connection by rule id, which means that only one connection with this rule id is allowed
// or the function will fail
export const ensureUniqueConnectionToLower = (http: HttpClient,
                                              store: Store,
                                              item: FullConfigurationItem,
                                              connectionRule: ConnectionRule,
                                              targetItemId: string,
                                              description: string) => {
    if (!item.connectionsToLower) {
        item.connectionsToLower = [];
    }
    if (item.connectionsToLower.filter(c => c.ruleId === connectionRule.id).length > 1) {
        return null;
    }
    const conn = item.connectionsToLower.find(c => c.ruleId === connectionRule.id);
    if (conn) {
        // connection exists
        if (conn.targetId === targetItemId) {
            // connection is pointing to the correct target
            if (conn.description !== description) {
                return updateConnection(http, store, buildConnection(conn.id, item.id, conn.typeId, conn.targetId, conn.ruleId, description));
            }
        } else {
            // connection must be deleted and a new one created
            return deleteConnection(http, store, conn.id).pipe(
                concatMap(() => createConnection(http, store, buildConnection(undefined, item.id, connectionRule.connectionTypeId,
                    targetItemId, connectionRule.id, description))),
            );
        }
    } else {
        return createConnection(http, store, buildConnection(undefined, item.id, connectionRule.connectionTypeId,
            targetItemId, connectionRule.id, description));
    }
    return null;
};

const buildConnection = (id: string, upperItemId: string, typeId: string, lowerItemId: string, ruleId: string,
                         description: string): Connection => ({
    id,
    upperItemId,
    typeId,
    lowerItemId,
    ruleId,
    description,
});
