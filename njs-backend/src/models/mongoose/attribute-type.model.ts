import { Schema, Document, Types, Model, model, NativeError, HookSyncCallback, Aggregate, Query } from 'mongoose';

import attributeGroupModel, { IAttributeGroup } from './attribute-group.model';
import configurationItemModel, { IAttribute } from './configuration-item.model';
import { attributeGroupField } from '../../util/fields.constants';
import { nameField } from '../../util/fields.constants';

export interface IAttributeTypeSchema extends Document {
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
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'AttributeGroup',
    validate: {
      validator: (value: Schema.Types.ObjectId) => attributeGroupModel.findById(value).countDocuments()
        .then(docs => Promise.resolve(docs > 0))
        .catch(error => Promise.reject(error)),
      message: 'attribute group with this id not found.',
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

const populate = function() {
  this.populate({path: attributeGroupField, select: nameField});
};

attributeTypeSchema.pre('find', populate);
attributeTypeSchema.pre('findOne', populate);
attributeTypeSchema.pre('findById', populate);

attributeTypeSchema.statics.validateIdExists = async function (value: string | Types.ObjectId) {
  try {
      const count = await this.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

attributeTypeSchema.statics.validateNameDoesNotExist = async function (value: string | Types.ObjectId) {
  try {
      const count = await this.find({name: value}).countDocuments();
      return count === 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

interface IAttributeTypeBase extends IAttributeTypeSchema {}

export interface IAttributeType extends IAttributeTypeBase {
  attributeGroup: IAttributeGroup['_id'],
}
export interface IAttributeTypePopulated extends IAttributeTypeBase {
  attributeGroup: IAttributeGroup,
}

export interface IAttributeTypeModel extends Model<IAttributeType> {
  validateIdExists(value: string): Promise<void>;
  validateNameDoesNotExist(value: string) : Promise<void>;
}

export default model<IAttributeType, IAttributeTypeModel>('AttributeType', attributeTypeSchema);
