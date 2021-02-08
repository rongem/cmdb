import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { attributeTypeModel, IAttributeType } from '../../models/mongoose/attribute-type.model';
import { connectionRuleModel, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../../models/meta-data/item-type-attribute-group-mapping.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import {
    disallowedDeletionOfItemTypeMsg,
    nothingChangedMsg,
    disallowedDeletionOfItemTypeWithItemsOrRulesMsg,
} from '../../util/messages.constants';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { connectionTypeModelFindSingle } from './connection-type.al';
import { attributeTypeModelFindSingle } from './attribute-type.al';

export async function itemTypeModelFindAll(): Promise<ItemType[]> {
    const itemTypes = await itemTypeModel.find().sort('name').populate('attributeGroups');
    return itemTypes.map(ag => new ItemType(ag));
}

export async function itemTypeModelFind(filter: any): Promise<ItemType[]> {
    const itemTypes = await itemTypeModel.find(filter).sort('name').populate('attributeGroups');
    return itemTypes.map(ag => new ItemType(ag));
}

export async function itemTypeModelFindOne(name: string) {
    const itemType = await itemTypeModel.findOne({ name }).populate('attributeGroups');
    return itemType ? new ItemType(itemType) : undefined;
}

export async function itemTypeModelFindSingle(id: string): Promise<ItemType> {
    const itemType = await itemTypeModel.findById(id).populate('attributeGroups');
    if (!itemType) {
        throw notFoundError;
    }
    return new ItemType(itemType);
}

export async function itemTypeModelSingleExists(id: string) {
    const count: number = await itemTypeModel.findById(id).countDocuments();
    return count > 0;
}

export async function itemTypeModelCountAttributesForMapping(attributeGroupId: string, itemTypeId: string) {
    const attributeTypes = (await attributeTypeModel.find({ attributeGroup: attributeGroupId })).map((a: IAttributeType) => a._id);
    const count = await configurationItemModel.find({ type: itemTypeId, 'attributes.type': { $in: attributeTypes } }).countDocuments();
    return count;
}

export async function itemTypeModelGetAllMappings() {
    const itemTypes: IItemType[] = await itemTypeModel.find();
    return ItemTypeAttributeGroupMapping.createAllMappings(itemTypes);
}

export async function itemTypeModelGetItemTypesForUpperItemTypeAndConnection(itemId: string, connectionTypeId: string) {
    let itemType: IItemType | null;
    let connectionType: ConnectionType;
    [itemType, connectionType] = await Promise.all([
        itemTypeModel.findById(itemId),
        connectionTypeModelFindSingle(connectionTypeId),
    ]);
    if (!itemType || !connectionType) {
        throw notFoundError;
    }
    const ids = await connectionRuleModel.find({ upperItemType: itemType._id, connectionType: connectionType.id })
        .then(rs => rs.map(r => r.lowerItemType));
    const itemTypes: ItemType[] = await itemTypeModel.find({ _id: { $in: ids } }).sort({name: 1})
        .then(its => its.map(it => new ItemType(it)));
    return itemTypes;
}

export async function itemTypeModelGetItemTypesForLowerItemTypeAndConnection(itemId: string, connectionTypeId: string) {
    let itemType: IItemType | null;
    let connectionType: ConnectionType;
    [itemType, connectionType] = await Promise.all([
        itemTypeModel.findById(itemId),
        connectionTypeModelFindSingle(connectionTypeId),
    ]);
    if (!itemType || !connectionType) {
        throw notFoundError;
    }
    const ids = await connectionRuleModel.find({ lowerItemType: itemType._id, connectionType: connectionType.id })
        .then(rs => rs.map(r => r.upperItemType));
    const itemTypes: ItemType[] = await itemTypeModel.find({ _id: { $in: ids } }).sort({name: 1})
        .then(its => its.map(it => new ItemType(it)));
    return itemTypes;
}

export async function itemTypeModelGetItemTypesByAllowedAttributeType(attributeTypeId: string) {
    const attributeType = await attributeTypeModelFindSingle(attributeTypeId);
    const itemTypes: ItemType[] = await itemTypeModel.find({ attributeGroups: attributeType.attributeGroupId })
        .then(its => its.map(it => new ItemType(it)));
    return itemTypes;
}

export async function itemTypeModelGetAttributeGroupIdsForItemType(id: string) {
    const itemType = await itemTypeModel.findById(id);
    if (!itemType) {
        throw notFoundError;
    }
    const ids = itemType.attributeGroups ? itemType.attributeGroups.map(ag => ag.toString()) : [];
    return ids;
}


export async function itemTypeModelCreate(name: string, color: string, attributeGroups: string[]) {
    let itemType = await itemTypeModel.create({ name, color, attributeGroups });
    if (!itemType) {
        throw new HttpError(422, 'not created');
    }
    itemType = await itemType.populate({ path: 'attributeGroups', select: 'name' }).execPopulate();
    return new ItemType(itemType);
}

export async function itemTypeModelUpdate(id: string, name: string, color: string, attributeGroups: string[]) {
    let itemType = await itemTypeModel.findById(id);
    if (!itemType) {
        throw notFoundError;
    }
    let changed = false;
    if (itemType.name !== name) {
        itemType.name = name;
        changed = true;
    }
    if (itemType.color !== color) {
        itemType.color = color;
        changed = true;
    }
    const existingAttributeGroupIds: string[] = itemType.attributeGroups.map(ag => ag.toString());
    if (attributeGroups.length > 0) {
        attributeGroups.forEach(ag => {
            if (existingAttributeGroupIds.includes(ag)) {
                existingAttributeGroupIds.splice(existingAttributeGroupIds.indexOf(ag), 1);
            } else {
                itemType!.attributeGroups.push(ag);
                changed = true;
            }
        });
    }
    existingAttributeGroupIds.forEach(agid => {
        itemType!.attributeGroups.splice(itemType!.attributeGroups.findIndex(a => a.toString() === agid), 1);
        changed = true;
    });
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    itemType = await itemType.save();
    if (!itemType) {
        throw new HttpError(422, 'update failed');
    }
    itemType = await itemType.populate({ path: 'attributeGroups', select: 'name' }).execPopulate();
    return new ItemType(itemType);
}

export async function itemTypeModelDelete(itemId: string) {
    let itemType = await itemTypeModel.findById(itemId);
    if (!itemType) {
        throw notFoundError;
    }
    if (itemType.attributeGroups && itemType.attributeGroups.length > 0) {
        throw new HttpError(422, disallowedDeletionOfItemTypeMsg);
    }
    const canDelete = await itemTypeModelCanDelete(itemId);
    if (!canDelete)
    {
        throw new HttpError(422, disallowedDeletionOfItemTypeWithItemsOrRulesMsg);
    }
    itemType = await itemType.remove();
    return new ItemType(itemType);
}

export async function itemTypeModelCanDelete(itemId: string) {
    const [items, rules] = await Promise.all([
        configurationItemModel.find({ type: itemId }).countDocuments(),
        connectionRuleModel.find({$or: [{upperItemType: itemId}, {lowerItemType: itemId}]}).countDocuments()
    ]);
    return (+items + +rules) === 0;
}



