import { Schema, Document, Types, Model, model, PopulatedDoc } from 'mongoose';

import { connectionTypeModel, IConnectionType } from './connection-type.model';
import { itemTypeModel, IItemType } from './item-type.model';
import {
    invalidConnectionTypeMsg,
    invalidUpperItemTypeMsg,
    invalidLowerItemTypeMsg,
} from '../../util/messages.constants';

export interface IConnectionRule extends Document {
    connectionType: PopulatedDoc<IConnectionType, Types.ObjectId>;
    upperItemType: PopulatedDoc<IItemType, Types.ObjectId>;
    lowerItemType: PopulatedDoc<IItemType, Types.ObjectId>;
    maxConnectionsToUpper: number;
    maxConnectionsToLower: number;
    validationExpression: string;
}

const connectionRuleSchema = new Schema<IConnectionRule, IConnectionRuleModel>({
    connectionType: {
        type: Types.ObjectId,
        required: true,
        ref: 'ConnectionType',
        validate: {
            validator: connectionTypeModel.validateIdExists,
            message: invalidConnectionTypeMsg,
        },
    },
    upperItemType: {
        type: Types.ObjectId,
        required: true,
        ref: 'ItemType',
        validate: {
            validator: itemTypeModel.validateIdExists,
            message: invalidUpperItemTypeMsg,
        },
    },
    lowerItemType: {
        type: Types.ObjectId,
        required: true,
        ref: 'ItemType',
        validate: {
            validator: itemTypeModel.validateIdExists,
            message: invalidLowerItemTypeMsg,
        },
    },
    maxConnectionsToUpper: { type: Number, required: true, min: 1 },
    maxConnectionsToLower: { type: Number, required: true, min: 1 },
    validationExpression: { type: String, required: true },
});

connectionRuleSchema.index({connectionType: 1, upperItemType: 1, lowerItemType: 1}, {unique: true});

connectionRuleSchema.statics.validateIdExists = (value: Types.ObjectId) => connectionRuleModel.findById(value).countDocuments()
    .then((docs: number) => Promise.resolve(docs > 0))
    .catch((error: any) => Promise.reject(error));

export interface IConnectionRuleModel extends Model<IConnectionRule> {
    validateIdExists(value: string): Promise<boolean>;
}

export const connectionRuleModel = model<IConnectionRule, IConnectionRuleModel>('ConnectionRule', connectionRuleSchema);
