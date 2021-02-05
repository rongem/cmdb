import * as XLSX from 'xlsx';

import { HttpError } from '../../rest-api/httpError.model';
import {
    disallowedAttributeTypeMsg,
    importIgnoringDuplicateNameMsg,
    importIgnoringEmptyNameMsg,
    importItemCreatedMsg,
    importItemUpdatedMsg,
    invalidAttributeValueMsg,
    noFileMsg
} from '../../util/messages.constants';
import { IUser } from '../../models/mongoose/user.model';
import { ColumnMap } from '../../models/item-data/column-map.model';
import { deleteValue, targetTypeValues } from '../../util/values.constants';
import { configurationItemModel, IConfigurationItem, ILink } from '../../models/mongoose/configuration-item.model';
import { typeField, attributesField, nameField, responsibleUsersField } from '../../util/fields.constants';
import { connectionModel } from '../../models/mongoose/connection.model';
import { itemTypeModelFindSingle } from '../meta-data/item-type.al';
import { attributeTypeModelGetAttributeTypesForItemType } from '../meta-data/attribute-type.al';
import { connectionRuleModelFind } from '../meta-data/connection-rule.al';
import { LineMessage } from '../../models/item-data/line-message.model';
import { populateItem } from './configuration-item.al';
import { ItemType } from '../../models/meta-data/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { validURL } from '../../routes/validators';

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
    if (!file) {
        throw new HttpError(422, noFileMsg);
    }
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
                                      connectionRules: ConnectionRule[], authentication: IUser) {
    const logger = new Logger();
    const nameColumnId = columns.findIndex(c => c.targetType === targetTypeValues[0]);
    const linkDescriptionId = columns.findIndex(c => c.targetType === targetTypeValues[4]);
    const linkAddressId = columns.findIndex(c => c.targetType === targetTypeValues[5]);
    let itemPromises: Promise<IConfigurationItem | undefined>[] = [];
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
            itemPromises.push(configurationItemModel.findOne({name: { $regex: '^' + itemName + '$', $options: 'i' }, type: itemType.id})
                .populate({ path: typeField })
                .populate({ path: `${attributesField}.${typeField}`, select: nameField })
                .populate({ path: responsibleUsersField, select: nameField }));
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
    const connections = ruleIds.length > 0 ? await connectionModel.find({$and: [
        {$or: [{upperItem: {$in: existingItemIds}}, {lowerItem: {$in: existingItemIds}}]},
        {connectionRule: {$in: ruleIds}}
    ]}) : [];
    itemPromises = [];
    rows.forEach((row, index) => {
        const item = configurationItems[index];
        let attributes: {type: string, value: string}[] = [];
        row.forEach((cell, colindex) => {
            const col = columns[colindex];
            switch (col.targetType) {
                case targetTypeValues[1]: // attribute
                    if (cell !== '') {
                        if (allowedAttributeTypeIds.includes(col.targetId)) {
                            const attributeType = allowedAttributeTypes.find(t => t.id === col.targetId);
                            if (new RegExp(attributeType!.validationExpression).test(cell)) {
                                attributes.push({
                                    type: col.targetId,
                                    value: cell,
                                });
                            } else {
                                logger.log(invalidAttributeValueMsg, index, col.targetId, cell, Severity.error);
                            }
                        } else {
                            logger.log(disallowedAttributeTypeMsg, index, col.targetId, cell, Severity.error);
                        }
                    }
                    break;
                case targetTypeValues[2]: // connection to upper
                    break;
                case targetTypeValues[3]: // connnection to lower
                    break;
            }
        });
        const uri = linkAddressId >= 0 && validURL(row[linkAddressId]) ? row[linkAddressId].toLocaleLowerCase() : undefined;
        const description = linkDescriptionId < 0 ? uri : row[linkDescriptionId] ? row[linkDescriptionId] : uri;
        const links = uri ?  [{uri, description}] : [];
        if (item) {
            // update existing item
            let changed = false;
            changed = updateAttributes(attributes, item, changed, allowedAttributeTypes, logger, index);
            links.forEach(l => {
                const link = item.links.find(li => li.uri.toLocaleLowerCase() === l.uri);
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
                itemPromises.push(item.save().then(updatedItem => {
                    configurationItems[index] = updatedItem;
                    logger.log(importItemUpdatedMsg, index, updatedItem.name);
                    return updatedItem;
                }));
            }
        } else {
            // create new item
            attributes = attributes.filter(a => a.value.toLocaleLowerCase() !== deleteValue);
            itemPromises.push(configurationItemModel.create({
                name: row[nameColumnId],
                type: itemType.id,
                responsibleUsers: [authentication._id],
                attributes,
                links,
            }).then(newItem => {
                configurationItems[index] = newItem;
                logger.log(importItemCreatedMsg, index, newItem.name);
                return newItem;
            }));
        }
    });
    // wait for last update or create to finish
    await Promise.all(itemPromises);
    // then look at connections
    // tbd
    return logger.messages;
}

enum Severity {
    info = 0,
    waring = 1,
    error = 2,
    fatal = 3,
}

function updateAttributes(attributes: { type: string; value: string; }[], item: IConfigurationItem, changed: boolean,
                          allowedAttributeTypes: AttributeType[], logger: Logger, index: number) {
    attributes.forEach(a => {
        const attribute = item.attributes.find(aa => aa.type._id.toString() === a.type);
        if (attribute) {
            if (a.value === deleteValue) {
                item.attributes.splice(item.attributes.findIndex(aa => aa.type._id.toString() === a.type), 1);
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
                item.attributes.push({ type: a.type, value: a.value } as any);
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
