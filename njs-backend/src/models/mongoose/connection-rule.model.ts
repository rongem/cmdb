import mongoose, { Schema, Document } from 'mongoose';

import { IConnectionType } from './connection-type.model';
import { IItemType } from './item-type.model';

export interface IConnectionRule extends Document {
    connectionType: IConnectionType['_id'];
    upperItemType: IItemType['_id'];
    lowerItemType: IItemType['_id'];
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

  