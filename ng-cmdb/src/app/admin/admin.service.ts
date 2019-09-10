import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { UserInfo } from '../shared/objects/user-info.model';
import { AdminServiceModule } from './admin-services.module';

const ATTRIBUTETYPE = 'AttributeType/';
const ATTRIBUTETYPECORRESPONDINGVALUES = 'AttributeTypes/CorrespondingValuesOfType/';
const ATTRIBUTES = '/Attributes';
const CONFIGURATIONITEMSBYTYPE = 'ConfigurationItems/ByType';
const ITEMTYPEATTRIBUTEGROUPMAPPING = 'ItemTypeAttributeGroupMapping/group/';
const CONNECTIONRULE = 'ConnectionRule/';
const CONNECTIONSCOUNT = '/Connections/Count';
const USERS = 'Users/';

@Injectable({providedIn: AdminServiceModule})
export class AdminService {
    constructor(private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    getAttributesForAttributeType(attributeType: AttributeType) {
        return this.http.get<ItemAttribute[]>(getUrl(ATTRIBUTETYPE + attributeType.TypeId + ATTRIBUTES));
    }

    getAttributeTypesForCorrespondingValuesOfType(attributeType: AttributeType) {
        return this.http.get<AttributeType[]>(getUrl(ATTRIBUTETYPECORRESPONDINGVALUES + attributeType.TypeId));
    }

    getItemsForItemType(itemType: ItemType) {
        return this.http.post<ConfigurationItem[]>(getUrl(CONFIGURATIONITEMSBYTYPE), {
            typeIds: [ itemType.TypeId ] }, { headers: getHeader() });
    }

    // canDeleteMapping(itemTypeAttributeGroupMapping: ItemTypeAttributeGroupMapping) {
    //     return this.http.get<boolean>(getUrl(ITEMTYPEATTRIBUTEGROUPMAPPING +
    //         itemTypeAttributeGroupMapping.GroupId + '/itemType/' +
    //         itemTypeAttributeGroupMapping.ItemTypeId + '/CanDelete'));
    // }

    countMapping(itemTypeAttributeGroupMapping: ItemTypeAttributeGroupMapping) {
        return this.http.get<number>(getUrl(ITEMTYPEATTRIBUTEGROUPMAPPING +
            itemTypeAttributeGroupMapping.GroupId + '/itemType/' +
            itemTypeAttributeGroupMapping.ItemTypeId + '/CountAttributes'));
    }

    countConnectionsForConnectionRule(ruleId: Guid) {
        return this.http.get<number>(getUrl(CONNECTIONRULE + ruleId.toString() + CONNECTIONSCOUNT));
    }

    searchUsers(searchText: string) {
        return this.http.get<UserInfo[]>(getUrl(USERS + 'search/' + encodeURI(searchText)));
    }
}
