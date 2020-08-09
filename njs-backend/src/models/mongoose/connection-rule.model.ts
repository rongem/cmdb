import mongoose, { Schema, Document } from 'mongoose';

import connectionTypeModel, { IConnectionType } from './connection-type.model';
import itemTypeModel, { IItemType } from './item-type.model';

export interface IConnectionRule extends Document {
    connectionType: IConnectionType['_id'];
    upperItemType: IItemType['_id'];
    lowerItemType: IItemType['_id'];
    maxConnectionsToUpper: number;
    maxConnectionsToLower: number;
    validationExpression: string;
}

const connectionRuleSchema = new Schema({
    connectionType: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ConnectionType',
        validate: {
            validator: (value: Schema.Types.ObjectId) => connectionTypeModel.findById(value).countDocuments()
              .then(docs => Promise.resolve(docs > 0))
              .catch(error => Promise.reject(error)),
            message: 'Connection type with this id not found.',
        },
    },
    upperItemType: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ItemType',
        validate: {
            validator: (value: Schema.Types.ObjectId) => itemTypeModel.findById(value).countDocuments()
                .then(docs => Promise.resolve(docs > 0))
                .catch(error => Promise.reject(error)),
            message: 'Item type with this id not found.',
        },
    },
    lowerItemType: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ItemType',
        validate: {
            validator: (value: Schema.Types.ObjectId) => itemTypeModel.findById(value).countDocuments()
                .then(docs => Promise.resolve(docs > 0))
                .catch(error => Promise.reject(error)),
            message: 'Item type with this id not found.',
        },
    },
    maxConnectionsToUpper: { type: Number, required: true, min: 1 },
    maxConnectionsToLower: { type: Number, required: true, min: 1 },
    validationExpression: { type: String, required: true },
});
  
export default mongoose.model<IConnectionRule>('ConnectionRule', connectionRuleSchema);

  