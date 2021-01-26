import { Schema, Document, Types, Model, model } from 'mongoose';

interface IConnectionTypeSchema extends Document {
  name: string;
  reverseName: string;
}

const connectionTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  reverseName: {
    type: String,
    required: true,
    unique: false,
  },
});

connectionTypeSchema.index({name: 1, reverseName: 1}, {unique: true});

connectionTypeSchema.statics.validateIdExists = async (value: string | Types.ObjectId) => {
  try {
      const count = await connectionTypeModel.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

connectionTypeSchema.statics.mValidateIdExists = (value: Types.ObjectId) => connectionTypeModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

// tslint:disable-next-line: no-empty-interface
export interface IConnectionType extends IConnectionTypeSchema {}

export interface IConnectionTypeModel extends Model<IConnectionType> {
  validateIdExists(value: string): Promise<void>;
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
}

export const connectionTypeModel = model<IConnectionType, IConnectionTypeModel>('ConnectionType', connectionTypeSchema);

