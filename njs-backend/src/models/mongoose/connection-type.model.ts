import mongoose, { Schema, Document } from 'mongoose';

export interface IConnectionType extends Document {
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

export default mongoose.model<IConnectionType>('ConnectionType', connectionTypeSchema);

