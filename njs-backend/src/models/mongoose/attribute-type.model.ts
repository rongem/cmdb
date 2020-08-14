import { Schema, Document, Types, Model, model, NativeError, Query } from 'mongoose';

import { attributeGroupModel, IAttributeGroup } from './attribute-group.model';
import { itemTypeModel } from './item-type.model';
import { configurationItemModel, IAttribute } from './configuration-item.model';
import { attributeGroupField, nameField, attributeGroupsField } from '../../util/fields.constants';
import { invalidAttributeGroupMsg, invalidItemTypeMsg } from '../../util/messages.constants';

export interface IAttributeTypeBase extends Document {
  name: string,
  validationExpression: string,
}

export const attributeTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  attributeGroup: {
    type: Types.ObjectId,
    required: true,
    index: true,
    ref: 'AttributeGroup',
    validate: {
      validator: attributeGroupModel.mValidateIdExists,
      message: invalidAttributeGroupMsg,
    },
  },
  validationExpression: {
    type: String,
    required: true,
  }
});

attributeTypeSchema.post('remove', (doc: IAttributeType, next: (err?: NativeError | undefined) => void) => {
  configurationItemModel.find({attributes: [{type: doc._id} as IAttribute]})
    .then(docs => docs.forEach(doc => doc.attributes.find(a => a.type.toString() === doc._id.toString())?.remove()))
    .catch(error => next(error));
  next();
});

function populate(this: Query<IAttributeType>) {
  this.populate({path: attributeGroupField, select: nameField});
};

attributeTypeSchema.pre('find', function() { this.populate({path: attributeGroupField, select: nameField}).sort(nameField); });
attributeTypeSchema.pre('findOne', populate);
attributeTypeSchema.pre('findById', populate);

attributeTypeSchema.statics.validateIdExists = async function (value: string | Types.ObjectId) {
  try {
      const count = await attributeTypeModel.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

attributeTypeSchema.statics.validateIdExistsAndIsAllowedForItemType = async function (attributeTypeId: string | Types.ObjectId, itemTypeId: string | Types.ObjectId) {
  try {
    const attributeType = await attributeTypeModel.findById(attributeTypeId);
    const itemType = await itemTypeModel.findById(itemTypeId);
    if (!attributeType || !itemType) {
      return Promise.reject(invalidItemTypeMsg);
    }
    const attributeGroupsIds = (itemType.attributeGroups.map(g => itemType.populated(attributeGroupsField) ? g._id.toString() : g.toString()))
    const attributeGroup = attributeType.populated(attributeGroupField) ? attributeType.attributeGroup._id.toString() : attributeType.attributeGroup.toString();
    return attributeGroupsIds.includes(attributeGroup) ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

attributeTypeSchema.statics.mValidateIdExists = (value: Types.ObjectId) => attributeTypeModel.findById(value).countDocuments()
  .then(docs => Promise.resolve(docs > 0))
  .catch(error => Promise.reject(error));

attributeTypeSchema.statics.validateNameDoesNotExist = async function (name: string) {
  try {
      const count = await attributeTypeModel.find({name}).countDocuments();
      return count === 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

export interface IAttributeType extends IAttributeTypeBase {
  attributeGroup: IAttributeGroup['_id'],
}
export interface IAttributeTypePopulated extends IAttributeTypeBase {
  attributeGroup: IAttributeGroup,
}

export interface IAttributeTypeModel extends Model<IAttributeType> {
  validateIdExists(value: string): Promise<void>;
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
  validateNameDoesNotExist(value: string) : Promise<void>;
  validateIdExistsAndIsAllowedForItemType(attributeTypeId: string | Types.ObjectId, itemTypeId: string | Types.ObjectId): Promise<void>;
}

export const attributeTypeModel = model<IAttributeType, IAttributeTypeModel>('AttributeType', attributeTypeSchema);
