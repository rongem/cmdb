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

itemTypeSchema.statics.mValidateIdExists = (value: Types.ObjectId) => itemTypeModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

interface IItemTypeModel extends Model<IItemType> {
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
}

export const itemTypeModel = model<IItemType, IItemTypeModel>('ItemType', itemTypeSchema);
