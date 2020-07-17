import mongoose, { Schema, Document } from 'mongoose';

import { IAttributeGroup } from './attribute-group.model';

export interface IAttributeType extends Document {
  name: string,
  attributeGroup: IAttributeGroup['_id'],
  validationExpression: string,
}

const attributeTypeSchema = new Schema({
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
  },
  validationExpression: {
    type: String,
    required: true,
  }
});

export default mongoose.model<IAttributeType>('AttributeType', attributeTypeSchema);
