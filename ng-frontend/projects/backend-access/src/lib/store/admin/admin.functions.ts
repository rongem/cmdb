import { HttpClient } from '@angular/common/http';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ATTRIBUTES, ATTRIBUTETYPE, CORRESPONDINGVALUESOFTYPE, ITEMTYPEATTRIBUTEGROUPMAPPING, GROUP,
    ITEMTYPE, COUNTATTRIBUTES, CONNECTIONRULE, CONNECTIONS, COUNT, USERS, SEARCHTEXT, USER,
    CONVERTTOITEMTYPE, ATTRIBUTEGROUP, CONNECTIONTYPE } from '../../rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ItemTypeAttributeGroupMapping } from '../../objects/meta-data/item-type-attribute-group-mapping.model';
import { UserInfo } from '../../objects/item-data/user-info.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { RestAttribute } from '../../rest-api/item-data/rest-attribute.model';
import { RestAttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { RestUserInfo } from '../../rest-api/item-data/rest-user-info.model';
import { Action } from '@ngrx/store';
import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { ConnectionType } from '../../objects/meta-data/connection-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { ItemType } from '../../objects/meta-data/item-type.model';

export function getAttributesForAttributeType(http: HttpClient, typeId: string) {
    return http.get<RestAttribute[]>(getUrl(ATTRIBUTETYPE + typeId + ATTRIBUTES), {headers: getHeader()}).pipe(
        take(1),
        map(attributes => attributes.map(a => new ItemAttribute(a))),
    );
}

export function getAttributeTypesForCorrespondingValuesOfType(http: HttpClient, typeId: string) {
    return http.get<RestAttributeType[]>(getUrl(ATTRIBUTETYPE + CORRESPONDINGVALUESOFTYPE + typeId), {headers: getHeader()}).pipe(
        take(1),
        map(types => types.map(t => new AttributeType(t))),
    );
}

export function countAttributesForMapping(http: HttpClient, itemTypeAttributeGroupMapping: ItemTypeAttributeGroupMapping) {
    return http.get<number>(getUrl(ITEMTYPEATTRIBUTEGROUPMAPPING + GROUP +
        itemTypeAttributeGroupMapping.attributeGroupId + '/' + ITEMTYPE +
        itemTypeAttributeGroupMapping.itemTypeId + COUNTATTRIBUTES), {headers: getHeader()}).pipe(take(1));
}

export function countConnectionsForConnectionRule(http: HttpClient, ruleId: string) {
    return http.get<number>(getUrl(CONNECTIONRULE + ruleId.toString() + CONNECTIONS + COUNT), {headers: getHeader()}).pipe(take(1));
}

export function searchUsers(http: HttpClient, searchText: string) {
    return http.get<RestUserInfo[]>(getUrl(USERS + '/' + SEARCHTEXT + encodeURI(searchText)), {headers: getHeader()}).pipe(
        take(1),
        map(infos => infos.map(i => new UserInfo(i))),
    );
}

export function getUsers(http: HttpClient) {
    return http.get<RestUserInfo[]>(getUrl(USERS)).pipe(
        map((result: RestUserInfo[]) => result.map(u => new UserInfo(u)))
    );
}

export function createUser(http: HttpClient, userInfo: UserInfo, successAction?: Action) {
    return post(http, USER, {
            username: userInfo.accountName,
            role: userInfo.role,
        },
        successAction
    );
}

export function toggleUser(http: HttpClient, userToken: string, successAction?: Action) {
    return put(http, USER, { userToken }, successAction);
}

export function deleteUser(http: HttpClient, user: UserInfo, withResponsibilities: boolean, successAction?: Action) {
    return del(http, USER + user.accountName.replace('\\', '/') + '/' + user.role + '/' + withResponsibilities, successAction);
}

const getRestAttributeGroup = (attributeGroup: AttributeGroup) => ( {
        id: attributeGroup.id,
        name: attributeGroup.name,
    }
);

export function createAttributeGroup(http: HttpClient, attributeGroup: AttributeGroup, successAction?: Action) {
    return post(http, ATTRIBUTEGROUP, getRestAttributeGroup(attributeGroup), successAction);
}

export function updateAttributeGroup(http: HttpClient, attributeGroup: AttributeGroup, successAction?: Action) {
    return put(http, ATTRIBUTEGROUP + attributeGroup.id, getRestAttributeGroup(attributeGroup), successAction);
}

const getRestAttributeType = (attributeType: AttributeType) => ({
    id: attributeType.id,
    name: attributeType.name,
    attributeGroupId: attributeType.attributeGroupId,
    attributeGroupName: attributeType.attributeGroupName,
    validationExpression: attributeType.validationExpression,
});

export function convertAttributeTypeToItemType(http: HttpClient, attributeTypeId: string, newItemTypeName: string, colorCode: string,
                                               connectionTypeId: string, position: 'above' | 'below',
                                               attributeTypesToTransfer: AttributeType[], successAction?: Action) {
    return http.request('MOVE', ATTRIBUTETYPE + attributeTypeId + CONVERTTOITEMTYPE, {
        body: {
            newItemTypeName,
            colorCode,
            connectionTypeId,
            position,
            attributeTypesToTransfer: attributeTypesToTransfer.map(a => getRestAttributeType(a)),
        },
        headers: getHeader()
    }).pipe(switchMap(() => of(successAction)));
}

export function deleteAttributeGroup(http: HttpClient, attributeGroupId: string, successAction?: Action) {
    return del(http, ATTRIBUTEGROUP + attributeGroupId, successAction);
}

export function createAttributeType(http: HttpClient, attributeType: AttributeType, successAction?: Action) {
    return post(http, ATTRIBUTETYPE, getRestAttributeType(attributeType), successAction);
}

export function updateAttributeType(http: HttpClient, attributeType: AttributeType, successAction?: Action) {
    return put(http, ATTRIBUTETYPE + attributeType.id, getRestAttributeType(attributeType), successAction);
}

export function deleteAttributeType(http: HttpClient, attributeTypeId: string, successAction?: Action) {
    return del(http, ATTRIBUTETYPE + attributeTypeId, successAction);
}

const getRestConnectionType = (connectionType: ConnectionType) => ({
    id: connectionType.id,
    name: connectionType.name,
    reverseName: connectionType.reverseName,
});

export function createConnectionType(http: HttpClient, connectionType: ConnectionType, successAction?: Action) {
    return post(http, CONNECTIONTYPE, getRestConnectionType(connectionType), successAction);
}

export function updateConnectionType(http: HttpClient, connectionType: ConnectionType, successAction?: Action) {
    return put(http, CONNECTIONTYPE + connectionType.id, getRestConnectionType(connectionType), successAction);
}

export function deleteConnectionType(http: HttpClient, connectionTypeId: string, successAction?: Action) {
    return del(http, CONNECTIONTYPE + connectionTypeId, successAction);
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

export function createConnectionRule(http: HttpClient, connectionRule: ConnectionRule, successAction?: Action) {
    return post(http, CONNECTIONRULE, getRestConnectionRule(connectionRule), successAction);
}

export function updateConnectionRule(http: HttpClient, connectionRule: ConnectionRule, successAction?: Action) {
    return put(http, CONNECTIONRULE + connectionRule.id, getRestConnectionRule(connectionRule), successAction);
}

export function deleteConnectionRule(http: HttpClient, connectionRuleId: string, successAction?: Action) {
    return del(http, CONNECTIONRULE + connectionRuleId, successAction);
}

const getRestItemType = (itemType: ItemType) => ({
    id: itemType.id,
    name: itemType.name,
    backColor: itemType.backColor,
    attributeGroups: itemType.attributeGroups,
});

export function createItemType(http: HttpClient, itemType: ItemType, successAction?: Action) {
    return post(http, ITEMTYPE, getRestItemType(itemType), successAction);
}

export function updateItemType(http: HttpClient, itemType: ItemType, successAction?: Action) {
    return put(http, ITEMTYPE + itemType.id, getRestItemType(itemType), successAction);
}

export function deleteItemType(http: HttpClient, itemTypeId: string, successAction?: Action) {
    return del(http, ITEMTYPE + itemTypeId, successAction);
}

export function createItemTypeAttributeGroupMapping(http: HttpClient, mapping: ItemTypeAttributeGroupMapping, successAction?: Action) {
    return post(http, ITEMTYPEATTRIBUTEGROUPMAPPING, { ...mapping }, successAction);
}

export function deleteItemTypeAttributeGroupMapping(http: HttpClient, mapping: ItemTypeAttributeGroupMapping, successAction?: Action) {
    return del(http, ITEMTYPEATTRIBUTEGROUPMAPPING + GROUP + mapping.attributeGroupId + '/' + ITEMTYPE + mapping.itemTypeId, successAction);
}
