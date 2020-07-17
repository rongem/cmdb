import mongoose, { Schema, Document } from 'mongoose';

import { IAttributeGroup } from './attribute-group.model';

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
  }],
});

export default mongoose.model('ItemType', itemTypeSchema);
