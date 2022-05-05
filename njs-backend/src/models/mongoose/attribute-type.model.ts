import { Schema, Document, Types, Model, model, MongooseError, Query, PopulatedDoc } from 'mongoose';

import { attributeGroupModel, IAttributeGroup } from './attribute-group.model';
import { configurationItemModel, IAttribute, IConfigurationItem } from './configuration-item.model';
import { invalidAttributeGroupMsg } from '../../util/messages.constants';

export interface IAttributeType extends Document {
  name: string;
  attributeGroup: PopulatedDoc<IAttributeGroup, Types.ObjectId>;
  validationExpression: string;
}

export const attributeTypeSchema = new Schema<IAttributeType, IAttributeTypeModel>({
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
      validator: attributeGroupModel.validateIdExists,
      message: invalidAttributeGroupMsg,
    },
  },
  validationExpression: {
    type: String,
    required: true,
  }
});

attributeTypeSchema.post('remove', (doc: IAttributeType, next: (err?: MongooseError | undefined) => void) => {
  configurationItemModel.find({attributes: [{type: doc._id} as IAttribute]})
    .then((docs: IConfigurationItem[]) => docs.forEach(d => d.attributes.find(a => a.type.toString() === d.id)?.remove()))
    .catch((error: any) => next(error));
  next();
});

function populate(this: Query<IAttributeType, IAttributeType>) {
  this.populate({path: 'attributeGroup', select: 'name'});
}

attributeTypeSchema.pre('find', function() { this.populate({path: 'attributeGroup', select: 'name'}).sort('name'); });
attributeTypeSchema.pre('findOne', populate);
attributeTypeSchema.pre('findById', populate);

attributeTypeSchema.statics.validateIdExists = (value: Types.ObjectId) => attributeTypeModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

export interface IAttributeTypeModel extends Model<IAttributeType> {
  validateIdExists(value: Types.ObjectId): Promise<boolean>;
}

export const attributeTypeModel = model<IAttributeType, IAttributeTypeModel>('AttributeType', attributeTypeSchema);
