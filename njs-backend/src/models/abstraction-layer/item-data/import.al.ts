import * as XLSX from 'xlsx';

import {
    disallowedAttributeTypeMsg,
    importConnectionCreatedMsg,
    importConnectionUpdatedMsg,
    importIgnoringDuplicateNameMsg,
    importIgnoringEmptyNameMsg,
    importItemCreatedMsg,
    importItemUpdatedMsg,
    invalidAttributeValueMsg,
    invalidDescriptionMsg,
    maximumNumberOfConnectionsToLowerExceededMsg,
    maximumNumberOfConnectionsToUpperExceededMsg,
    noItemFoundMsg
} from '../../../util/messages.constants';
import { IUser } from '../../mongoose/user.model';
import { ColumnMap } from '../../item-data/column-map.model';
import { deleteValue, targetTypeValues } from '../../../util/values.constants';
import { configurationItemModel, IAttribute, IConfigurationItem, ILink } from '../../mongoose/configuration-item.model';
import { connectionModel, IConnection } from '../../mongoose/connection.model';
import { LineMessage } from '../../item-data/line-message.model';
import { ItemType } from '../../meta-data/item-type.model';
import { AttributeType } from '../../meta-data/attribute-type.model';
import { ConnectionRule } from '../../meta-data/connection-rule.model';
import { validURL } from '../../../routes/validators';
import { connectionsCountByFilter, createHistoricConnection, updateHistoricConnection } from './connection.al';
import { buildHistoricItemVersion, updateItemHistory } from './historic-item.al';
import { historicCiModel } from '../../mongoose/historic-ci.model';
import { configurationItemFindOneByNameAndTypePopulated, populateItem } from './configuration-item.al';
import { UserInfo } from '../../item-data/user-info.model';

interface SheetResult {
    fileName: string;
    fileType: string;
    sheets: Sheet[];
}

interface Sheet {
    name: string;
    lines: string[][];
}

export function handleFile(file: Express.Multer.File) {
    const wb = XLSX.read(file.buffer, {type: 'buffer'});
    const result: SheetResult = {
        fileName: file.originalname,
        fileType: file.mimetype,
        sheets: [],
    };
    wb.SheetNames.forEach(name => {
        const ws = wb.Sheets[name];
        const sheet: Sheet = {
            name,
            lines: XLSX.utils.sheet_to_json(ws, {blankrows: false, defval: '', rawNumbers: false, header: 1}),
        };
        result.sheets.push(sheet);
    });
    return result;
}

export async function importDataTable(itemType: ItemType, columns: ColumnMap[], rows: string[][], allowedAttributeTypes: AttributeType[],
                                      connectionRules: ConnectionRule[], authentication: UserInfo) {
    const logger = new Logger();
    const nameColumnId = columns.findIndex(c => c.targetType === targetTypeValues[0]);
    const linkDescriptionId = columns.findIndex(c => c.targetType === targetTypeValues[4]);
    const linkAddressId = columns.findIndex(c => c.targetType === targetTypeValues[5]);
    let itemPromises: Promise<IConfigurationItem | null>[] = [];
    let ruleIds: string[] = [];
    const rowsToIgnore: number[] = [];
    const names: string[] = [];
    rows.forEach((row, index) => {
        const itemName = row[nameColumnId];
        if (itemName === '') { // ignore empty lines
            logger.log(importIgnoringEmptyNameMsg, index);
            rowsToIgnore.push(index);
        } else if (names.includes(itemName.toLocaleLowerCase())) { // also ignore duplicate lines
            logger.log(importIgnoringDuplicateNameMsg, index, itemName);
            rowsToIgnore.push(index);
        } else {
            names.push(itemName.toLocaleLowerCase());
            itemPromises.push(configurationItemFindOneByNameAndTypePopulated(itemName, itemType.id));
            columns.forEach(col => {
                if (col.targetType === targetTypeValues[2] || col.targetType === targetTypeValues[3]) {
                    ruleIds.push(col.targetId);
                }
            });
        }
    });
    while (rowsToIgnore.length > 0) {
        rows.splice(rowsToIgnore.pop()!, 1);
    }
    ruleIds = [...new Set(ruleIds)];
    const configurationItems = await Promise.all(itemPromises);
    const existingItemIds = configurationItems.filter(i => !!i).map(i => i!._id);
    const allowedAttributeTypeIds = allowedAttributeTypes.map(a => a.id);
    const connectionsPromise: Promise<IConnection[]> = connectionModel.find({$and: [
        {$or: [{upperItem: {$in: existingItemIds}}, {lowerItem: {$in: existingItemIds}}]},
        {connectionRule: {$in: ruleIds}}
    ]}).populate({path: 'upperItem', select: ['name', 'type']}).populate({path: 'lowerItem', select: ['name', 'type']}).exec();
    itemPromises = [];
    rows.forEach((row, index) => {
        const item = configurationItems[index];
        let attributes: {type: string, value: string, typeName: string}[] = [];
        row.forEach((cell, colindex) => {
            const col = columns[colindex];
            if (col.targetType === targetTypeValues[1] && cell !== '') {
                if (allowedAttributeTypeIds.includes(col.targetId)) {
                    const attributeType = allowedAttributeTypes.find(t => t.id === col.targetId);
                    if (new RegExp(attributeType!.validationExpression).test(cell)) {
                        attributes.push({
                            type: col.targetId,
                            value: cell,
                            typeName: allowedAttributeTypes.find(at => at.id === col.targetId)!.name,
                        });
                    } else {
                        logger.log(invalidAttributeValueMsg, index, col.targetId, cell, Severity.error);
                    }
                } else {
                    logger.log(disallowedAttributeTypeMsg, index, col.targetId, cell, Severity.error);
                }
            }
        });
        const uri = linkAddressId >= 0 && validURL(row[linkAddressId]) ? row[linkAddressId].toLocaleLowerCase() : undefined;
        const description = linkDescriptionId < 0 ? uri : row[linkDescriptionId] ? row[linkDescriptionId] : uri;
        const links = uri ?  [{uri, description}] : [];
        if (item) {
            // update existing item
            let changed = false;
            if (!item.responsibleUsers.map(u => u.name).includes(authentication.accountName)) {
                item.responsibleUsers.push({_id: authentication.id} as IUser);
                changed = true;
            }
            changed = updateAttributes(attributes, item, changed, allowedAttributeTypes, logger, index);
            links.forEach(l => {
                const link = item.links.find(li => li.uri.toLocaleLowerCase() === l.uri.toLocaleLowerCase());
                if (link) {
                    if (link.description !== l.description) {
                        link.description = l.description!;
                        changed = true;
                    }
                } else {
                    item.links.push(l as unknown as ILink);
                    changed = true;
                }
            });
            if (changed) {
                itemPromises.push(item.save().then(populateItem).then(updatedItem => {
                    configurationItems[index] = updatedItem!;
                    logger.log(importItemUpdatedMsg, index, updatedItem!.name);
                    const historicItem = buildHistoricItemVersion(updatedItem!, authentication.accountName);
                    updateItemHistory(updatedItem!._id, historicItem);
                    return updatedItem!;
                }));
            }
        } else {
            // create new item
            attributes = attributes.filter(a => a.value.toLocaleLowerCase() !== deleteValue);
            itemPromises.push(configurationItemModel.create({
                name: row[nameColumnId],
                type: itemType.id,
                typeName: itemType.name,
                typeColor: itemType.backColor,
                responsibleUsers: [{_id: authentication.id} as IUser],
                attributes,
                links,
            }).then(newItem => newItem.populate({path: 'responsibleUsers', select: 'name'}).execPopulate())
            .then(newItem => {
                configurationItems[index] = newItem;
                historicCiModel.create({ _id: newItem._id, typeId: newItem.type, typeName: newItem.typeName });
                logger.log(importItemCreatedMsg, index, newItem.name);
                return newItem;
            }));
        }
    });
    // wait for last update or create to finish
    await Promise.all(itemPromises);
    // then look at connections
    if (ruleIds.length > 0) {
        const connections = await connectionsPromise;
        const countStore = new ItemConnectionsCountStore();
        const {protoConnectionsToLower, protoConnectionsToUpper} =
            await retrieveConnections(rows, columns, connectionRules, configurationItems, connections, countStore, authentication);
        await countStore.waitForFinish();
        const connectionPromises: Promise<void>[] = [];
        protoConnectionsToUpper.forEach(cc => {
            if (!new RegExp(cc.rule.validationExpression).test(cc.description)) {
                logger.log(invalidDescriptionMsg, cc.index, cc.lowerItem.name + ' -> ' + cc.upperItemName, cc.description, Severity.error);
                return;
            }
            if (cc.connection) {
                if (cc.connection.description !== cc.description) {
                    cc.connection.description = cc.description;
                    connectionPromises.push(cc.connection.save().then(c =>
                        logger.log(importConnectionUpdatedMsg, cc.index, cc.lowerItem.name + ' -> ' + cc.upperItemName, c.description))
                    );
                }
            } else if (cc.upperItem) {
                if (!countStore.hasFreeConnectionsToLower(cc.upperItem, cc.rule)) {
                    logger.log(maximumNumberOfConnectionsToUpperExceededMsg, cc.index, cc.lowerItem.name, cc.upperItemName, Severity.error);
                } else if (!countStore.hasFreeConnectionsToUpper(cc.lowerItem, cc.rule)) {
                    logger.log(maximumNumberOfConnectionsToLowerExceededMsg, cc.index, cc.lowerItem.name, cc.upperItemName, Severity.error);
                } else {
                    connectionPromises.push(connectionModel.create({
                        connectionRule: cc.rule.id,
                        description: cc.description,
                        upperItem: cc.upperItem._id,
                        lowerItem: cc.lowerItem._id,
                    }).then(c => {
                        createHistoricConnection(c);
                        logger.log(importConnectionCreatedMsg, cc.index, cc.lowerItem.name + ' -> ' + cc.upperItemName, c.description);
                    }));
                }
            } else {
                logger.log(noItemFoundMsg, cc.index, cc.upperItemName, cc.rule.upperItemTypeId, Severity.error);
            }
        });
        protoConnectionsToLower.forEach(cc => {
            if (!new RegExp(cc.rule.validationExpression).test(cc.description)) {
                logger.log(invalidDescriptionMsg, cc.index, cc.upperItem.name + ' -> ' + cc.lowerItemName, cc.description, Severity.error);
                return;
            }
            if (cc.connection) {
                if (cc.connection.description !== cc.description) {
                    cc.connection.description = cc.description;
                    connectionPromises.push(cc.connection.save().then(c => {
                        updateHistoricConnection(c, false);
                        logger.log(importConnectionUpdatedMsg, cc.index, cc.upperItem.name + ' -> ' + cc.lowerItemName, c.description);
                    }));
                }
            } else if (cc.lowerItem) {
                if (!countStore.hasFreeConnectionsToUpper(cc.lowerItem, cc.rule)) {
                    logger.log(maximumNumberOfConnectionsToLowerExceededMsg, cc.index, cc.upperItem.name, cc.lowerItemName, Severity.error);
                } else if (!countStore.hasFreeConnectionsToLower(cc.upperItem, cc.rule)) {
                    logger.log(maximumNumberOfConnectionsToUpperExceededMsg, cc.index, cc.upperItem.name, cc.lowerItemName, Severity.error);
                } else {
                    connectionPromises.push(connectionModel.create({
                        connectionRule: cc.rule.id,
                        description: cc.description,
                        upperItem: cc.upperItem._id,
                        lowerItem: cc.lowerItem._id,
                    }).then(c => {
                        createHistoricConnection(c);
                        logger.log(importConnectionCreatedMsg, cc.index, cc.upperItem.name + ' -> ' + cc.lowerItemName, c.description);
                    }));
                }
            } else {
                logger.log(noItemFoundMsg, cc.index, cc.lowerItemName, cc.rule.lowerItemTypeId, Severity.error);
            }
        });
        await Promise.all(connectionPromises);
    }
    return logger.messages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

enum Severity {
    info = 0,
    waring = 1, // not used yet
    error = 2,
    fatal = 3, // not used yet
}

async function retrieveConnections(rows: string[][], columns: ColumnMap[], connectionRules: ConnectionRule[], configurationItems: (IConfigurationItem | null)[],
                                   connections: IConnection[], countStore: ItemConnectionsCountStore, authentication: UserInfo) {
    interface IConnectionContainer {
        rule: ConnectionRule;
        description: string;
        index: number;
        connection?: IConnection;
    }
    interface IConnectionToUpperContainer extends IConnectionContainer {
        upperItemName: string;
        lowerItem: IConfigurationItem;
        upperItem?: IConfigurationItem | null;
    }

    const protoConnectionsToUpper: IConnectionToUpperContainer[] = [];
    interface IConnectionToLowerContainer extends IConnectionContainer {
        lowerItemName: string;
        upperItem: IConfigurationItem;
        lowerItem?: IConfigurationItem | null;
    }

    const protoConnectionsToLower: IConnectionToLowerContainer[] = [];
    const targetItemPromises: Promise<IConfigurationItem | null>[] = [];
    rows.forEach((row, index) => {
        const item = configurationItems[index];
        if (item) {
            const connectionsToLower = connections.filter(c => (c.upperItem as IConfigurationItem)._id.toString() === item._id.toString());
            const connectionsToUpper = connections.filter(c => (c.lowerItem as IConfigurationItem)._id.toString() === item._id.toString());
            row.forEach((cell, colindex) => {
                const col = columns[colindex];
                const cellContent = splitConnection(cell);
                const rule = connectionRules.find(cr => cr.id === col.targetId)!;
                switch (col.targetType) {
                    case targetTypeValues[2]: // connection to upper
                        const protoConnectionToUpper: IConnectionToUpperContainer = {
                            upperItemName: cellContent.itemName,
                            lowerItem: item,
                            description: cellContent.description,
                            index,
                            rule,
                            connection: connectionsToUpper.find(c => c.connectionRule.toString() === rule.id &&
                                (c.upperItem as IConfigurationItem).name.toLocaleLowerCase() === cellContent.itemName.toLocaleLowerCase()),
                        };
                        protoConnectionsToUpper.push(protoConnectionToUpper);
                        if (!protoConnectionToUpper.connection) {
                            targetItemPromises.push(configurationItemFindOneByNameAndTypePopulated(protoConnectionToUpper.upperItemName,
                                protoConnectionToUpper.rule.upperItemTypeId)
                                .then(i => {
                                    protoConnectionToUpper.upperItem = i;
                                    if (i) {
                                        countStore.addLowerItemAndRule(item, rule);
                                        countStore.addUpperItemAndRule(i, rule);
                                        // user must have responsibility for upper item to connect to any lower item
                                        if (!i.responsibleUsers.map(u => u.toString()).includes(authentication.id)) {
                                            i.responsibleUsers.push({_id: authentication.id} as IUser);
                                            i.save();
                                            const historicItem = buildHistoricItemVersion(i, authentication.accountName);
                                            updateItemHistory(i._id, historicItem);
                                        }
                                    }
                                    return i;
                                })
                            );
                        }
                        break;
                    case targetTypeValues[3]: // connnection to lower
                        const protoConnectionToLower: IConnectionToLowerContainer = {
                            lowerItemName: cellContent.itemName,
                            upperItem: item,
                            description: cellContent.description,
                            index,
                            rule,
                            connection: connectionsToLower.find(c => c.connectionRule.toString() === rule.id &&
                                (c.lowerItem as IConfigurationItem).name.toLocaleLowerCase() === cellContent.itemName.toLocaleLowerCase()),
                        };
                        protoConnectionsToLower.push(protoConnectionToLower);
                        if (!protoConnectionToLower.connection) {
                            targetItemPromises.push(configurationItemFindOneByNameAndTypePopulated(protoConnectionToLower.lowerItemName,
                                protoConnectionToLower.rule.lowerItemTypeId).then(i => {
                                protoConnectionToLower.lowerItem = i;
                                if (i) {
                                    countStore.addUpperItemAndRule(item, rule);
                                    countStore.addLowerItemAndRule(i, rule);
                                }
                                return i;
                            }));
                        }
                        break;
                }
            });
        }
    });
    await Promise.all(targetItemPromises);
    return {protoConnectionsToLower, protoConnectionsToUpper};
}

function splitConnection(value: string) {
    return {
        itemName: value.includes('|') ? value.split('|', 2)[0].trim() : value,
        description: value.includes('|') ? value.split('|', 2)[1].trim() : '',
    };
}

function updateAttributes(attributes: { type: string; value: string; }[], item: IConfigurationItem, changed: boolean,
                          allowedAttributeTypes: AttributeType[], logger: Logger, index: number) {
    attributes.forEach(a => {
        const attribute = item.attributes.find(aa => aa.type.toString() === a.type);
        if (attribute) {
            if (a.value === deleteValue) {
                item.attributes.splice(item.attributes.findIndex(aa => aa.type.toString() === a.type), 1);
                changed = true;
            } else if (a.value === '') {
                // do nothing
            } else if (attribute.value !== a.value) {
                const attributeType = allowedAttributeTypes.find(t => t.id === a.type);
                if (new RegExp(attributeType!.validationExpression).test(a.value)) {
                    attribute.value = a.value;
                    changed = true;
                } else {
                    logger.log(invalidAttributeValueMsg, index, a.type, a.value, Severity.error);
                }
            }
        } else {
            if (a.value !== deleteValue && a.value !== '') {
                item.attributes.push({ type: a.type, typeName: allowedAttributeTypes.find(at => at.id === a.type)!.name, value: a.value } as unknown as IAttribute);
                changed = true;
            }
        }
    });
    return changed;
}

class Logger {
    constructor(public messages: LineMessage[] = []) {}

    log(message: string, index: number = -1, subject?: string, details?: string, severity: Severity = Severity.info) {
        this.messages.push({index, subject, message, details, severity});
    }
}

class ItemConnectionsCountStore {
    private itemToUpperCount = new Map<string, number>();
    private itemToLowerCount = new Map<string, number>();
    private itemToUpperIds: string[] = [];
    private itemToLowerIds: string[] = [];
    private promises: Promise<void>[] = [];
    private setCount(ids: string[], store: Map<string, number>, key: string, filter: any) {
        if (!ids.includes(key)) {
            ids.push(key);
            this.promises.push(connectionsCountByFilter(filter)
                .then(count => {
                    store.set(key, count);
                }));
        }
    }
    private getId = (item: IConfigurationItem, rule: ConnectionRule) => item._id.toString() + '|' + rule.id;

    addUpperItemAndRule(item: IConfigurationItem, rule: ConnectionRule) {
        const id = this.getId(item, rule);
        this.setCount(this.itemToUpperIds, this.itemToUpperCount, id, {upperItem: item._id, connectionRule: rule.id});
    }

    addLowerItemAndRule(item: IConfigurationItem, rule: ConnectionRule) {
        const id = this.getId(item, rule);
        this.setCount(this.itemToLowerIds, this.itemToLowerCount, id, {lowerItem: item._id, connectionRule: rule.id});
    }

    async waitForFinish() {
        await Promise.all(this.promises);
    }

    hasFreeConnectionsToLower(item: IConfigurationItem, rule: ConnectionRule) {
        const id = this.getId(item, rule);
        const count = this.itemToUpperCount.get(id) ?? 0;
        this.itemToLowerCount.set(id, Math.min(count + 1, rule.maxConnectionsToLower));
        return count < rule.maxConnectionsToLower;
    }

    hasFreeConnectionsToUpper(item: IConfigurationItem, rule: ConnectionRule) {
        const id = this.getId(item, rule);
        const count = this.itemToLowerCount.get(id) ?? 0;
        this.itemToLowerCount.set(id, Math.min(count + 1, rule.maxConnectionsToUpper));
        return count < rule.maxConnectionsToUpper;
    }
}
