import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { Guid } from 'guid-typescript';

import { ItemType } from './objects/item-type.model';
import { AttributeType } from './objects/attribute-type.model';
import { AttributeGroup } from './objects/attribute-group.model';
import { SearchContent } from '../display/search/search-content.model';
import { ConfigurationItem } from './objects/configuration-item.model';
import { ItemAttribute } from './objects/item-attribute.model';
import { UserInfo } from './objects/user-info.model';
import { Connection } from './objects/connection.model';
import { ConnectionType } from './objects/connection-type.model';
import { ConnectionRule } from './objects/connection-rule.model';
import { State } from './store/meta-data.reducer';
import { FullConfigurationItem } from './objects/full-configuration-item.model';
import * as fromApp from './store/app.reducer';
import * as MetaDataActions from './store/meta-data.actions';
import { getUrl, getHeader } from './store/functions';

@Injectable({providedIn: 'root'})
export class DataAccessService {

    constructor(private http: HttpClient,
                private store: Store<fromApp.AppState>) {
        this.init();
    }

    init() {
        // forkJoin({
        //     userName: this.fetchUserName(),
        //     userRole: this.fetchUserRole(),
        //     attributeGroups: this.fetchAttributeGroups(),
        //     attributeTypes: this.fetchAttributeTypes(),
        //     connectionRules: this.fetchConnectionRules(),
        //     connectionTypes: this.fetchConnectionTypes(),
        //     itemTypes: this.fetchItemTypes(),
        // }).subscribe(
        //     value => {
        //         this.store.dispatch(new MetaDataActions.SetState(value as MetaState));
        //         this.store.dispatch(new MetaDataActions.InitializationFinished());
        //     }
        // );
        this.store.dispatch(new MetaDataActions.ReadState());
    }

    // fetchUserName() {
    //     return this.http.get<string>(getUrl('User/Current'));
    // }

    // fetchUserRole() {
    //     return this.http.get<number>(getUrl('User/Role'));
    // }

    // fetchUserInfo(users: string[]) {
    //     return this.http.post<UserInfo[]>(getUrl('Users'),
    //         { accountNames: users },
    //         { headers: getHeader() });
    // }

    // fetchAttributeGroups() {
    //     return this.http.get<AttributeGroup[]>(getUrl('AttributeGroups'));
    // }

    // fetchAttributeTypes() {
    //     return this.http.get<AttributeType[]>(getUrl('AttributeTypes'));
    // }

    // fetchItemTypes() {
    //     return this.http.get<ItemType[]>(getUrl('ItemTypes'));
    // }

    // fetchConnectionTypes() {
    //     return this.http.get<ConnectionType[]>(getUrl('ConnectionTypes'));
    // }

    // fetchConnectionRules() {
    //     return this.http.get<ConnectionRule[]>(getUrl('ConnectionRules'));
    // }

    // fetchAttributeTypesForItemType(itemType: Guid) {
    //     return this.http.get<AttributeType[]>(getUrl('AttributeTypes/ForItemType/' + itemType.toString()),
    //         { headers: getHeader() });
    // }

    // fetchConnectionRulesByUpperItemType(itemTypeId: Guid) {
    //     return this.http.get<ConnectionRule[]>(getUrl('ConnectionRules/ByUpperItemType/' + itemTypeId.toString()),
    //         {headers: getHeader() });
    // }

    // fetchConnectionRulesByLowerItemType(itemTypeId: Guid) {
    //     return this.http.get<ConnectionRule[]>(getUrl('ConnectionRules/ByLowerItemType/' + itemTypeId.toString()),
    //         {headers: getHeader() });
    // }

    // searchItems(searchContent: SearchContent) {
    //     return this.http.post<ConfigurationItem[]>(getUrl('ConfigurationItems/Search'),
    //         {search: searchContent},
    //         {headers: getHeader() });
    // }

    // fetchConfigurationItem(guid: Guid) {
    //     return this.http.get<ConfigurationItem>(getUrl('ConfigurationItem/' + guid.toString()),
    //         { headers: getHeader() });
    // }

    // fetchFullConfigurationItem(guid: Guid) {
    //     return this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + guid.toString() + '/Full'),
    //         { headers: getHeader() });
    // }

    // fetchAttributesForItem(guid: Guid) {
    //     return this.http.get<ItemAttribute[]>(getUrl('ConfigurationItem/' + guid.toString() + '/Attributes'),
    //         { headers: getHeader() });
    // }

    // fetchConnectionsToLowerForItem(guid: Guid) {
    //     return this.http.get<Connection[]>(getUrl('ConfigurationItem/' + guid.toString() + '/Connections/ToLower'),
    //         { headers: getHeader() });
    // }

    // fetchConnectionsToUpperForItem(guid: Guid) {
    //     return this.http.get<Connection[]>(getUrl('ConfigurationItem/' + guid.toString() + '/Connections/ToUpper'),
    //         { headers: getHeader() });
    // }
}
