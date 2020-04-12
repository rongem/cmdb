import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Guid, AttributeType, ItemAttribute, ItemType, ConfigurationItem, ItemTypeAttributeGroupMapping, UserInfo,
    Functions, StoreConstants } from 'backend-access';

import { AdminServiceModule } from './admin-services.module';

@Injectable({providedIn: AdminServiceModule})
export class AdminService {
    constructor(private http: HttpClient) {}

    getAttributesForAttributeType(attributeType: AttributeType) {
        return this.http.get<ItemAttribute[]>(
            Functions.getUrl(StoreConstants.ATTRIBUTETYPE + attributeType.TypeId + StoreConstants.ATTRIBUTES));
    }

    getAttributeTypesForCorrespondingValuesOfType(attributeType: AttributeType) {
        return this.http.get<AttributeType[]>(
            Functions.getUrl(StoreConstants.ATTRIBUTETYPE + StoreConstants.CORRESPONDINGVALUESOFTYPE + attributeType.TypeId));
    }

    getItemsForItemType(itemType: ItemType) {
        return this.http.post<ConfigurationItem[]>(Functions.getUrl(StoreConstants.CONFIGURATIONITEMS + StoreConstants.BYTYPE), {
            typeIds: [ itemType.TypeId ] }, { headers: Functions.getHeader() });
    }

    countMapping(itemTypeAttributeGroupMapping: ItemTypeAttributeGroupMapping) {
        return this.http.get<number>(Functions.getUrl(StoreConstants.ITEMTYPEATTRIBUTEGROUPMAPPING + StoreConstants.GROUP +
            itemTypeAttributeGroupMapping.GroupId + '/' + StoreConstants.ITEMTYPE +
            itemTypeAttributeGroupMapping.ItemTypeId + StoreConstants.COUNTATTRIBUTES));
    }

    countConnectionsForConnectionRule(ruleId: Guid) {
        return this.http.get<number>(
            Functions.getUrl(StoreConstants.CONNECTIONRULE + ruleId.toString() + StoreConstants.CONNECTIONS + StoreConstants.COUNT));
    }

    searchUsers(searchText: string) {
        return this.http.get<UserInfo[]>(Functions.getUrl(StoreConstants.USERS + '/' + StoreConstants.SEARCHTEXT + encodeURI(searchText)));
    }
}
