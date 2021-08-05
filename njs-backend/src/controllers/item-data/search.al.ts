import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { Connection } from '../../models/item-data/connection.model';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';
import { FullConnection } from '../../models/item-data/full/full-connection.model';
import { NeighborItem } from '../../models/item-data/search/neighbor-item.model';
import { Direction, NeighborSearch } from '../../models/item-data/search/neighbor-search.model';
import { SearchConnection } from '../../models/item-data/search/search-connection.model';
import { SearchContent } from '../../models/item-data/search/search-content.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { configurationItemModel, IConfigurationItem } from '../../models/mongoose/configuration-item.model';
import { connectionModel, IConnection } from '../../models/mongoose/connection.model';
import { notFoundError } from '../error.controller';
import { connectionRuleModelFind } from '../meta-data/connection-rule.al';
import { connectionTypeModelFindAll } from '../meta-data/connection-type.al';
import { itemTypeModelFindAll } from '../meta-data/item-type.al';
import { configurationItemModelFind, configurationItemModelFindSingle } from './configuration-item.al';
import { connectionsFindByUpperItems, connectionModelFind, connectionsFindByLowerItems } from './connection.al';

export async function modelSearchItems(search: SearchContent, returnFullItems = false) {
    const filter: FilterQuery<IConfigurationItem> = {};
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
    const searchItems = new SearchItems(await configurationItemModelFind(filter), search, returnFullItems);
    await searchItems.filter();
    if (returnFullItems) {
        return await searchItems.getFullItems();
    }
    return searchItems.items;
}

export async function modelSearchNeighbor(search: NeighborSearch, returnFullItems = false) {
    const searchNeighbors = new SearchNeighbors(search, await configurationItemModelFindSingle(search.sourceItem));
    await searchNeighbors.searchNeighbors();
    return searchNeighbors.result;
}

class SearchItems {
    private connectionRules?: ConnectionRule[];
    private connectionTypes?: ConnectionType[];
    private itemTypes: ItemType[] = [];
    private connectionsToLower: Connection[] = [];
    private connectionsToUpper: Connection[] = [];
    private connectionsToLowerFilled = false;
    private connectionsToUpperFilled = false;

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
            await this.fillConnectionsToUpper();
            this.search.connectionsToUpper.forEach(searchConn => {
                this.items = this.items.filter(item => {
                    let myConnections = this.connectionsToUpper.filter(c => c.lowerItemId === item.id && c.typeId === searchConn.connectionTypeId);
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
                this.connectionsToUpper = this.connectionsToUpper.filter(c => remainingItemIds.includes(c.lowerItemId));
            } else {
                this.connectionsToUpper = [];
            }
        }
    }

    private async fillConnectionsToUpper() {
        if (!this.connectionsToUpperFilled) {
            const itemIds = this.items.map(i => new ObjectId(i.id));
            this.connectionsToUpper = await connectionModelFind({ lowerItem: { $in: itemIds } });
            this.connectionsToUpperFilled = true;
        }
    }

    async filterConnectionsToLower() {
        await this.fillConnectionRules();
        if (this.search.connectionsToLower) {
            await this.fillConnectionsToLower();
            this.search.connectionsToLower.forEach(searchConn => {
                this.items = this.items.filter(item => {
                    let myConnections = this.connectionsToLower.filter(c => c.upperItemId === item.id && c.typeId === searchConn.connectionTypeId);
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
                this.connectionsToLower = this.connectionsToLower.filter(c => remainingItemIds.includes(c.upperItemId));
            } else {
                this.connectionsToLower = [];
            }
        }
    }

    private async fillConnectionsToLower() {
        if (!this.connectionsToLowerFilled)
        {
            const itemIds = this.items.map(i => new ObjectId(i.id));
            this.connectionsToLower = await connectionModelFind({ upperItem: { $in: itemIds } });
            this.connectionsToLowerFilled = true;
        }
    }

    createFullConnection(connection: Connection, rule: ConnectionRule, targetItem: IConfigurationItem, connectionTypeName: string) {
        const itemType = this.itemTypes.find(t => t.id === targetItem.type.toString())!;
        const conn = new FullConnection();
        conn.id = connection.id;
        conn.description = connection.description;
        conn.ruleId = rule.id!;
        conn.typeId = rule.connectionTypeId;
        conn.type = connectionTypeName;
        conn.targetId = targetItem.id!;
        conn.targetName = targetItem.name;
        conn.targetTypeId = itemType.id;
        conn.targetType = itemType.name;
        conn.targetColor = itemType.backColor;
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

    async getFullItems() {
        await Promise.all([this.fillConnectionsToLower(), this.fillConnectionsToUpper(), this.fillConnectionRules()]);
        const targetItemIds = [
            ...this.connectionsToLower.map(c => c.lowerItemId),
            ...this.connectionsToUpper.map(c => c.upperItemId),
        ];
        let targetItems: IConfigurationItem[];
        [targetItems, this.itemTypes] = await Promise.all([
            configurationItemModel.find({_id: {$in: targetItemIds}}),
            itemTypeModelFindAll(),
        ]);
        const connectionsToUpper = new Map<string, FullConnection[]>();
        const connectionsToLower = new Map<string, FullConnection[]>();
        this.connectionsToUpper.forEach(c => {
            const rule = this.connectionRules!.find(cr => cr.id === c.ruleId)!;
            const type = this.connectionTypes!.find(ct => ct.id === rule.connectionTypeId)!;
            const conn = this.createFullConnection(c, rule, targetItems.find(i => i._id.toString() === c.upperItemId)!, type.reverseName);
            if (connectionsToUpper.has(c.lowerItemId)) {
                connectionsToUpper.set(c.lowerItemId, [...connectionsToUpper.get(c.lowerItemId)!, conn]);
            } else {
                connectionsToUpper.set(c.lowerItemId, [conn]);
            }
        });
        this.connectionsToLower.forEach(c => {
            const rule = this.connectionRules!.find(cr => cr.id === c.ruleId)!;
            const type = this.connectionTypes!.find(ct => ct.id === rule.connectionTypeId)!;
            const conn = this.createFullConnection(c, rule, targetItems.find(i => i._id.toString() === c.lowerItemId)!, type.name);
            if (connectionsToLower.has(c.upperItemId)) {
                connectionsToLower.set(c.upperItemId, [...connectionsToLower.get(c.upperItemId)!, conn]);
            } else {
                connectionsToLower.set(c.upperItemId, [conn]);
            }
        });
        return this.items.map(i => ({
                ...i,
                connectionsToLower: connectionsToLower.get(i.id) ?? [],
                connectionsToUpper: connectionsToUpper.get(i.id) ?? [],
            } as FullConfigurationItem)
        );
    }
}

class SearchNeighbors {
    public result: NeighborItem[] = [];
    public get items() {
        return this.result.map(r => r.item!);
    }

    constructor(public search: NeighborSearch, public originItem: ConfigurationItem) {}

    async searchNeighbors() {
        const nItem: NeighborItem = {
            id: this.originItem.id,
            item: this.originItem,
            direction: Direction.both,
            level: 0,
            path: '',
        };
        const promises: Promise<void>[] = [];
        if (this.search.searchDirection !== Direction.up) {
            promises.push(this.searchDown([nItem], 0, this.search.maxLevels));
        }
        if (this.search.searchDirection !== Direction.down) {
            promises.push(this.searchUp([nItem], 0, this.search.maxLevels));
        }
        await Promise.all(promises);
        const itemIds = [...new Set(this.result.map(r => r.id))];
        const items = await configurationItemModelFind({_id: {$in: itemIds}, type: this.search.itemTypeId});
        items.forEach(item => {
            this.result.filter(r => r.id === item.id).forEach(r => {
                r.item = item;
                r.path = r.path.substr(1);
            });
        });
        this.result = this.result.filter(r => !!r.item);
        if (this.search.extraSearch) {
            this.search.extraSearch.itemTypeId = this.search.itemTypeId;
            const extraSearch = new SearchItems(this.items, this.search.extraSearch);
            await extraSearch.filter();
            const remainingItemIds = extraSearch.items.map(i => i.id);
            this.result = this.result.filter(r => remainingItemIds.includes(r.id));
        }
    }

    async searchUp(startingItems: NeighborItem[], currentLevel: number, maxLevel: number) {
        const connections: IConnection[] = await connectionsFindByLowerItems(startingItems.map(i => i.id));
        const nextItems = connections.map(c => ({
            id: c.upperItem.toString(),
            level: currentLevel + 1,
            direction: Direction.up,
            path: startingItems.find(i => i.id === c.lowerItem.toString())!.path + ',' + c.lowerItem.toString(),
        }));
        this.result = [...this.result, ...nextItems];
        if (currentLevel < maxLevel && nextItems.length > 0) {
            await this.searchUp(nextItems, currentLevel + 1, maxLevel);
        }
    }

    async searchDown(startingItems: NeighborItem[], currentLevel: number, maxLevel: number) {
        const connections: IConnection[] = await connectionsFindByUpperItems(startingItems.map(i => i.id));
        const nextItems = connections.map(c => ({
            id: c.lowerItem.toString(),
            level: currentLevel + 1,
            direction: Direction.up,
            path: startingItems.find(i => i.id === c.upperItem.toString())!.path + ',' + c.upperItem.toString(),
        }));
        this.result = [...this.result, ...nextItems];
        if (currentLevel < maxLevel && nextItems.length > 0) {
            await this.searchDown(nextItems, currentLevel + 1, maxLevel);
        }
    }

}
