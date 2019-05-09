import { Injectable } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

import { ConfigurationItem } from '../shared/objects/configuration-item.model';
import { ItemAttribute } from '../shared/objects/item-attribute.model';
import { MetaDataService } from '../shared/meta-data.service';
import { DataAccessService } from '../shared/data-access.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from '../shared/objects/user-info.model';
import { Connection } from '../shared/objects/connection.model';
import { isArray } from 'util';

@Injectable()
export class ConfigurationItemService {
    private itemId: Guid;
    item: ConfigurationItem;
    attributes: ItemAttribute[] = [];
    responsibilites: UserInfo[] = [];
    connectionsToUpper: Connection[] = [];
    connectionGroupsToUpper: Guid[] = [];
    connectionsToLower: Connection[] = [];
    connectionGroupsToLower: Guid[] = [];
    itemChanged = new Subject<ConfigurationItem>();
    attributesChanged = new Subject<ItemAttribute[]>();
    responsibilitesChanged = new Subject<UserInfo[]>();
    connectionsToUpperChanged = new Subject<Connection[]>();
    connectionGroupsToUpperChanged = new Subject<Guid[]>();
    connectionsToLowerChanged = new Subject<Connection[]>();
    connectionGroupsToLowerChanged = new Subject<Guid[]>();
    connectedItems: Map<Guid, ConfigurationItem>;
    connectedItemsChanged = new Subject<Map<Guid, ConfigurationItem>>();

    constructor(private router: Router,
                private meta: MetaDataService,
                private data: DataAccessService) {}

    reload() {
        const guid = this.itemId;
        this.itemId = null;
        this.getItem(guid);
    }

    getItem(guid: Guid) {
        if (this.itemId && this.itemId === guid) {
            return;
        }
        this.attributes = [];
        this.responsibilites = [];
        this.connectionsToLower = [];
        this.connectionsToUpper = [];
        this.connectedItems = new Map<Guid, ConfigurationItem>();
        this.data.fetchConfigurationItem(guid)
            .subscribe((value: ConfigurationItem) => {
                if (value) {
                    this.itemId = value.ItemId;
                    this.getItemAttributes();
                    this.getResponsibilities(value.ResponsibleUsers);
                    this.getConnectionsToLower();
                    this.getConnectionsToUpper();
                    this.setItem(value);
                } else {
                    this.item = undefined;
                    this.itemId = undefined;
                    this.router.navigate(['display', 'configuration-item', 'search']);
                }
        });
    }

    private setItem(item: ConfigurationItem) {
        this.item = item;
        this.itemChanged.next(item);
    }

    getItemAttributes() {
        if (this.itemId) {
            this.data.fetchAttributesForItem(this.itemId)
                .subscribe((value: ItemAttribute[]) => {
                    this.setAttributes(value);
            });
        }
    }

    private setAttributes(attributes: ItemAttribute[]) {
        this.attributes = attributes;
        this.attributesChanged.next(this.attributes.slice());
    }

    getResponsibilities(users: string[]) {
        if (this.itemId) {
            this.data.fetchUserInfo(users)
                .subscribe((value: UserInfo[]) => {
                    return this.setResponsibilites(value);
            });
        }
    }

    private setResponsibilites(userInfos: UserInfo[]) {
        this.responsibilites = userInfos;
        return this.responsibilites.slice();
    }

    getConnectionsCount() {
        let ret = 0;
        if (isArray(this.connectionsToLower)) {
            ret += this.connectionsToLower.length;
        }
        if (isArray(this.connectionsToUpper)) {
            ret += this.connectionsToUpper.length;
        }
        return ret;
    }

    private getGroupsFromConnections(connections: Connection[]): Guid[] {
        const guids: Guid[] = [];
        for (const connection of connections) {
            if (!guids.includes(connection.ConnType)) {
                guids.push(connection.ConnType);
            }
        }
        return guids;
    }

    private cacheItem(guid: Guid) {
        if (this.connectedItems.has(guid)) {
            return;
        }
        this.data.fetchConfigurationItem(guid).subscribe((item: ConfigurationItem) => {
            this.connectedItems.set(guid, item);
        });
    }

    getConnectedItem(guid: Guid): ConfigurationItem {
        return this.connectedItems.get(guid);
    }

    getConnectionsToLower() {
        if (this.itemId) {
            this.data.fetchConnectionsToLowerForItem(this.itemId)
                .subscribe((value: Connection[]) => {
                    return this.setConnectionsToLower(value);
            });
        }
    }

    private setConnectionsToLower(connections: Connection[]) {
        this.connectionsToLower = connections;
        this.connectionsToLowerChanged.next(this.connectionsToLower.slice());
        this.connectionGroupsToLower = this.getGroupsFromConnections(connections);
        this.connectionGroupsToLowerChanged.next(this.connectionGroupsToLower.slice());
        for (const connection of connections) {
            this.cacheItem(connection.ConnLowerItem);
        }
        this.connectedItemsChanged.next(this.connectedItems);
    }

    getLowerItemTypeName(ruleId: Guid) {
        const rule = this.meta.getConnectionRule(ruleId);
        if (rule) {
            const itemType = this.meta.getItemType(rule.ItemLowerType);
            if (itemType) {
                return itemType.TypeName;
            }
        }
    }

    getConnectionsToUpper() {
        if (this.itemId) {
            this.data.fetchConnectionsToUpperForItem(this.itemId)
                .subscribe((value: Connection[]) => {
                    return this.setConnectionsToUpper(value);
            });
        }
    }

    private setConnectionsToUpper(connections: Connection[]) {
        this.connectionsToUpper = connections;
        this.connectionsToUpperChanged.next(this.connectionsToUpper.slice());
        this.connectionGroupsToUpper = this.getGroupsFromConnections(connections);
        this.connectionGroupsToUpperChanged.next(this.connectionGroupsToUpper.slice());
        for (const connection of connections) {
            this.cacheItem(connection.ConnUpperItem);
        }
        this.connectedItemsChanged.next(this.connectedItems);
    }

    getUpperItemTypeName(ruleId: Guid) {
        const rule = this.meta.getConnectionRule(ruleId);
        if (rule) {
            const itemType = this.meta.getItemType(rule.ItemUpperType);
            if (itemType) {
                return itemType.TypeName;
            }
        }
    }
}
