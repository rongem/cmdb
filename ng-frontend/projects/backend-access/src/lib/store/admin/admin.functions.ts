/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, take } from 'rxjs';

import * as ErrorActions from '../../store/error-handling/error.actions';

import { ATTRIBUTES, ATTRIBUTETYPE, CORRESPONDINGVALUESOFTYPE,
    ITEMTYPE, COUNTATTRIBUTES, CONNECTIONRULE, CONNECTIONS, COUNT, USERS, SEARCHTEXT, USER,
    CONVERTTOITEMTYPE, ATTRIBUTEGROUP, CONNECTIONTYPE } from '../../rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { UserInfo } from '../../objects/item-data/user-info.model';
import { IRestAttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { IRestDeletedUser, IRestUserInfo } from '../../rest-api/item-data/rest-user-info.model';
import { Store } from '@ngrx/store';
import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { ConnectionType } from '../../objects/meta-data/connection-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { ItemType } from '../../objects/meta-data/item-type.model';
import { IRestAttributeGroup } from '../../rest-api/meta-data/attribute-group.model';
import { IRestItemType } from '../../rest-api/meta-data/item-type.model';
import { IRestItem } from '../../rest-api/item-data/rest-item.model';
import { IRestConnection } from '../../rest-api/item-data/rest-connection.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { Connection } from '../../objects/item-data/connection.model';
import { IRestConnectionRule } from '../../rest-api/meta-data/connection-rule.model';
import { IRestConnectionType } from '../../rest-api/meta-data/connection-type.model';

export const getAttributesCountForAttributeType = (http: HttpClient, typeId: string) =>
    http.get<number>(getUrl(ATTRIBUTETYPE + typeId + ATTRIBUTES + COUNT)).pipe(take(1));

export const getAttributeTypesForCorrespondingValuesOfType = (http: HttpClient, typeId: string) =>
    http.get<IRestAttributeType[]>(getUrl(ATTRIBUTETYPE + typeId + CORRESPONDINGVALUESOFTYPE)).pipe(
        take(1),
        map(types => types.map(t => new AttributeType(t))),
    );

export const countAttributesForMapping = (http: HttpClient, itemType: ItemType, attributeGroupId: string) =>
    http.get<number>(getUrl(ATTRIBUTEGROUP + attributeGroupId + '/' + ITEMTYPE + itemType.id + COUNTATTRIBUTES)).pipe(take(1));

export const countConnectionsForConnectionRule = (http: HttpClient, ruleId: string) =>
    http.get<number>(getUrl(CONNECTIONRULE + ruleId.toString() + CONNECTIONS + COUNT)).pipe(take(1));

export const searchUsers = (http: HttpClient, searchText: string) =>
    http.get<IRestUserInfo[]>(getUrl(USERS + '/' + SEARCHTEXT + encodeURI(searchText))).pipe(
        take(1),
        map(infos => infos.map(i => new UserInfo(i))),
    );

export const getUsers = (http: HttpClient) =>
    http.get<IRestUserInfo[]>(getUrl(USERS)).pipe(
        take(1),
        map((result: IRestUserInfo[]) => result.map(u => new UserInfo(u)))
    );

export const createUserWithoutErrorHandling = (http: HttpClient, store: Store, user: UserInfo, passphrase?: string): Observable<UserInfo> =>
    post<IRestUserInfo>(http, USER, {
            accountName: user.accountName,
            role: user.role,
            passphrase
        }
    ).pipe(
        map(restUser => new UserInfo(restUser)),
    );

export const createUser = (http: HttpClient, store: Store, user: UserInfo, passphrase?: string): Observable<UserInfo> =>
    post<IRestUserInfo>(http, USER, {
            accountName: user.accountName,
            role: user.role,
            passphrase
        }
    ).pipe(
        map(restUser => new UserInfo(restUser)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const updateUserWithoutErrorHandling = (http: HttpClient, store: Store, user: UserInfo, passphrase?: string): Observable<UserInfo> =>
    put<IRestUserInfo>(http, USER, {
        accountName: user.accountName,
        role: user.role,
        passphrase
     }).pipe(
        map(restUser => new UserInfo(restUser)),
    );

export const updateUser = (http: HttpClient, store: Store, user: UserInfo, passphrase?: string): Observable<UserInfo> =>
    put<IRestUserInfo>(http, USER, {
        accountName: user.accountName,
        role: user.role,
        passphrase
     }).pipe(
        map(restUser => new UserInfo(restUser)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const deleteUser = (http: HttpClient, store: Store, user: UserInfo, withResponsibilities: boolean): Observable<UserInfo> =>
    del<IRestDeletedUser>(http, USER + user.accountName.replace('\\', '/') + '/' + withResponsibilities).pipe(
        map(restUser => restUser.deleted ? new UserInfo(restUser.user) : new UserInfo()),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );


const getRestAttributeGroup = (attributeGroup: AttributeGroup) => ( {
        id: attributeGroup.id,
        name: attributeGroup.name,
    }
);

export const createAttributeGroup = (http: HttpClient, store: Store, attributeGroup: AttributeGroup): Observable<AttributeGroup> =>
    post<IRestAttributeGroup>(http, ATTRIBUTEGROUP, getRestAttributeGroup(attributeGroup)).pipe(
        map(restAttributeGroup => new AttributeGroup(restAttributeGroup)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const updateAttributeGroup = (http: HttpClient, store: Store, attributeGroup: AttributeGroup): Observable<AttributeGroup> =>
    put<IRestAttributeGroup>(http, ATTRIBUTEGROUP + attributeGroup.id, getRestAttributeGroup(attributeGroup)).pipe(
        map(restAttributeGroup => new AttributeGroup(restAttributeGroup)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const deleteAttributeGroup = (http: HttpClient, store: Store, attributeGroupId: string): Observable<AttributeGroup> =>
    del<IRestAttributeGroup>(http, ATTRIBUTEGROUP + attributeGroupId).pipe(
        map(restAttributeGroup => new AttributeGroup(restAttributeGroup)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

const getRestAttributeType = (attributeType: AttributeType) => ({
    id: attributeType.id,
    name: attributeType.name,
    attributeGroupId: attributeType.attributeGroupId,
    attributeGroupName: attributeType.attributeGroupName,
    validationExpression: attributeType.validationExpression,
});

interface IRestConversionResult {
    itemType: IRestItemType;
    items: IRestItem[];
    connections: IRestConnection[];
    deletedAttributeType: IRestAttributeType;
};

interface IConversionResult {
    itemType: ItemType;
    items: ConfigurationItem[];
    connections: Connection[];
    deletedAttributeType: AttributeType;
};

export const convertAttributeTypeToItemType = (http: HttpClient, store: Store, attributeTypeId: string, newItemTypeName: string, colorCode: string,
                                               connectionTypeId: string, position: 'above' | 'below',
                                               attributeTypesToTransfer: AttributeType[]): Observable<IConversionResult> =>
    http.post<IRestConversionResult>(ATTRIBUTETYPE + attributeTypeId + CONVERTTOITEMTYPE, {
        body: {
            newItemTypeName,
            colorCode,
            connectionTypeId,
            position,
            attributeTypesToTransfer: attributeTypesToTransfer.map(a => getRestAttributeType(a)),
        },
        headers: getHeader()
    }).pipe(
        take(1),
        map(result => ({
            itemType: new ItemType(result.itemType),
            items: result.items.map(i => new ConfigurationItem(i)),
            connections: result.connections.map(c => new Connection(c)),
            deletedAttributeType: new AttributeType(result.deletedAttributeType),
        }) as IConversionResult),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: true}));
            return of(null);
        })
    );


export const createAttributeType = (http: HttpClient, store: Store, attributeType: AttributeType): Observable<AttributeType> =>
    post<IRestAttributeType>(http, ATTRIBUTETYPE, getRestAttributeType(attributeType)).pipe(
        map(restAttributeType => new AttributeType(restAttributeType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );


export const updateAttributeType = (http: HttpClient, store: Store, attributeType: AttributeType): Observable<AttributeType> =>
    put<IRestAttributeType>(http, ATTRIBUTETYPE + attributeType.id, getRestAttributeType(attributeType)).pipe(
        map(restAttributeType => new AttributeType(restAttributeType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const deleteAttributeType = (http: HttpClient, store: Store, attributeTypeId: string): Observable<AttributeType> =>
    del<IRestAttributeType>(http, ATTRIBUTETYPE + attributeTypeId).pipe(
        map(restAttributeType => new AttributeType(restAttributeType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

const getRestConnectionType = (connectionType: ConnectionType) => ({
    id: connectionType.id,
    name: connectionType.name,
    reverseName: connectionType.reverseName,
});

export const createConnectionType = (http: HttpClient, store: Store, connectionType: ConnectionType): Observable<ConnectionType> =>
    post<IRestConnectionType>(http, CONNECTIONTYPE, getRestConnectionType(connectionType)).pipe(
        map(restConnectionType => new ConnectionType(restConnectionType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const updateConnectionType = (http: HttpClient, store: Store, connectionType: ConnectionType): Observable<ConnectionType> =>
    put<IRestConnectionType>(http, CONNECTIONTYPE + connectionType.id, getRestConnectionType(connectionType)).pipe(
        map(restConnectionType => new ConnectionType(restConnectionType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );


export const deleteConnectionType = (http: HttpClient, store: Store, connectionTypeId: string): Observable<ConnectionType> =>
    del<IRestConnectionType>(http, CONNECTIONTYPE + connectionTypeId).pipe(
        map(restConnectionType => new ConnectionType(restConnectionType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

const getRestConnectionRule = (connectionRule: ConnectionRule) => ({
    id: connectionRule.id,
    connectionTypeId: connectionRule.connectionTypeId,
    lowerItemTypeId: connectionRule.lowerItemTypeId,
    upperItemTypeId: connectionRule.upperItemTypeId,
    maxConnectionsToLower: connectionRule.maxConnectionsToLower,
    maxConnectionsToUpper: connectionRule.maxConnectionsToUpper,
    validationExpression: connectionRule.validationExpression,
});

export const createConnectionRule = (http: HttpClient, store: Store, connectionRule: ConnectionRule): Observable<ConnectionRule> =>
    post<IRestConnectionRule>(http, CONNECTIONRULE, getRestConnectionRule(connectionRule)).pipe(
        map(restConnectionRule => new ConnectionRule(restConnectionRule)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const updateConnectionRule = (http: HttpClient, store: Store, connectionRule: ConnectionRule): Observable<ConnectionRule> =>
    put<IRestConnectionRule>(http, CONNECTIONRULE + connectionRule.id, getRestConnectionRule(connectionRule)).pipe(
        map(restConnectionRule => new ConnectionRule(restConnectionRule)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );


export const deleteConnectionRule = (http: HttpClient, store: Store, connectionRuleId: string): Observable<ConnectionRule> =>
    del<IRestConnectionRule>(http, CONNECTIONRULE + connectionRuleId).pipe(
        map(restConnectionRule => new ConnectionRule(restConnectionRule)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

const getRestItemType = (itemType: ItemType) => ({
    id: itemType.id,
    name: itemType.name,
    backColor: itemType.backColor,
    attributeGroups: itemType.attributeGroups,
});

export const createItemType = (http: HttpClient, store: Store, itemType: ItemType): Observable<ItemType> =>
    post<IRestItemType>(http, ITEMTYPE, getRestItemType(itemType)).pipe(
        map(restItemType => new ItemType(restItemType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const updateItemType = (http: HttpClient, store: Store, itemType: ItemType): Observable<ItemType> =>
    put<IRestItemType>(http, ITEMTYPE + itemType.id, getRestItemType(itemType)).pipe(
        map(restItemType => new ItemType(restItemType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );

export const deleteItemType = (http: HttpClient, store: Store, itemTypeId: string): Observable<ItemType> =>
    del<IRestItemType>(http, ITEMTYPE + itemTypeId).pipe(
        map(restItemType => new ItemType(restItemType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
