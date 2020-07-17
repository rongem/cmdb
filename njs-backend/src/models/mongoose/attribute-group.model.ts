import mongoose, { Schema, Document } from 'mongoose';

export interface IAttributeGroup extends Document {
  name: string;
}

const attributeGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model<IAttributeGroup>('AttributeGroup', attributeGroupSchema);

