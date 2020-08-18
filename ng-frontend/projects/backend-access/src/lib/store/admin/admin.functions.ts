import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { ATTRIBUTES, ATTRIBUTETYPE, CORRESPONDINGVALUESOFTYPE, ITEMTYPEATTRIBUTEGROUPMAPPING, GROUP,
    ITEMTYPE, COUNTATTRIBUTES, CONNECTIONRULE, CONNECTIONS, COUNT, USERS, SEARCHTEXT, USER,
    CONVERTTOITEMTYPE, ATTRIBUTEGROUP, CONNECTIONTYPE } from '../../old-rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ItemTypeAttributeGroupMapping } from '../../objects/meta-data/item-type-attribute-group-mapping.model';
import { UserInfo } from '../../objects/item-data/user-info.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { RestItemAttribute } from '../../old-rest-api/item-data/item-attribute.model';
import { OldRestAttributeType } from '../../old-rest-api/meta-data/attribute-type.model';
import { RestUserInfo } from '../../old-rest-api/item-data/user-info.model';
import { RestUserRoleMapping } from '../../old-rest-api/user-role-mapping.model';
import { UserRoleMapping } from '../../objects/meta-data/user-role-mapping.model';
import { Action } from '@ngrx/store';
import { AttributeGroup } from '../../objects/meta-data/attribute-group.model';
import { ConnectionType } from '../../objects/meta-data/connection-type.model';
import { OldRestConnectionType } from '../../old-rest-api/meta-data/connection-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { OldRestConnectionRule } from '../../old-rest-api/meta-data/connection-rule.model';
import { ItemType } from '../../objects/meta-data/item-type.model';
import { OldRestItemType } from '../../old-rest-api/meta-data/item-type.model';
import { AppConfigService } from '../../app-config/app-config.service';

export function getAttributesForAttributeType(http: HttpClient, typeId: string) {
    return http.get<RestItemAttribute[]>(getUrl(ATTRIBUTETYPE + typeId + ATTRIBUTES), {headers: getHeader()}).pipe(
        take(1),
        map(attributes => attributes.map(a => new ItemAttribute(a))),
    );
}

export function getAttributeTypesForCorrespondingValuesOfType(http: HttpClient, typeId: string) {
    return http.get<OldRestAttributeType[]>(getUrl(ATTRIBUTETYPE + CORRESPONDINGVALUESOFTYPE + typeId), {headers: getHeader()}).pipe(
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
    return post(http, USER, AppConfigService.settings.backend.version === 1 ?
        { userRoleMapping: {
            Username: userRoleMapping.username,
            Role: userRoleMapping.role,
            IsGroup: userRoleMapping.isGroup,
        }} : {
            username: userRoleMapping.username,
            role: userRoleMapping.role,
        },
        successAction
    );
}

export function toggleUser(http: HttpClient, userToken: string, successAction?: Action) {
    return put(http, USER, { userToken }, successAction);
}

export function deleteUser(http: HttpClient, user: UserRoleMapping, withResponsibilities: boolean, successAction?: Action) {
    return del(http, USER + user.username.replace('\\', '/') + '/' + user.role + '/' + withResponsibilities, successAction);
}

const getRestAttributeGroup = (attributeGroup: AttributeGroup) => (AppConfigService.settings.backend.version === 1 ?
    {
        attributeGroup: {
            GroupId: attributeGroup.id,
            GroupName: attributeGroup.name,
        }
    } : {
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

const getOldRestAttributeType = (attributeType: AttributeType): OldRestAttributeType => ({
    TypeId: attributeType.id,
    AttributeGroup: attributeType.attributeGroupId,
    TypeName: attributeType.name,
    ValidationExpression: attributeType.validationExpression,
});

const getRestAttributeType = (attributeType: AttributeType) => (AppConfigService.settings.backend.version === 1 ?
    { attributeType: getOldRestAttributeType(attributeType) } : {
        id: attributeType.id,
        name: attributeType.name,
        attributeGroupId: attributeType.attributeGroupId,
        attributeGroupName: attributeType.attributeGroupName,
        validationExpression: attributeType.validationExpression,
    }
);

export function convertAttributeTypeToItemType(http: HttpClient, attributeTypeId: string, newItemTypeName: string, colorCode: string,
                                               connectionTypeId: string, targetPosition: string, attributeTypesToTransfer: AttributeType[],
                                               successAction?: Action) {
    return put(http, ATTRIBUTETYPE + attributeTypeId + CONVERTTOITEMTYPE,
        {
            newItemTypeName,
            colorCode,
            connectionTypeId,
            position: targetPosition === 'below' ? 1 : 0,
            attributeTypesToTransfer: attributeTypesToTransfer.map(a =>
                AppConfigService.settings.backend.version === 1 ? getOldRestAttributeType(a) : getRestAttributeType(a)),
        },
        successAction
    );
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

const getRestConnectionType = (connectionType: ConnectionType) => (
    AppConfigService.settings.backend.version === 1 ? {
        connectionType: {
            ConnTypeId: connectionType.id,
            ConnTypeName: connectionType.name,
            ConnTypeReverseName: connectionType.reverseName,
        }
    } : {
        id: connectionType.id,
        name: connectionType.name,
        reverseName: connectionType.reverseName,
    }
);

export function createConnectionType(http: HttpClient, connectionType: ConnectionType, successAction?: Action) {
    return post(http, CONNECTIONTYPE, getRestConnectionType(connectionType), successAction);
}

export function updateConnectionType(http: HttpClient, connectionType: ConnectionType, successAction?: Action) {
    return put(http, CONNECTIONTYPE + connectionType.id, getRestConnectionType(connectionType), successAction);
}

export function deleteConnectionType(http: HttpClient, connectionTypeId: string, successAction?: Action) {
    return del(http, CONNECTIONTYPE + connectionTypeId, successAction);
}

const getRestConnectionRule = (connectionRule: ConnectionRule) => (AppConfigService.settings.backend.version === 1 ? {
    connectionRule: {
        RuleId: connectionRule.id,
        ConnType: connectionRule.connectionTypeId,
        ItemUpperType: connectionRule.upperItemTypeId,
        ItemLowerType: connectionRule.lowerItemTypeId,
        MaxConnectionsToLower: connectionRule.maxConnectionsToLower,
        MaxConnectionsToUpper: connectionRule.maxConnectionsToUpper,
        ValidationExpression: connectionRule.validationExpression,
    }} : {
        id: connectionRule.id,
        connectionTypeId: connectionRule.connectionTypeId,
        lowerItemTypeId: connectionRule.lowerItemTypeId,
        upperItemTypeId: connectionRule.upperItemTypeId,
        maxConnectionsToLower: connectionRule.maxConnectionsToLower,
        maxConnectionsToUpper: connectionRule.maxConnectionsToUpper,
        validationExpression: connectionRule.validationExpression,
    }
);

export function createConnectionRule(http: HttpClient, connectionRule: ConnectionRule, successAction?: Action) {
    return post(http, CONNECTIONRULE, getRestConnectionRule(connectionRule), successAction);
}

export function updateConnectionRule(http: HttpClient, connectionRule: ConnectionRule, successAction?: Action) {
    return put(http, CONNECTIONRULE + connectionRule.id, getRestConnectionRule(connectionRule), successAction);
}

export function deleteConnectionRule(http: HttpClient, connectionRuleId: string, successAction?: Action) {
    return del(http, CONNECTIONRULE + connectionRuleId, successAction);
}

const getRestItemType = (itemType: ItemType) => (AppConfigService.settings.backend.version === 1 ? {
    itemType: {
        TypeId: itemType.id,
        TypeName: itemType.name,
        TypeBackColor: itemType.backColor,
    }} : {
        id: itemType.id,
        name: itemType.name,
        backColor: itemType.backColor,
        // attributeGroups:
    }
);

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
    return post(http, ITEMTYPEATTRIBUTEGROUPMAPPING, AppConfigService.settings.backend.version === 1 ?
        { itemTypeAttributeGroupMapping: { GroupId: mapping.attributeGroupId, ItemTypeId: mapping.itemTypeId } } : { ...mapping },
        successAction
    );
}

export function deleteItemTypeAttributeGroupMapping(http: HttpClient, mapping: ItemTypeAttributeGroupMapping, successAction?: Action) {
    return del(http, ITEMTYPEATTRIBUTEGROUPMAPPING + GROUP + mapping.attributeGroupId + '/' + ITEMTYPE + mapping.itemTypeId, successAction);
}
