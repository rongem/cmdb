import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { ATTRIBUTES, ATTRIBUTETYPE, CORRESPONDINGVALUESOFTYPE, ITEMTYPEATTRIBUTEGROUPMAPPING, GROUP,
    ITEMTYPE, COUNTATTRIBUTES, CONNECTIONRULE, CONNECTIONS, COUNT, USERS, SEARCHTEXT, USER,
    CONVERTTOITEMTYPE, ATTRIBUTEGROUP, CONNECTIONTYPE } from '../../rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ItemTypeAttributeGroupMapping } from '../../objects/meta-data/item-type-attribute-group-mapping.model';
import { UserInfo } from '../../objects/item-data/user-info.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { RestItemAttribute } from '../../rest-api/item-data/item-attribute.model';
import { RestAttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { RestUserInfo } from '../../rest-api/item-data/user-info.model';
import { RestUserRoleMapping } from '../../rest-api/user-role-mapping.model';
import { UserRoleMapping } from '../../objects/meta-data/user-role-mapping.model';
import { Action } from '@ngrx/store';
import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { RestAttributeGroup } from '../../rest-api/meta-data/attribute-group.model';
import { ConnectionType } from '../../objects/meta-data/connection-type.model';
import { RestConnectionType } from '../../rest-api/meta-data/connection-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { RestConnectionRule } from '../../rest-api/meta-data/connection-rule.model';
import { ItemType } from '../../objects/meta-data/item-type.model';
import { RestItemType } from '../../rest-api/meta-data/item-type.model';

export function getAttributesForAttributeType(http: HttpClient, typeId: string) {
    return http.get<RestItemAttribute[]>(getUrl(ATTRIBUTETYPE + typeId + ATTRIBUTES), {headers: getHeader()}).pipe(
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
    return http.get<RestUserRoleMapping[]>(getUrl(USERS)).pipe(
        map((result: RestUserRoleMapping[]) => result.map(u => new UserRoleMapping(u.Username, u.IsGroup, u.Role)))
    );
}

export function createUser(http: HttpClient, userRoleMapping: UserRoleMapping, successAction?: Action) {
    return post(http, USER,
        { userRoleMapping: {
            Username: userRoleMapping.username,
            Role: userRoleMapping.role,
            IsGroup: userRoleMapping.isGroup,
        }},
        successAction
    );
}

export function toggleUser(http: HttpClient, userToken: string, successAction?: Action) {
    return put(http, USER, { userToken }, successAction);
}

export function deleteUser(http: HttpClient, user: UserRoleMapping, withResponsibilities: boolean, successAction?: Action) {
    return del(http, USER + user.username.replace('\\', '/') + '/' + user.role + '/' + withResponsibilities, successAction);
}

const getRestAttributeGroup = (attributeGroup: AttributeGroup): RestAttributeGroup => ({
    GroupId: attributeGroup.id,
    GroupName: attributeGroup.name,
});

export function createAttributeGroup(http: HttpClient, attributeGroup: AttributeGroup, successAction?: Action) {
    return post(http, ATTRIBUTEGROUP, { attributeGroup: getRestAttributeGroup(attributeGroup) }, successAction);
}

export function updateAttributeGroup(http: HttpClient, attributeGroup: AttributeGroup, successAction?: Action) {
    return put(http, ATTRIBUTEGROUP + attributeGroup.id, { attributeGroup: getRestAttributeGroup(attributeGroup) }, successAction);
}

const getRestAttributeType = (attributeType: AttributeType): RestAttributeType => ({
    TypeId: attributeType.id,
    AttributeGroup: attributeType.attributeGroupId,
    TypeName: attributeType.name,
    ValidationExpression: attributeType.validationExpression,
});

export function convertAttributeTypeToItemType(http: HttpClient, attributeTypeId: string, newItemTypeName: string, colorCode: string,
                                               connectionTypeId: string, targetPosition: string, attributeTypesToTransfer: AttributeType[],
                                               successAction?: Action) {
    return put(http, ATTRIBUTETYPE + attributeTypeId + CONVERTTOITEMTYPE,
        {
            newItemTypeName,
            colorCode,
            connectionTypeId,
            position: targetPosition === 'below' ? 1 : 0,
            attributeTypesToTransfer: attributeTypesToTransfer.map(a => getRestAttributeType(a)),
        },
        successAction
    );
}

export function deleteAttributeGroup(http: HttpClient, attributeGroupId: string, successAction?: Action) {
    return del(http, ATTRIBUTEGROUP + attributeGroupId, successAction);
}

export function createAttributeType(http: HttpClient, attributeType: AttributeType, successAction?: Action) {
    return post(http, ATTRIBUTETYPE, { attributeType: getRestAttributeType(attributeType) }, successAction);
}

export function updateAttributeType(http: HttpClient, attributeType: AttributeType, successAction?: Action) {
    return put(http, ATTRIBUTETYPE + attributeType.id, { attributeType: getRestAttributeType(attributeType) }, successAction);
}

export function deleteAttributeType(http: HttpClient, attributeTypeId: string, successAction?: Action) {
    return del(http, ATTRIBUTETYPE + attributeTypeId, successAction);
}

const getRestConnectionType = (connectionType: ConnectionType): RestConnectionType => ({
    ConnTypeId: connectionType.id,
    ConnTypeName: connectionType.name,
    ConnTypeReverseName: connectionType.reverseName,
});

export function createConnectionType(http: HttpClient, connectionType: ConnectionType, successAction?: Action) {
    return post(http, CONNECTIONTYPE, { connectionType: getRestConnectionType(connectionType) }, successAction);
}

export function updateConnectionType(http: HttpClient, connectionType: ConnectionType, successAction?: Action) {
    return put(http, CONNECTIONTYPE + connectionType.id, { connectionType: getRestConnectionType(connectionType) }, successAction);
}

export function deleteConnectionType(http: HttpClient, connectionTypeId: string, successAction?: Action) {
    return del(http, CONNECTIONTYPE + connectionTypeId, successAction);
}

const getRestConnectionRule = (connectionRule: ConnectionRule): RestConnectionRule => ({
    RuleId: connectionRule.id,
    ConnType: connectionRule.connectionTypeId,
    ItemUpperType: connectionRule.upperItemTypeId,
    ItemLowerType: connectionRule.lowerItemTypeId,
    MaxConnectionsToLower: connectionRule.maxConnectionsToLower,
    MaxConnectionsToUpper: connectionRule.maxConnectionsToUpper,
    ValidationExpression: connectionRule.validationExpression,
});

export function createConnectionRule(http: HttpClient, connectionRule: ConnectionRule, successAction?: Action) {
    return post(http, CONNECTIONRULE, { connectionRule: getRestConnectionRule(connectionRule) }, successAction);
}

export function updateConnectionRule(http: HttpClient, connectionRule: ConnectionRule, successAction?: Action) {
    return put(http, CONNECTIONRULE + connectionRule.id, { connectionRule: getRestConnectionRule(connectionRule) }, successAction);
}

export function deleteConnectionRule(http: HttpClient, connectionRuleId: string, successAction?: Action) {
    return del(http, CONNECTIONRULE + connectionRuleId, successAction);
}

const getRestItemType = (itemType: ItemType): RestItemType => ({
    TypeId: itemType.id,
    TypeName: itemType.name,
    TypeBackColor: itemType.backColor,
});

export function createItemType(http: HttpClient, itemType: ItemType, successAction?: Action) {
    return post(http, ITEMTYPE, { itemType: getRestItemType(itemType) }, successAction);
}

export function updateItemType(http: HttpClient, itemType: ItemType, successAction?: Action) {
    return put(http, ITEMTYPE + itemType.id, { itemType: getRestItemType(itemType) }, successAction);
}

export function deleteItemType(http: HttpClient, itemTypeId: string, successAction?: Action) {
    return del(http, ITEMTYPE + itemTypeId, successAction);
}

export function createItemTypeAttributeGroupMapping(http: HttpClient, mapping: ItemTypeAttributeGroupMapping, successAction?: Action) {
    return post(http, ITEMTYPEATTRIBUTEGROUPMAPPING,
        { itemTypeAttributeGroupMapping: { GroupId: mapping.attributeGroupId, ItemTypeId: mapping.itemTypeId } },
        successAction
    );
}

export function deleteItemTypeAttributeGroupMapping(http: HttpClient, mapping: ItemTypeAttributeGroupMapping, successAction?: Action) {
    return del(http, ITEMTYPEATTRIBUTEGROUPMAPPING + GROUP + mapping.attributeGroupId + '/' + ITEMTYPE + mapping.itemTypeId, successAction);
}
