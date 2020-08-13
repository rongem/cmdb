import { Schema, Document, Types, Model, model } from 'mongoose';

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

attributeGroupSchema.statics.validateIdExists = async function (value: string | Types.ObjectId) {
  try {
      const count = await this.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

attributeGroupSchema.statics.validateNameDoesNotExist = async function (value: string | Types.ObjectId) {
  try {
      const count = await this.find({name: value}).countDocuments();
      return count === 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

export interface IAttributeGroup extends IAttributeGroupSchema {}

export interface IAttributeModel extends Model<IAttributeGroup> {
  validateIdExists(value: string): Promise<void>;
  validateNameDoesNotExist(value: string) : Promise<void>;
}

export default model<IAttributeGroup, IAttributeModel>('AttributeGroup', attributeGroupSchema);

