import { ObjectId } from 'mongodb';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { Connection } from '../../models/item-data/connection.model';
import { FullConnection } from '../../models/item-data/full/full-connection.model';
import { SearchConnection } from '../../models/item-data/search/search-connection.model';
import { SearchContent } from '../../models/item-data/search/search-content.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { ItemFilterConditions } from '../../models/mongoose/configuration-item.model';
import { notFoundError } from '../error.controller';
import { connectionRuleModelFind } from '../meta-data/connection-rule.al';
import { connectionTypeModelFindAll } from '../meta-data/connection-type.al';
import { configurationItemModelFind } from './configuration-item.al';
import { connectionModelFind } from './connection.al';

export async function modelSearchItems(search: SearchContent) {
    const filter: ItemFilterConditions = {};
    if (search.itemTypeId) {
        filter.type = search.itemTypeId;
    }
    if (search.changedAfter && !search.changedBefore) {
        filter.updatedAt = { $gt: search.changedAfter.toISOString() };
    } else  if (search.changedBefore && !search.changedAfter) {
        filter.updatedAt = { $lt: search.changedBefore.toISOString() };
    } else if (search.changedAfter && search.changedBefore) {
        filter.$and = [
            {updatedAt: { $gt: search.changedAfter.toISOString() }},
            {updatedAt: { $lt: search.changedBefore.toISOString() }}
        ];
    }
    const searchItems = new SearchItems(await configurationItemModelFind(filter), search);
    await searchItems.filter();
    return searchItems.items;
}

class SearchItems {
    connectionRules?: ConnectionRule[];
    connectionTypes?: ConnectionType[];
    connectionsToLower: Connection[] = [];
    connectionsToUpper: Connection[] = [];

    constructor(public items: ConfigurationItem[], public search: SearchContent, public persistConnections = false) {}

    addItems(items: ConfigurationItem[]) {
        this.items = [...this.items, ...items];
    }

    async filter() {
        this.filterNameOrValue();
        this.filterAttributes();
        this.filterUser();
        if (this.search.connectionsToLower || this.search.connectionsToUpper) {
            await this.filterConnectionsToLower();
            await this.filterConnectionsToUpper();
        }
    }

    filterNameOrValue() {
        if (this.search.nameOrValue) {
            this.items = this.items.filter(item => {
                const regex = new RegExp(this.search.nameOrValue!, 'i');
                if (regex.test(item.name)) { return true; }
                item.attributes.forEach(attribute => {
                    if (regex.test(attribute.value)) { return true; }
                });
                return false;
            });
        }
    }

    filterAttributes() {
        this.search.attributes?.forEach(searchAtt => {
            this.items = this.items.filter(item => {
                const attribute = item.attributes.find(a => a.typeId === searchAtt.typeId);
                if (!attribute) { return !searchAtt.value; } // if no search value is set, return true if no attribute exists
                if (searchAtt.value === '!') { return true; } // if seach value is only !, then search for existing attributes was successful
                if (searchAtt.value.startsWith('!')) { // find all attribute values that do not contain search value
                    return !attribute.value.toLocaleLowerCase().includes(searchAtt.value.substr(1).toLocaleLowerCase());
                }
                return attribute.value.toLocaleLowerCase().includes(searchAtt.value.toLocaleLowerCase());
            });
        });
    }

    filterUser() {
        if (this.search.responsibleUser) {
            this.items = this.items.filter(item => item.responsibleUsers.includes(this.search.responsibleUser!));
        }
    }

    filterItemType() {
        if (this.search.itemTypeId) {
            this.items = this.items.filter(item => item.typeId === this.search.itemTypeId);
        }
    }

    filterChangedBefore() {
        if (this.search.changedBefore) {
            this.items = this.items.filter(item => item.lastChange! < this.search.changedBefore!);
        }
    }

    filterChangedAfter() {
        if (this.search.changedAfter) {
            this.items = this.items.filter(item => item.lastChange! > this.search.changedAfter!);
        }
    }

    private async fillConnectionRules() {
        if (!this.connectionRules) {
            const itemTypeIds = [...new Set(this.items.map(i => i.typeId))];
            [this.connectionRules, this.connectionTypes] = await Promise.all([
                connectionRuleModelFind({$or: [{upperItemType: {$in: itemTypeIds}}, {lowerItemType: {$in: itemTypeIds}}]}),
                connectionTypeModelFindAll(),
            ]);
        }
    }

    async filterConnectionsToUpper() {
        await this.fillConnectionRules();
        if (this.search.connectionsToUpper) {
            const itemIds = this.items.map(i => new ObjectId(i.id));
            const connections = await connectionModelFind({lowerItem: {$in: itemIds}});
            this.search.connectionsToUpper.forEach(searchConn => {
                this.items = this.items.filter(item => {
                    let myConnections = connections.filter(c => c.lowerItemId === item.id && c.typeId === searchConn.connectionTypeId);
                    if (searchConn.itemTypeId) {
                        const myRule = this.connectionRules!.find(cr => cr.lowerItemTypeId === item.typeId &&
                            cr.connectionTypeId === searchConn.connectionTypeId && cr.upperItemTypeId === searchConn.itemTypeId);
                        if (!myRule) {
                            throw notFoundError;
                        }
                        myConnections = myConnections.filter(c => c.ruleId === myRule.id);
                    }
                    return this.checkConnectionsCount(searchConn, myConnections);
                });
            });
            if (this.persistConnections) {
                const remainingItemIds = this.items.map(i => i.id);
                this.connectionsToUpper = connections.filter(c => remainingItemIds.includes(c.lowerItemId));
            }
        }
    }

    async filterConnectionsToLower() {
        await this.fillConnectionRules();
        if (this.search.connectionsToLower) {
            const itemIds = this.items.map(i => new ObjectId(i.id));
            const connections = await connectionModelFind({upperItem: {$in: itemIds}});
            this.search.connectionsToLower.forEach(searchConn => {
                this.items = this.items.filter(item => {
                    let myConnections = connections.filter(c => c.upperItemId === item.id && c.typeId === searchConn.connectionTypeId);
                    if (searchConn.itemTypeId) {
                        const myRule = this.connectionRules!.find(cr => cr.upperItemTypeId === item.typeId &&
                            cr.connectionTypeId === searchConn.connectionTypeId && cr.lowerItemTypeId === searchConn.itemTypeId);
                        if (!myRule) {
                            throw notFoundError;
                        }
                        myConnections = myConnections.filter(c => c.ruleId === myRule.id);
                    }
                    return this.checkConnectionsCount(searchConn, myConnections);
                });
            });
            if (this.persistConnections) {
                const remainingItemIds = this.items.map(i => i.id);
                this.connectionsToLower = connections.filter(c => remainingItemIds.includes(c.upperItemId));
            }
        }
    }

    createFullConnection(connection: Connection, rule: ConnectionRule, targetItem: ConfigurationItem, connectionTypeName: string) {
        const conn = new FullConnection();
        conn.id = connection.id;
        conn.description = connection.description;
        conn.ruleId = rule.id!;
        conn.typeId = rule.connectionTypeId;
        // conn.type = connectionTypeName;
        conn.targetId = targetItem.id!;
        conn.targetName = targetItem.name;
        conn.targetTypeId = targetItem.typeId;
        conn.targetType = targetItem.type;
        conn.targetColor = targetItem.color;
        return conn;
    }

    checkConnectionsCount(searchConn: SearchConnection, myConnections: Connection[]) {
        switch (searchConn.count) {
            case '0':
                return myConnections.length === 0;
            case '1':
                return myConnections.length === 1;
            case '1+':
                return myConnections.length > 0;
            case '2+':
                return myConnections.length > 1;
        }
        return false;
    }
}


