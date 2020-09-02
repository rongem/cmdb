import { Schema, Document, Types, Model, model, Query } from 'mongoose';

import { attributeGroupModel, IAttributeGroup } from './attribute-group.model';
import { attributeGroupsField, nameField } from '../../util/fields.constants';
import { invalidAttributeGroupMsg } from '../../util/messages.constants';

interface IItemTypeSchema extends Document {
  name: string;
  color: string;
}

const itemTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  color: {
    type: String,
    required: true,
  },
  attributeGroups: [{
    type: Types.ObjectId,
    required: true,
    ref: 'AttributeGroup',
    validate: {
      validator: attributeGroupModel.mValidateIdExists,
      message: invalidAttributeGroupMsg,
    },
  }],
});

itemTypeSchema.statics.validateIdExists = async (value: string | Types.ObjectId) => {
  try {
      const count = await itemTypeModel.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

itemTypeSchema.statics.mValidateIdExists = (value: Types.ObjectId) => itemTypeModel.findById(value).countDocuments()
  .then(docs => Promise.resolve(docs > 0))
  .catch(error => Promise.reject(error));

itemTypeSchema.statics.validateNameDoesNotExist = async (name: string) => {
  try {
      const count = await itemTypeModel.find({name}).countDocuments();
      return count === 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

interface IItemTypeModel extends Model<IItemType> {
  validateIdExists(value: string): Promise<void>;
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
  validateNameDoesNotExist(value: string): Promise<void>;
}

export interface IItemType extends IItemTypeSchema {
  attributeGroups: IAttributeGroup['_id'][];
}

export interface IItemTypePopulated extends IItemTypeSchema {
  attributeGroups: IAttributeGroup[];
}

export const itemTypeModel = model<IItemType, IItemTypeModel>('ItemType', itemTypeSchema);
