import mongoose, { Schema, Document, Types, Model, model } from 'mongoose';

import attributeGroupModel, { IAttributeGroup } from './attribute-group.model';

interface IItemTypeSchema extends Document {
  name: string;
  color: string;
  attributeGroups: IAttributeGroup['_id'][];
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
      validator: (value: Types.ObjectId) => attributeGroupModel.findById(value).countDocuments()
        .then(docs => Promise.resolve(docs > 0))
        .catch(error => Promise.reject(error)),
      message: 'attribute group with this id not found.',
    },
  }],
});

itemTypeSchema.statics.validateIdExists = async function (value: string | Types.ObjectId) {
  try {
      const count = await this.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

itemTypeSchema.statics.validateNameDoesNotExist = async function (value: string | Types.ObjectId) {
  try {
      const count = await this.find({name: value}).countDocuments();
      return count === 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

interface IItemTypeModel extends Model<IItemType> {
  validateIdExists(value: string): Promise<void>;
  validateNameDoesNotExist(value: string) : Promise<void>;
}

export interface IItemType extends IItemTypeSchema {

}

export default model<IItemType, IItemTypeModel>('ItemType', itemTypeSchema);
