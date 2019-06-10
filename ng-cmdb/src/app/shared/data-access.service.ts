import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
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
import { AppState } from './store/app-state.interface';
import * as MetaDataActions from './store/meta-data.actions';

@Injectable({providedIn: 'root'})
export class DataAccessService {
    private baseurl = 'http://localhost:51717/API/REST.svc/';

    constructor(private http: HttpClient,
                private store: Store<AppState>) {
        this.init();
    }

    init() {
        this.fetchUserName();
        this.fetchUserRole();
        this.fetchAttributeTypes();
        this.fetchItemTypes();
        this.fetchConnectionTypes();
        this.fetchConnectionRules();
    }

    private getHeader() {
        return new HttpHeaders({ 'Content-Type': 'application/json'});
    }

    private getUrl(service: string) {
        return this.baseurl + service;
    }

    fetchUserName() {
        this.http.get<string>(this.getUrl('User/Current'))
            .subscribe((user: string) => {
                this.store.dispatch(new MetaDataActions.SetUser(user));
            });
    }

    fetchUserRole() {
        this.http.get<number>(this.getUrl('User/Role'))
            .subscribe((role: number) => {
                this.store.dispatch(new MetaDataActions.SetRole(role));
            });
    }

    fetchUserInfo(users: string[]) {
        return this.http.post<UserInfo[]>(this.getUrl('Users'),
            { accountNames: users },
            { headers: this.getHeader() });
    }

    fetchAttributeGroups() {
        this.http.get<AttributeGroup[]>(this.getUrl('AttributeGroups'))
            .subscribe((attributeGroups: AttributeGroup[]) => {
                this.store.dispatch(new MetaDataActions.SetAttributeGroups(attributeGroups));
            });
    }

    fetchAttributeTypes() {
        this.http.get<AttributeType[]>(this.getUrl('AttributeTypes'))
            .subscribe((attributeTypes: AttributeType[]) => {
                this.store.dispatch(new MetaDataActions.SetAttributeTypes(attributeTypes));
            });
    }

    fetchAttributeTypesForItemType(itemType: Guid) {
        return this.http.get<AttributeType[]>(this.getUrl('AttributeTypes/ForItemType/' + itemType.toString()),
            { headers: this.getHeader() });
    }

    fetchItemTypes() {
        this.http.get<ItemType[]>(this.getUrl('ItemTypes'))
            .subscribe((itemTypes: ItemType[]) => {
                this.store.dispatch(new MetaDataActions.SetItemTypes(itemTypes));
            });
    }

    fetchConnectionTypes() {
        this.http.get<ConnectionType[]>(this.getUrl('ConnectionTypes'))
            .subscribe((connectionTypes: ConnectionType[]) => {
                this.store.dispatch(new MetaDataActions.SetConnectionTypes(connectionTypes));
            });
    }

    fetchConnectionRules() {
        this.http.get<ConnectionRule[]>(this.getUrl('ConnectionRules'))
            .subscribe((connectionRules: ConnectionRule[]) => {
                this.store.dispatch(new MetaDataActions.SetConnectionRules(connectionRules));
            });
    }

    fetchConnectionRulesByUpperItemType(itemTypeId: Guid) {
        return this.http.get<ConnectionRule[]>(this.getUrl('ConnectionRules/ByUpperItemType/' + itemTypeId.toString()),
            {headers: this.getHeader() });
    }

    fetchConnectionRulesByLowerItemType(itemTypeId: Guid) {
        return this.http.get<ConnectionRule[]>(this.getUrl('ConnectionRules/ByLowerItemType/' + itemTypeId.toString()),
            {headers: this.getHeader() });
    }

    searchItems(searchContent: SearchContent) {
        return this.http.post<ConfigurationItem[]>(this.getUrl('SearchConfigurationItems'),
            {search: searchContent},
            {headers: this.getHeader() });
    }

    fetchConfigurationItem(guid: Guid) {
        return this.http.get<ConfigurationItem>(this.getUrl('ConfigurationItem/' + guid.toString()),
            { headers: this.getHeader() });
    }

    fetchAttributesForItem(guid: Guid) {
        return this.http.get<ItemAttribute[]>(this.getUrl('ConfigurationItem/' + guid.toString() + '/Attributes'),
            { headers: this.getHeader() });
    }

    fetchConnectionsToLowerForItem(guid: Guid) {
        return this.http.get<Connection[]>(this.getUrl('ConfigurationItem/' + guid.toString() + '/ConnectionsToLower'),
            { headers: this.getHeader() });
    }

    fetchConnectionsToUpperForItem(guid: Guid) {
        return this.http.get<Connection[]>(this.getUrl('ConfigurationItem/' + guid.toString() + '/ConnectionsToUpper'),
            { headers: this.getHeader() });
    }
}
