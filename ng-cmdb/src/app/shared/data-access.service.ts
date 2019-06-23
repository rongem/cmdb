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
import { MetaState } from './store/meta-data.reducer';
import { FullConfigurationItem } from './objects/full-configuration-item.model';
import * as fromApp from './store/app.reducer';
import * as MetaDataActions from './store/meta-data.actions';

@Injectable({providedIn: 'root'})
export class DataAccessService {
    private baseurl = 'http://localhost:51717/API/REST.svc/';

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

    private getHeader() {
        return new HttpHeaders({ 'Content-Type': 'application/json'});
    }

    private getUrl(service: string) {
        return this.baseurl + service;
    }

    fetchUserName() {
        return this.http.get<string>(this.getUrl('User/Current'));
    }

    fetchUserRole() {
        return this.http.get<number>(this.getUrl('User/Role'));
    }

    fetchUserInfo(users: string[]) {
        return this.http.post<UserInfo[]>(this.getUrl('Users'),
            { accountNames: users },
            { headers: this.getHeader() });
    }

    fetchAttributeGroups() {
        return this.http.get<AttributeGroup[]>(this.getUrl('AttributeGroups'));
    }

    fetchAttributeTypes() {
        return this.http.get<AttributeType[]>(this.getUrl('AttributeTypes'));
    }

    fetchItemTypes() {
        return this.http.get<ItemType[]>(this.getUrl('ItemTypes'));
    }

    fetchConnectionTypes() {
        return this.http.get<ConnectionType[]>(this.getUrl('ConnectionTypes'));
    }

    fetchConnectionRules() {
        return this.http.get<ConnectionRule[]>(this.getUrl('ConnectionRules'));
    }

    fetchAttributeTypesForItemType(itemType: Guid) {
        return this.http.get<AttributeType[]>(this.getUrl('AttributeTypes/ForItemType/' + itemType.toString()),
            { headers: this.getHeader() });
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
        return this.http.post<ConfigurationItem[]>(this.getUrl('ConfigurationItems/Search'),
            {search: searchContent},
            {headers: this.getHeader() });
    }

    fetchConfigurationItem(guid: Guid) {
        return this.http.get<ConfigurationItem>(this.getUrl('ConfigurationItem/' + guid.toString()),
            { headers: this.getHeader() });
    }

    fetchFullConfigurationItem(guid: Guid) {
        return this.http.get<FullConfigurationItem>(this.getUrl('ConfigurationItem/' + guid.toString() + '/Full'),
            { headers: this.getHeader() });
    }

    fetchAttributesForItem(guid: Guid) {
        return this.http.get<ItemAttribute[]>(this.getUrl('ConfigurationItem/' + guid.toString() + '/Attributes'),
            { headers: this.getHeader() });
    }

    fetchConnectionsToLowerForItem(guid: Guid) {
        return this.http.get<Connection[]>(this.getUrl('ConfigurationItem/' + guid.toString() + '/Connections/ToLower'),
            { headers: this.getHeader() });
    }

    fetchConnectionsToUpperForItem(guid: Guid) {
        return this.http.get<Connection[]>(this.getUrl('ConfigurationItem/' + guid.toString() + '/Connections/ToUpper'),
            { headers: this.getHeader() });
    }
}
