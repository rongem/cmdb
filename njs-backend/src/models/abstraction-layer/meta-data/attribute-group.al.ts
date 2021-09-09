import { attributeGroupModel, IAttributeGroup } from '../../mongoose/attribute-group.model';
import { AttributeGroup } from '../../meta-data/attribute-group.model';
import { notFoundError } from '../../../controllers/error.controller';
import { HttpError } from '../../../rest-api/httpError.model';
import { disallowedDeletionOfAttributeGroupMsg, nothingChangedMsg } from '../../../util/messages.constants';
import { attributeTypeModelCount } from './attribute-type.al';
import { itemTypeModelGetAttributeGroupIdsForItemType } from './item-type.al';

export async function attributeGroupModelFindAll(): Promise<AttributeGroup[]> {
    const attributeGroups = await attributeGroupModel.find().sort('name');
    return attributeGroups.map(ag => new AttributeGroup(ag));
}

export async function attributeGroupModelFind(filter: any): Promise<AttributeGroup[]> {
    const attributeGroups = await attributeGroupModel.find(filter).sort('name');
    return attributeGroups.map(ag => new AttributeGroup(ag));
}

export async function attributeGroupModelFindSingle(id: string) {
    const attributeGroup = await attributeGroupModel.findById(id);
    if (!attributeGroup) {
        throw notFoundError;
    }
    return new AttributeGroup(attributeGroup);
}

export async function attributeGroupModelSingleExists(id: string) {
    const count: number = await attributeGroupModel.findById(id).countDocuments();
    return count > 0;
}

export const attributeGroupModelValidateIdExists = async (value: string) => {
    try {
        const count = await attributeGroupModel.findById(value).countDocuments();
        return count > 0 ? Promise.resolve() : Promise.reject();
    }
    catch (err) {
        return Promise.reject(err);
    }
};

export async function attributeGroupsModelGetAttributeGroupsInItemType(itemTypeId: string) {
    const ids = await itemTypeModelGetAttributeGroupIdsForItemType(itemTypeId);
    const attributeGroups = await attributeGroupModelFind({ _id: { $in: ids } });
    return attributeGroups;
}

export async function attributeGroupsModelGetAttributeGroupsNotInItemType(itemTypeId: string) {
    const ids = await itemTypeModelGetAttributeGroupIdsForItemType(itemTypeId);
    const attributeGroups = await attributeGroupModelFind({ _id: { $nin: ids } });
    return attributeGroups;
}

export async function attributeGroupModelCreate(name: string) {
    const attributeGroup = await attributeGroupModel.create({ name });
    return new AttributeGroup(attributeGroup);
}

export async function attributeGroupModelUpdate(id: string, name: string) {
    let attributeGroup = await attributeGroupModel.findById(id);
    if (!attributeGroup) {
        throw notFoundError;
    }
    let changed = false;
    if (attributeGroup.name !== name) {
        attributeGroup.name = name;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    attributeGroup = await attributeGroup.save();
    return new AttributeGroup(attributeGroup);
}

export async function attributeGroupModelDelete(id: string) {
    let attributeGroup: IAttributeGroup | null;
    let canDelete: boolean;
    [attributeGroup, canDelete] = await Promise.all([
        attributeGroupModel.findById(id), attributeGroupModelCanDelete(id)
    ]);
    if (!attributeGroup) {
        throw notFoundError;
    }
    if (!canDelete) {
        throw new HttpError(422, disallowedDeletionOfAttributeGroupMsg);
    }
    attributeGroup = await attributeGroup.remove();
    return new AttributeGroup(attributeGroup);
}

export async function attributeGroupModelCanDelete(id: string) {
    const docs = await attributeTypeModelCount({attributeGroup:  id});
    return docs === 0;
}

