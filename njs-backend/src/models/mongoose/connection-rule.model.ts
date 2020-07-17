import mongoose, { Schema, Document } from 'mongoose';

export interface IConnectionRule extends Document {
    connectionType: Schema.Types.ObjectId;
    upperItemType: Schema.Types.ObjectId;
    lowerItemType: Schema.Types.ObjectId;
    maxConnectionsToUpper: number;
    maxConnectionsToLower: number;
    validationExpression: string;
}

const connectionRuleSchema = new Schema({
    upperItemType: { type: Schema.Types.ObjectId, required: true, ref: 'ItemType' },
    lowerItemType: { type: Schema.Types.ObjectId, required: true, ref: 'ItemType' },
    maxConnectionsToUpper: { type: Number, required: true, min: 1 },
    maxConnectionsToLower: { type: Number, required: true, min: 1 },
    validationExpression: { type: String, required: true },
});
  
export default mongoose.model<IConnectionRule>('ConnectionRule', connectionRuleSchema);

  