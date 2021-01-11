import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { attributeTypeModel, IAttributeType } from '../../models/mongoose/attribute-type.model';
import { connectionRuleModel, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { IItemType, IItemTypePopulated, itemTypeModel } from '../../models/mongoose/item-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../../models/meta-data/item-type-attribute-group-mapping.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import {
    idField,
    nameField,
    itemTypeIdField,
    attributeGroupIdField,
    attributeGroupsField,
    colorField,
    connectionTypeField,
} from '../../util/fields.constants';
import {
    disallowedDeletionOfItemTypeMsg,
    disallowedDeletionOfMappingMsg,
    nothingChanged,
    disallowedDeletionOfItemTypeWithItemsOrRulesMsg,
} from '../../util/messages.constants';
import { itemTypeCat, createCtx, updateCtx, deleteCtx, mappingCat } from '../../util/socket.constants';
import socket from '../socket.controller';

export function itemTypeModelFindAll(): Promise<ItemType[]> {
    return itemTypeModel.find().sort(nameField).populate(attributeGroupsField)
        .then((itemTypes: IItemType[]) => itemTypes.map(ag => new ItemType(ag)));
}

export function itemTypeModelFind(filter: any): Promise<ItemType[]> {
    return itemTypeModel.find(filter).sort(nameField).populate(attributeGroupsField)
        .then((itemTypes: IItemType[]) => itemTypes.map(ag => new ItemType(ag)));
}

export function itemTypeModelFindSingle(id: string): Promise<ItemType> {
    return itemTypeModel.findById(id).populate(attributeGroupsField)
        .then((itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            return new ItemType(itemType);
        });
}

export async function countAttributesForMapping(attributeGroupId: string, itemTypeId: string) {
    const attributeTypes = (await attributeTypeModel.find({ attributeGroup: attributeGroupId })).map((a: IAttributeType) => a._id);
    const count = await configurationItemModel.find({ type: itemTypeId, 'attributes.type': { $in: attributeTypes } }).countDocuments();
    return count;
}



