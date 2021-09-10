import { Schema, Document, Types, Model, model } from 'mongoose';

interface IConnectionTypeSchema extends Document {
  name: string;
  reverseName: string;
}

const connectionTypeSchema = new Schema<IConnectionType, IConnectionTypeModel, IConnectionType>({
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

connectionTypeSchema.statics.mValidateIdExists = (value: Types.ObjectId) => connectionTypeModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

export interface IConnectionType extends IConnectionTypeSchema {}

export interface IConnectionTypeModel extends Model<IConnectionType> {
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
}

export const connectionTypeModel = model<IConnectionType, IConnectionTypeModel>('ConnectionType', connectionTypeSchema);

