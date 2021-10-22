import { Schema, Document, Types, Model, model } from 'mongoose';

export interface IAttributeGroup extends Document {
  name: string;
}

const attributeGroupSchema = new Schema<IAttributeGroup, IAttributeGroupModel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

attributeGroupSchema.statics.validateIdExists = (value: Types.ObjectId) => attributeGroupModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

attributeGroupSchema.pre('find', function() { this.sort('name'); });

export interface IAttributeGroupModel extends Model<IAttributeGroup> {
  validateIdExists(value: Types.ObjectId): Promise<boolean>;
}

export const attributeGroupModel = model<IAttributeGroup, IAttributeGroupModel>('AttributeGroup', attributeGroupSchema);
