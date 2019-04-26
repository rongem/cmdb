import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ItemType } from './objects/item-type.model';
import { MetaDataService, UserRole } from './meta-data.service';
import { AttributeType } from './objects/attribute-type.model';
import { AttributeGroup } from './objects/attribute-group.model';
import { Guid } from 'guid-typescript';
import { SearchContent } from '../display/search/search-content.model';
import { ConfigurationItem } from './objects/configuration-item.model';

@Injectable()
export class DataAccessService {
    private baseurl = 'http://localhost:51717/API/REST.svc/';

    constructor(private http: HttpClient, private meta: MetaDataService) {
        this.init();
    }

    init() {
        this.fetchUserName();
        this.fetchUserRole();
        this.fetchAttributeTypes();
        this.fetchItemTypes();
    }

    getUrl(service: string) {
        return this.baseurl + service;
    }

    fetchUserName() {
        this.http.get<string>(this.getUrl('GetCurrentUser'))
            .subscribe((user: string) => {
                this.meta.userName = user;
            });
    }

    fetchUserRole() {
        this.http.get<number>(this.getUrl('GetRoleForUser'))
            .subscribe((role: number) => {
                this.meta.userRole = role;
            });
        }

    fetchAttributeGroups() {
        this.http.get<AttributeGroup[]>(this.getUrl('GetAttributeGroups'))
            .subscribe((attributeGroups: AttributeGroup[]) => {
                this.meta.setAttributeGroups(attributeGroups);
            });
    }

    fetchAttributeTypes() {
        this.http.get<AttributeType[]>(this.getUrl('GetAttributeTypes'))
            .subscribe((attributeTypes: AttributeType[]) => {
                this.meta.setAttributeTypes(attributeTypes);
            });
    }

    fetchAttributeTypesForItemType(itemType: Guid) {
        return this.http.post<AttributeType[]>(this.getUrl('GetAttributeTypesForItemType'),
            { itemTypeId: itemType },
            { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) });
    }

    fetchItemTypes() {
        this.http.get<ItemType[]>(this.getUrl('GetItemTypes'))
            .subscribe((itemTypes: ItemType[]) => {
                this.meta.setItemTypes(itemTypes);
            });
    }

    searchItems(searchContent: SearchContent) {
        return this.http.post<ConfigurationItem[]>(this.getUrl('SearchConfigurationItems'),
            {search: searchContent},
            {headers: new HttpHeaders({ 'Content-Type': 'application/json'})});
    }
}
