import { Types } from 'mongoose';
import { attributeTypeModel, IAttributeType } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { disallowedDeletionOfAttributeTypeMsg, nothingChangedMsg } from '../../util/messages.constants';
import { itemTypeModelGetAttributeGroupIdsForItemType } from './item-type.al';
import { configurationItemsCount } from '../item-data/configuration-item.al';
import { buildHistoricItemVersion, updateItemHistory } from '../item-data/historic-item.al';
import { IAttributeGroup } from '../../models/mongoose/attribute-group.model';

export function attributeTypeModelFindAll(): Promise<AttributeType[]> {
    return attributeTypeModel.find().sort('name')
        .then((attributeTypes: IAttributeType[]) => attributeTypes.map(ag => new AttributeType(ag)));
}

export function attributeTypeModelFind(filter: any): Promise<AttributeType[]> {
    return attributeTypeModel.find(filter).sort('name')
        .then((attributeTypes: IAttributeType[]) => attributeTypes.map(ag => new AttributeType(ag)));
}

export async function attributeTypeModelFindSingle(id: string): Promise<AttributeType> {
    const attributeType = await attributeTypeModel.findById(id);
    if (!attributeType) {
        throw notFoundError;
    }
    return new AttributeType(attributeType);
}

export async function attributeTypeModelSingleExists(id: string) {
    const count: number = await attributeTypeModel.findById(id).countDocuments();
    return count > 0;
}

export function attributeTypeModelCount(filter: any): Promise<number> {
    return attributeTypeModel.find(filter).countDocuments().exec();
}

export async function attributeTypeModelCountAttributes(id: string): Promise<number> {
    const exists = await attributeTypeModelSingleExists(id);
    if (!exists) {
        throw notFoundError;
    }
    return configurationItemsCount({attributes:  {$elemMatch: { type: id }}});
}

export async function attributeTypeModelGetAttributeTypesForItemType(itemTypeId: string) {
    const ids = await itemTypeModelGetAttributeGroupIdsForItemType(itemTypeId);
    const attributeTypes = await attributeTypeModelFind({attributeGroup: {$in: ids}});
    return attributeTypes;
}

export async function attributeTypeModelCreate(name: string, attributeGroup: string, validationExpression: string) {
    let attributeType = await attributeTypeModel.create({ name, attributeGroup, validationExpression});
    attributeType =  await attributeType.populate({path: 'attributeGroup', select: 'name'}).execPopulate();
    return new AttributeType(attributeType);
}

export async function attributeTypeModelUpdate(id: string, name: string, attributeGroupId: string, validationExpression: string) {
    let attributeType: IAttributeType | null = await attributeTypeModel.findById(id).populate({path: 'attributeGroup', select: 'name'});
    if (!attributeType) {
        throw notFoundError;
    }
    let changed = false;
    if (attributeType.name !== name) {
        attributeType.name = name;
        changed = true;
        // change the attribute type in all items that use this item type
        const itemIds = (await configurationItemModel.find({'attributes.type': attributeType._id, 'attributes.typeName': {$ne: attributeType.name}})).map(i => i._id);
        if (itemIds.length > 0) {
            await configurationItemModel.updateMany({'attributes.type': attributeType._id, 'attributes.typeName': {$ne: attributeType.name}},
                {$set: {'attributes.$.typeName': attributeType.name}}).exec();
            const changedItems = await configurationItemModel.find({_id: {$in: itemIds}})
                .populate({ path: 'responsibleUsers', select: 'name' });
            for (let index = 0; index < changedItems.length; index++) {
                const item = changedItems[index];
                updateItemHistory(item!._id, buildHistoricItemVersion(item!, 'SYSTEM'), false);
            }
        }
    }
    const compareGroupId = (attributeType.attributeGroup as IAttributeGroup)._id.toString();
    if (compareGroupId !== attributeGroupId) {
        attributeType.attributeGroup = new Types.ObjectId(attributeGroupId);
        changed = true;
    }
    if (attributeType.validationExpression !== validationExpression) {
        attributeType.validationExpression = validationExpression;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    attributeType = await attributeType.save();
    attributeType = await attributeType.populate({path: 'attributeGroup', select: 'name'}).execPopulate();
    return new AttributeType(attributeType);
}

export async function attributeTypeModelDelete(id: string) {
    let attributeType: IAttributeType | null;
    let canDelete: boolean;
    [attributeType, canDelete] = await Promise.all([
        attributeTypeModel.findById(id),
        attributeTypeModelCanDelete(id), // tbd: maybe delete attributes in schema instead of throwing an error ?
    ]);
    if (!attributeType) {
        throw notFoundError;
    }
    if (!canDelete) {
        throw new HttpError(422, disallowedDeletionOfAttributeTypeMsg);
    }
    attributeType = await attributeType.remove();
    return new AttributeType(attributeType);
}

export async function attributeTypeModelCanDelete(id: string) {
    const docs = await configurationItemsCount({attributes: {$elemMatch: {type: id}}});
    return docs === 0;
}
