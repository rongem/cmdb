import { HttpClient } from '@angular/common/http';
import { take, map, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as ErrorActions from '../../store/error-handling/error.actions';

import { ATTRIBUTES, ATTRIBUTETYPE, CORRESPONDINGVALUESOFTYPE, ITEMTYPEATTRIBUTEGROUPMAPPING, GROUP,
    ITEMTYPE, COUNTATTRIBUTES, CONNECTIONRULE, CONNECTIONS, COUNT, USERS, SEARCHTEXT, USER,
    CONVERTTOITEMTYPE, ATTRIBUTEGROUP, CONNECTIONTYPE } from '../../rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ItemTypeAttributeGroupMapping } from '../../objects/meta-data/item-type-attribute-group-mapping.model';
import { UserInfo } from '../../objects/item-data/user-info.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { IRestAttribute } from '../../rest-api/item-data/rest-attribute.model';
import { IRestAttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { IRestUserInfo } from '../../rest-api/item-data/rest-user-info.model';
import { Action, Store } from '@ngrx/store';
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

export function getAttributesForAttributeType(http: HttpClient, typeId: string) {
    return http.get<IRestAttribute[]>(getUrl(ATTRIBUTETYPE + typeId + ATTRIBUTES)).pipe(
        take(1),
        map(attributes => attributes.map(a => new ItemAttribute(a))),
    );
}

export function getAttributeTypesForCorrespondingValuesOfType(http: HttpClient, typeId: string) {
    return http.get<IRestAttributeType[]>(getUrl(ATTRIBUTETYPE + CORRESPONDINGVALUESOFTYPE + typeId)).pipe(
        take(1),
        map(types => types.map(t => new AttributeType(t))),
    );
}

export function countAttributesForMapping(http: HttpClient, itemTypeAttributeGroupMapping: ItemTypeAttributeGroupMapping) {
    return http.get<number>(getUrl(ITEMTYPEATTRIBUTEGROUPMAPPING + GROUP +
        itemTypeAttributeGroupMapping.attributeGroupId + '/' + ITEMTYPE +
        itemTypeAttributeGroupMapping.itemTypeId + COUNTATTRIBUTES)).pipe(take(1));
}

export function countConnectionsForConnectionRule(http: HttpClient, ruleId: string) {
    return http.get<number>(getUrl(CONNECTIONRULE + ruleId.toString() + CONNECTIONS + COUNT)).pipe(take(1));
}

export function searchUsers(http: HttpClient, searchText: string) {
    return http.get<IRestUserInfo[]>(getUrl(USERS + '/' + SEARCHTEXT + encodeURI(searchText))).pipe(
        take(1),
        map(infos => infos.map(i => new UserInfo(i))),
    );
}

export function getUsers(http: HttpClient) {
    return http.get<IRestUserInfo[]>(getUrl(USERS)).pipe(
        take(1),
        map((result: IRestUserInfo[]) => result.map(u => new UserInfo(u)))
    );
}

export function createUser(http: HttpClient, store: Store, user: UserInfo, passphrase?: string): Observable<UserInfo> {
    return post<IRestUserInfo>(http, USER, {
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
}

export function updateUser(http: HttpClient, store: Store, user: UserInfo, passphrase?: string): Observable<UserInfo> {
    return put<IRestUserInfo>(http, USER, {
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
}

export function deleteUser(http: HttpClient, store: Store, user: UserInfo, withResponsibilities: boolean): Observable<UserInfo> {
    return del<IRestUserInfo>(http, USER + user.accountName.replace('\\', '/') + '/' + user.role + '/' + withResponsibilities).pipe(
        map(restUser => new UserInfo(restUser)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

const getRestAttributeGroup = (attributeGroup: AttributeGroup) => ( {
        id: attributeGroup.id,
        name: attributeGroup.name,
    }
);

export function createAttributeGroup(http: HttpClient, store: Store, attributeGroup: AttributeGroup): Observable<AttributeGroup> {
    return post<IRestAttributeGroup>(http, ATTRIBUTEGROUP, getRestAttributeGroup(attributeGroup)).pipe(
        map(restAttributeGroup => new AttributeGroup(restAttributeGroup)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function updateAttributeGroup(http: HttpClient, store: Store, attributeGroup: AttributeGroup): Observable<AttributeGroup> {
    return put<IRestAttributeGroup>(http, ATTRIBUTEGROUP + attributeGroup.id, getRestAttributeGroup(attributeGroup)).pipe(
        map(restAttributeGroup => new AttributeGroup(restAttributeGroup)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function deleteAttributeGroup(http: HttpClient, store: Store, attributeGroupId: string): Observable<AttributeGroup> {
    return del<IRestAttributeGroup>(http, ATTRIBUTEGROUP + attributeGroupId).pipe(
        map(restAttributeGroup => new AttributeGroup(restAttributeGroup)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

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
}

interface IConversionResult {
    itemType: ItemType;
    items: ConfigurationItem[];
    connections: Connection[];
    deletedAttributeType: AttributeType;
}

export function convertAttributeTypeToItemType(http: HttpClient, store: Store, attributeTypeId: string, newItemTypeName: string, colorCode: string,
                                               connectionTypeId: string, position: 'above' | 'below',
                                               attributeTypesToTransfer: AttributeType[]): Observable<IConversionResult> {
    return http.request<IRestConversionResult>('MOVE', ATTRIBUTETYPE + attributeTypeId + CONVERTTOITEMTYPE, {
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
}

export function createAttributeType(http: HttpClient, store: Store, attributeType: AttributeType): Observable<AttributeType> {
    return post<IRestAttributeType>(http, ATTRIBUTETYPE, getRestAttributeType(attributeType)).pipe(
        map(restAttributeType => new AttributeType(restAttributeType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function updateAttributeType(http: HttpClient, store: Store, attributeType: AttributeType): Observable<AttributeType> {
    return put<IRestAttributeType>(http, ATTRIBUTETYPE + attributeType.id, getRestAttributeType(attributeType)).pipe(
        map(restAttributeType => new AttributeType(restAttributeType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function deleteAttributeType(http: HttpClient, store: Store, attributeTypeId: string): Observable<AttributeType> {
    return del<IRestAttributeType>(http, ATTRIBUTETYPE + attributeTypeId).pipe(
        map(restAttributeType => new AttributeType(restAttributeType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

const getRestConnectionType = (connectionType: ConnectionType) => ({
    id: connectionType.id,
    name: connectionType.name,
    reverseName: connectionType.reverseName,
});

export function createConnectionType(http: HttpClient, store: Store, connectionType: ConnectionType): Observable<ConnectionType> {
    return post<IRestConnectionType>(http, CONNECTIONTYPE, getRestConnectionType(connectionType)).pipe(
        map(restConnectionType => new ConnectionType(restConnectionType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function updateConnectionType(http: HttpClient, store: Store, connectionType: ConnectionType): Observable<ConnectionType> {
    return put<IRestConnectionType>(http, CONNECTIONTYPE + connectionType.id, getRestConnectionType(connectionType)).pipe(
        map(restConnectionType => new ConnectionType(restConnectionType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function deleteConnectionType(http: HttpClient, store: Store, connectionTypeId: string): Observable<ConnectionType> {
    return del<IRestConnectionType>(http, CONNECTIONTYPE + connectionTypeId).pipe(
        map(restConnectionType => new ConnectionType(restConnectionType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

const getRestConnectionRule = (connectionRule: ConnectionRule) => ({
    id: connectionRule.id,
    connectionTypeId: connectionRule.connectionTypeId,
    lowerItemTypeId: connectionRule.lowerItemTypeId,
    upperItemTypeId: connectionRule.upperItemTypeId,
    maxConnectionsToLower: connectionRule.maxConnectionsToLower,
    maxConnectionsToUpper: connectionRule.maxConnectionsToUpper,
    validationExpression: connectionRule.validationExpression,
});

export function createConnectionRule(http: HttpClient, store: Store, connectionRule: ConnectionRule): Observable<ConnectionRule> {
    return post<IRestConnectionRule>(http, CONNECTIONRULE, getRestConnectionRule(connectionRule)).pipe(
        map(restConnectionRule => new ConnectionRule(restConnectionRule)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function updateConnectionRule(http: HttpClient, store: Store, connectionRule: ConnectionRule): Observable<ConnectionRule> {
    return put<IRestConnectionRule>(http, CONNECTIONRULE + connectionRule.id, getRestConnectionRule(connectionRule)).pipe(
        map(restConnectionRule => new ConnectionRule(restConnectionRule)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function deleteConnectionRule(http: HttpClient, store: Store, connectionRuleId: string): Observable<ConnectionRule> {
    return del<IRestConnectionRule>(http, CONNECTIONRULE + connectionRuleId).pipe(
        map(restConnectionRule => new ConnectionRule(restConnectionRule)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

const getRestItemType = (itemType: ItemType) => ({
    id: itemType.id,
    name: itemType.name,
    backColor: itemType.backColor,
    attributeGroups: itemType.attributeGroups,
});

export function createItemType(http: HttpClient, store: Store, itemType: ItemType): Observable<ItemType> {
    return post<IRestItemType>(http, ITEMTYPE, getRestItemType(itemType)).pipe(
        map(restItemType => new ItemType(restItemType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function updateItemType(http: HttpClient, store: Store, itemType: ItemType): Observable<ItemType> {
    return put<IRestItemType>(http, ITEMTYPE + itemType.id, getRestItemType(itemType)).pipe(
        map(restItemType => new ItemType(restItemType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}

export function deleteItemType(http: HttpClient, store: Store, itemTypeId: string): Observable<ItemType> {
    return del<IRestItemType>(http, ITEMTYPE + itemTypeId).pipe(
        map(restItemType => new ItemType(restItemType)),
        catchError(error => {
            store?.dispatch(ErrorActions.error({error, fatal: false}));
            return of(null);
        })
    );
}
