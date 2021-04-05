import { Schema, Document, Types, Model, model } from 'mongoose';
import { nameField } from '../../util/fields.constants';

interface IAttributeGroupSchema extends Document {
  name: string;
}

const attributeGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

attributeGroupSchema.statics.validateIdExists = async (value: string | Types.ObjectId) => {
  try {
      const count = await attributeGroupModel.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

attributeGroupSchema.statics.mValidateIdExists = (value: Types.ObjectId) => attributeGroupModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

attributeGroupSchema.statics.validateNameDoesNotExist = async (name: string) => {
  try {
      const count = await attributeGroupModel.find({name}).countDocuments();
      return count === 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

attributeGroupSchema.pre('find', function() { this.sort(nameField); });

export interface IAttributeGroup extends IAttributeGroupSchema {}

export interface IAttributeGroupModel extends Model<IAttributeGroup> {
  validateIdExists(value: string): Promise<void>;
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
  validateNameDoesNotExist(value: string): Promise<void>;
}

export const attributeGroupModel = model<IAttributeGroup, IAttributeGroupModel>('AttributeGroup', attributeGroupSchema);
