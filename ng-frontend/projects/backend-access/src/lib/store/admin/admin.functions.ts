import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { ATTRIBUTES, ATTRIBUTETYPE, CORRESPONDINGVALUESOFTYPE, ITEMTYPEATTRIBUTEGROUPMAPPING, GROUP,
    ITEMTYPE, COUNTATTRIBUTES, CONNECTIONRULE, CONNECTIONS, COUNT, USERS, SEARCHTEXT } from '../constants';
import { getUrl, getHeader } from '../../functions';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ItemTypeAttributeGroupMapping } from '../../objects/meta-data/item-type-attribute-group-mapping.model';
import { UserInfo } from '../../objects/item-data/user-info.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { RestItemAttribute } from '../../rest-api/item-data/item-attribute.model';
import { RestAttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { RestUserInfo } from '../../rest-api/item-data/user-info.model';

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
