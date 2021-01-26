import { attributeTypeModel, IAttributeType, IAttributeTypePopulated } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { nameField, attributeGroupField, attributesField, typeField } from '../../util/fields.constants';
import { disallowedDeletionOfAttributeTypeMsg, nothingChangedMsg } from '../../util/messages.constants';
import { itemTypeModelGetAttributeGroupIdsForItemType } from './item-type.al';

export function attributeTypeModelFindAll(): Promise<AttributeType[]> {
    return attributeTypeModel.find().sort(nameField)
        .then((attributeTypes: IAttributeType[]) => attributeTypes.map(ag => new AttributeType(ag)));
}

export function attributeTypeModelFind(filter: any): Promise<AttributeType[]> {
    return attributeTypeModel.find(filter).sort(nameField)
        .then((attributeTypes: IAttributeType[]) => attributeTypes.map(ag => new AttributeType(ag)));
}

export async function attributeTypeModelFindSingle(id: string): Promise<AttributeType> {
    const attributeType: IAttributeType = await attributeTypeModel.findById(id);
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
    return attributeTypeModel.find(filter).countDocuments();
}

export async function attributeTypeModelCountAttributes(id: string): Promise<number> {
    const exists = await attributeTypeModelSingleExists(id);
    if (!exists) {
        throw notFoundError;
    }
    const count: number = await configurationItemModel.find({[attributesField]:  {$elemMatch: { [typeField]: id }}}).countDocuments();
    return count;
}

export async function attributeTypeModelGetAttributeTypesForItemType(itemTypeId: string) {
    const ids = await itemTypeModelGetAttributeGroupIdsForItemType(itemTypeId);
    const attributeTypes = await attributeTypeModelFind({attributeGroup: {$in: ids}});
    return attributeTypes;
}

export async function attributeTypeModelCreate(name: string, attributeGroup: string, validationExpression: string) {
    let attributeType = await attributeTypeModel.create({ name, attributeGroup, validationExpression});
    attributeType =  await attributeType.populate({path: attributeGroupField, select: nameField}).execPopulate();
    return new AttributeType(attributeType);
}

export async function attributeTypeModelUpdate(id: string, name: string, attributeGroupId: string, validationExpression: string) {
    let attributeType: IAttributeTypePopulated = await attributeTypeModel.findById(id).populate({path: attributeGroupField, select: nameField});
    if (!attributeType) {
        throw notFoundError;
    }
    let changed = false;
    if (attributeType.name !== name) {
        attributeType.name = name;
        changed = true;
    }
    const compareGroupId = attributeType.attributeGroup._id.toString();
    if (compareGroupId !== attributeGroupId) {
        (attributeType as IAttributeType).attributeGroup = attributeGroupId;
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
    attributeType = await attributeType.populate({path: attributeGroupField, select: nameField}).execPopulate();
    return new AttributeType(attributeType);
}

export async function attributeTypeModelDelete(id: string) {
    let attributeType: IAttributeType;
    let canDelete: boolean;
    [attributeType, canDelete] = await Promise.all([
        attributeTypeModel.findById(id),
        attributeTypeModelCanDelete(id), // tbd: delete attributes in schema
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
    const docs = await configurationItemModel.find({attributes: {$elemMatch: {type: id}}}).countDocuments();
    return docs === 0;
}
