import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Guid, AttributeType, ItemAttribute, ItemType, ConfigurationItem, ItemTypeAttributeGroupMapping, UserInfo} from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

import { getUrl, getHeader } from 'projects/cmdb/src/app/shared/store/functions';
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
