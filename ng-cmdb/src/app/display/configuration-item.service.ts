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
    private itemPromise: Promise<ConfigurationItem>;
    private item: ConfigurationItem;
    private attributes: ItemAttribute[];
    private attributePromise: Promise<ItemAttribute[]>;
    private responsibilites: UserInfo[];
    private responsibilityPromise: Promise<UserInfo[]>;
    private connectionsToUpper: Connection[];
    connectionGroupsToUpper: Guid[];
    private connectionsToLower: Connection[];
    connectionGroupsToLower: Guid[];
    private connectionsToUpperPromise: Promise<Connection[]>;
    private connectionsToLowerPromise: Promise<Connection[]>;
    itemChanged = new Subject<ConfigurationItem>();
    private connectedItems: Map<Guid, ConfigurationItem>;

    constructor(private router: Router,
                private meta: MetaDataService,
                private data: DataAccessService) {}

    reload() {
        if (this.itemPromise) {
            return;
        }
        const guid = this.itemId;
        this.itemId = null;
        this.getItem(guid);
    }

    getItem(guid: Guid): Promise<ConfigurationItem> | ConfigurationItem {
        if (this.itemPromise) {
            return this.itemPromise;
        }
        if (this.itemId && this.itemId === guid) {
            return this.item;
        }
        this.attributes = null;
        this.responsibilites = null;
        this.connectionsToLower = null;
        this.connectionsToUpper = null;
        this.connectedItems = new Map<Guid, ConfigurationItem>();
        this.itemPromise = this.data.fetchConfigurationItem(guid)
            .toPromise()
            .then((value: ConfigurationItem) => {
                this.itemId = value.ItemId;
                this.getItemAttributes();
                this.getResponsibilities(value.ResponsibleUsers);
                this.getConnectionsToLower();
                this.getConnectionsToUpper();
                return this.setItem(value);
            })
            .catch((reason: any) => {
                this.item = undefined;
                this.itemId = undefined;
                this.router.navigate(['display', 'configuration-item', 'new']);
                return undefined;
            })
            .finally(() => { this.itemPromise = undefined; });
        return this.itemPromise;
    }

    private setItem(item: ConfigurationItem) {
        this.item = item;
        this.itemChanged.next(item);
        return this.item;
    }

    getItemAttributes(): Promise<ItemAttribute[]> | ItemAttribute[] {
        if (this.attributePromise) {
            return this.attributePromise;
        }
        if (this.attributes) {
            return this.attributes.slice();
        }
        if (this.itemId) {
            return this.attributePromise = this.data.fetchAttributesForItem(this.itemId)
                .toPromise()
                .then((value: ItemAttribute[]) => {
                    return this.setAttributes(value);
                })
                .catch((reason: any) => {
                    return this.setAttributes([]);
                })
                .finally(() => { this.attributePromise = undefined; });
        }
    }

    private setAttributes(attributes: ItemAttribute[]) {
        this.attributes = attributes;
        return this.attributes.slice();
    }

    getResponsibilities(users?: string[]): Promise<UserInfo[]> | UserInfo[] {
        if (this.responsibilityPromise) {
            return this.responsibilityPromise;
        }
        if (this.responsibilites) {
            return this.responsibilites;
        }
        if (!users) {
            return [];
        }
        if (this.itemId) {
            return this.responsibilityPromise = this.data.fetchUserInfo(users)
                .toPromise()
                .then((value: UserInfo[]) => {
                    return this.setResponsibilites(value);
                })
                .catch((reason: any) => {
                    return this.setResponsibilites([]);
                })
                .finally(() => { this.responsibilityPromise = undefined; });
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

    getConnectionsToLower(): Promise<Connection[]> | Connection[] {
        if (this.connectionsToLowerPromise) {
            return this.connectionsToLowerPromise;
        }
        if (this.connectionsToLower) {
            return this.connectionsToLower;
        }
        if (this.itemId) {
            return this.connectionsToLowerPromise = this.data.fetchConnectionsToLowerForItem(this.itemId)
                .toPromise()
                .then((value: Connection[]) => {
                    return this.setConnectionsToLower(value);
                })
                .catch((reason: any) => {
                    return this.setConnectionsToLower([]);
                })
                .finally(() => { this.connectionsToLowerPromise = undefined; });
        }
    }

    private setConnectionsToLower(connections: Connection[]): Connection[] {
        this.connectionsToLower = connections;
        this.connectionGroupsToLower = this.getGroupsFromConnections(connections);
        for (const connection of connections) {
            this.cacheItem(connection.ConnLowerItem);
        }
        return this.connectionsToLower.slice();
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

    getConnectionsToUpper(): Promise<Connection[]> | Connection[] {
        if (this.connectionsToUpperPromise) {
            return this.connectionsToUpperPromise;
        }
        if (this.connectionsToUpper) {
            return this.connectionsToUpper;
        }
        if (this.itemId) {
            return this.connectionsToUpperPromise = this.data.fetchConnectionsToUpperForItem(this.itemId)
                .toPromise()
                .then((value: Connection[]) => {
                    return this.setConnectionsToUpper(value);
                })
                .catch((reason: any) => {
                    return this.setConnectionsToUpper([]);
                })
                .finally(() => { this.connectionsToUpperPromise = undefined; });
        }
    }

    private setConnectionsToUpper(connections: Connection[]): Connection[] {
        this.connectionsToUpper = connections;
        this.connectionGroupsToUpper = this.getGroupsFromConnections(connections);
        return this.connectionsToUpper.slice();
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
