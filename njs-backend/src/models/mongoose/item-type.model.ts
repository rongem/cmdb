import mongoose, { Schema, Document } from 'mongoose';

import attributeGroupModel, { IAttributeGroup } from './attribute-group.model';

export interface IItemType extends Document {
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
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AttributeGroup',
    validate: {
      validator: (value: Schema.Types.ObjectId) => attributeGroupModel.findById(value).countDocuments()
        .then(docs => Promise.resolve(docs > 0))
        .catch(error => Promise.reject(error)),
      message: 'attribute group with this id not found.',
    },
  }],
});

export default mongoose.model<IItemType>('ItemType', itemTypeSchema);
