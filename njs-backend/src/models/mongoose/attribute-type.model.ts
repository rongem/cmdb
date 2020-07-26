import mongoose, { Schema, Document } from 'mongoose';

import attributeGroupModel, { IAttributeGroup } from './attribute-group.model';
import configurationItemModel from './configuration-item.model';

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

attributeTypeSchema.post('remove', (doc: IAttributeType, next: (err?: mongoose.NativeError | undefined) => void) => {
  configurationItemModel.find({attributes: {type: doc._id}})
    .then(docs => docs.forEach(doc => doc.attributes.find(a => a.type.toString() === doc._id.toString())?.remove()))
    .catch(error => next(error));
  next();
})

export default mongoose.model<IAttributeType>('AttributeType', attributeTypeSchema);
