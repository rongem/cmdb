import { Schema, Document, Types, Model, model, PopulatedDoc } from 'mongoose';

import { attributeGroupModel, IAttributeGroup } from './attribute-group.model';
import { invalidAttributeGroupMsg } from '../../util/messages.constants';

export interface IItemType extends Document {
  name: string;
  color: string;
  attributeGroups: PopulatedDoc<IAttributeGroup, Types.ObjectId>[];
}

const itemTypeSchema = new Schema<IItemType, IItemTypeModel>({
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

itemTypeSchema.pre('find', function() { this.sort('name'); });

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
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

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

export const itemTypeModel = model<IItemType, IItemTypeModel>('ItemType', itemTypeSchema);
