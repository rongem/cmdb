import mongoose, { Schema, Document } from 'mongoose';

import attributeGroupModel, { IAttributeGroup } from './attribute-group.model';

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

export default mongoose.model<IAttributeType>('AttributeType', attributeTypeSchema);
