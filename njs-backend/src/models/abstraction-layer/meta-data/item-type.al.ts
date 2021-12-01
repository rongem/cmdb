import { Types } from 'mongoose';

import { attributeTypeModel, IAttributeType } from '../../mongoose/attribute-type.model';
import { connectionRuleModel } from '../../mongoose/connection-rule.model';
import { IItemType, itemTypeModel } from '../../mongoose/item-type.model';
import { ItemType } from '../../meta-data/item-type.model';
import { notFoundError } from '../../../controllers/error.controller';
import { HttpError } from '../../../rest-api/httpError.model';
import {
    disallowedDeletionOfItemTypeMsg,
    nothingChangedMsg,
    disallowedDeletionOfItemTypeWithItemsOrRulesMsg,
} from '../../../util/messages.constants';
import { ConnectionType } from '../../meta-data/connection-type.model';
import { connectionTypeModelFindSingle } from './connection-type.al';
import { attributeTypeModelFindAll, attributeTypeModelFindSingle } from './attribute-type.al';
import { configurationItemsCount } from '../item-data/configuration-item.al';
import { IUser } from '../../mongoose/user.model';
import { configurationItemModel } from '../../mongoose/configuration-item.model';
import { buildHistoricItemVersion, updateItemHistory } from '../item-data/historic-item.al';
import { IAttributeGroup } from '../../mongoose/attribute-group.model';
import { UserAccount } from '../../item-data/user-account.model';

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

export const itemTypeModelValidateIdExists = async (value: string) => {
    try {
        const count = await itemTypeModel.findById(value).countDocuments();
        return count > 0 ? Promise.resolve() : Promise.reject();
    }
    catch (err) {
        return Promise.reject(err);
    }
};

export async function itemTypeModelSingleExists(id: string) {
    const count: number = await itemTypeModel.findById(id).countDocuments();
    return count > 0;
}

export async function itemTypeModelCountAttributesForMapping(attributeGroupId: string, itemTypeId: string) {
    const attributeTypes = (await attributeTypeModel.find({ attributeGroup: attributeGroupId })).map((a: IAttributeType) => a._id);
    const count = await configurationItemsCount({ type: itemTypeId, 'attributes.type': { $in: attributeTypes } });
    return count;
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
    const itemTypes: ItemType[] = await itemTypeModel.find({ attributeGroups: attributeType.attributeGroupId as unknown as IAttributeGroup['_id'][] })
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
    itemType = await itemType.populate({ path: 'attributeGroups', select: 'name' });
    return new ItemType(itemType);
}

export async function itemTypeModelUpdate(id: string, name: string, color: string, attributeGroups: string[], user: UserAccount) {
    let [itemType, attributeTypes] = await Promise.all([
        itemTypeModel.findById(id),
        attributeTypeModelFindAll(),
    ]);
    if (!itemType) {
        throw notFoundError;
    }
    let changed = false;
    let changedNameOrColor = false;
    if (itemType.name !== name) {
        itemType.name = name;
        changed = true;
        changedNameOrColor = true;
    }
    if (itemType.color !== color) {
        itemType.color = color;
        changed = true;
        changedNameOrColor = true;
    }
    const existingAttributeGroupIds: string[] = itemType.attributeGroups.map(ag => ag.toString());
    if (attributeGroups.length > 0) {
        attributeGroups.forEach(ag => {
            if (existingAttributeGroupIds.includes(ag)) {
                // remove attribute groups from existing attribute groups if they are still there, so only those which are removed remain
                existingAttributeGroupIds.splice(existingAttributeGroupIds.indexOf(ag), 1);
            } else {
                // add new attribute group
                itemType!.attributeGroups.push(new Types.ObjectId(ag));
                changed = true;
            }
        });
    }
    // remove item attributes that are no longer inside the item type
    if (existingAttributeGroupIds.length > 0) {
        const attributeTypeIds = attributeTypes.filter(at => existingAttributeGroupIds.includes(at.attributeGroupId)).map(at => at.id);
        const itemIds = (await configurationItemModel.find({type: id, attributes: {$elemMatch: {type: {$in: attributeTypeIds}}}})).map(i => i._id.toString());
        await configurationItemModel.updateMany(
            {type: id, attributes: {$elemMatch: {type: {$in: attributeTypeIds}}}},
            {$pull: {attributes: {type: {$in: attributeTypeIds}}}}
        ).exec();
        const changedItems = await configurationItemModel.find({_id: {$in: itemIds}})
            .populate({ path: 'responsibleUsers', select: 'name' });
        for (let index = 0; index < changedItems.length; index++) {
            const item = changedItems[index];
            updateItemHistory(item._id, buildHistoricItemVersion(item, user.accountName), false);
        }
        existingAttributeGroupIds.forEach(agid => {
            itemType!.attributeGroups.splice(itemType!.attributeGroups.findIndex(a => a.toString() === agid), 1);
            changed = true;
        });
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    itemType = await itemType.save();
    if (!itemType) {
        throw new HttpError(422, 'update failed');
    }
    if (changedNameOrColor) {
        // change the copy of the item type name and / or color in all items of that type
        const itemIds = (await configurationItemModel.find({type: itemType._id})).map(i => i._id);
        if (itemIds.length > 0) {
            await configurationItemModel.updateMany({type: itemType._id},
                {$set: {typeName: itemType.name, typeColor: itemType.color}}).exec();
            const changedItems = await configurationItemModel.find({_id: {$in: itemIds}})
                .populate({ path: 'responsibleUsers', select: 'name' });
            for (let index = 0; index < changedItems.length; index++) {
                const item = changedItems[index];
                updateItemHistory(item!._id, buildHistoricItemVersion(item!, user.accountName), false);
            }
        }
    }
    itemType = await itemType.populate({ path: 'attributeGroups', select: 'name' });
    return new ItemType(itemType);
}

export async function itemTypeModelDelete(itemId: string) {
    let itemType = await itemTypeModel.findById(itemId);
    if (!itemType) {
        throw notFoundError;
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
        configurationItemsCount({ type: itemId }),
        connectionRuleModel.find({$or: [{upperItemType: new Types.ObjectId(itemId)}, {lowerItemType: new Types.ObjectId(itemId)}]}).countDocuments()
    ]);
    return (+items + +rules) === 0;
}



