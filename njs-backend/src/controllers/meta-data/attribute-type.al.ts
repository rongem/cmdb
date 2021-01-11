import { attributeTypeModel, IAttributeType, IAttributeTypePopulated } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { nameField, attributeGroupField } from '../../util/fields.constants';
import { disallowedDeletionOfAttributeTypeMsg, nothingChanged } from '../../util/messages.constants';

export function attributeTypeModelFindAll(): Promise<AttributeType[]> {
    return attributeTypeModel.find().sort(nameField)
        .then((attributeTypes: IAttributeType[]) => attributeTypes.map(ag => new AttributeType(ag)));
}

export function attributeTypeModelFind(filter: any): Promise<AttributeType[]> {
    return attributeTypeModel.find(filter).sort(nameField)
        .then((attributeTypes: IAttributeType[]) => attributeTypes.map(ag => new AttributeType(ag)));
}

export function attributeTypeModelFindSingle(id: string): Promise<AttributeType> {
    return attributeTypeModel.findById(id)
        .then((attributeType: IAttributeType) => {
            if (!attributeType) {
                throw notFoundError;
            }
            return new AttributeType(attributeType);
        });
}

export function attributeTypeModelCount(filter: any): Promise<number> {
    return attributeTypeModel.find(filter).countDocuments();
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
        throw new HttpError(304, nothingChanged);
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
