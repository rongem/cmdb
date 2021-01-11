import { attributeGroupModel, IAttributeGroup } from '../../models/mongoose/attribute-group.model';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { disallowedDeletionOfAttributeGroupMsg, nothingChanged } from '../../util/messages.constants';
import { attributeTypeModelCount } from './attribute-type.al';
import { nameField } from '../../util/fields.constants';

export function attributeGroupModelFindAll(): Promise<AttributeGroup[]> {
    return attributeGroupModel.find().sort(nameField)
        .then((attributeGroups: IAttributeGroup[]) => attributeGroups.map(ag => new AttributeGroup(ag)));
}

export function attributeGroupModelFind(filter: any) {
    return attributeGroupModel.find(filter).sort(nameField)
        .then((attributeGroups: IAttributeGroup[]) => attributeGroups.map(ag => new AttributeGroup(ag)));
}

export function attributeGroupModelFindSingle(id: string) {
    return attributeGroupModel.findById(id)
        .then((attributeGroup: IAttributeGroup) => {
            if (!attributeGroup) {
                throw notFoundError;
            }
            return new AttributeGroup(attributeGroup);
        });
}

export async function attributeGroupModelCreate(name: string) {
    const attributeGroup = await attributeGroupModel.create({ name });
    return new AttributeGroup(attributeGroup);
}

export async function attributeGroupModelUpdate(id: string, name: string) {
    let attributeGroup: IAttributeGroup = await attributeGroupModel.findById(id);
    if (!attributeGroup) {
        throw notFoundError;
    }
    let changed = false;
    if (attributeGroup.name !== name) {
        attributeGroup.name = name;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChanged);
    }
    attributeGroup = await attributeGroup.save();
    return new AttributeGroup(attributeGroup);
}

export async function attributeGroupModelDelete(id: string) {
    let attributeGroup: IAttributeGroup;
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

