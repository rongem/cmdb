import { Schema, Document, Types, Model, model } from 'mongoose';

import { connectionTypeModel, IConnectionType } from './connection-type.model';
import { itemTypeModel, IItemType } from './item-type.model';
import {
    invalidConnectionTypeMsg,
    invalidUpperItemTypeMsg,
    invalidLowerItemTypeMsg,
} from '../../util/messages.constants';

interface IConnectionRuleSchema extends Document {
    maxConnectionsToUpper: number;
    maxConnectionsToLower: number;
    validationExpression: string;
}

const connectionRuleSchema = new Schema({
    connectionType: {
        type: Types.ObjectId,
        required: true,
        ref: 'ConnectionType',
        validate: {
            validator: connectionTypeModel.mValidateIdExists,
            message: invalidConnectionTypeMsg,
        },
    },
    upperItemType: {
        type: Types.ObjectId,
        required: true,
        ref: 'ItemType',
        validate: {
            validator: itemTypeModel.mValidateIdExists,
            message: invalidUpperItemTypeMsg,
        },
    },
    lowerItemType: {
        type: Types.ObjectId,
        required: true,
        ref: 'ItemType',
        validate: {
            validator: itemTypeModel.mValidateIdExists,
            message: invalidLowerItemTypeMsg,
        },
    },
    maxConnectionsToUpper: { type: Number, required: true, min: 1 },
    maxConnectionsToLower: { type: Number, required: true, min: 1 },
    validationExpression: { type: String, required: true },
});

connectionRuleSchema.statics.validateIdExists = async function (value: string | Types.ObjectId) {
    try {
        const count = await connectionRuleModel.findById(value).countDocuments();
        return count > 0 ? Promise.resolve() : Promise.reject();
    }
    catch (err) {
        return Promise.reject(err);
    }
};

connectionRuleSchema.statics.mValidateIdExists = (value: Types.ObjectId) => connectionRuleModel.findById(value).countDocuments()
    .then(docs => Promise.resolve(docs > 0))
    .catch(error => Promise.reject(error));

connectionRuleSchema.statics.validateContentDoesNotExist = async function (connectionType: string | Types.ObjectId, upperItemType: string | Types.ObjectId, lowerItemType: string | Types.ObjectId) {
    try {
        const count = await connectionRuleModel.find({ connectionType, upperItemType, lowerItemType }).countDocuments();
        return count === 0 ? Promise.resolve() : Promise.reject();
    }
    catch (err) {
        return Promise.reject(err);
    }
};

export interface IConnectionRule extends IConnectionRuleSchema {
    connectionType: IConnectionType['_id'];
    upperItemType: IItemType['_id'];
    lowerItemType: IItemType['_id'];
}

export interface IConnectionRulePopulated extends IConnectionRuleSchema {
    connectionType: IConnectionType;
    upperItemType: IItemType;
    lowerItemType: IItemType;
}

export interface IConnectionRuleModel extends Model<IConnectionRule> {
    validateIdExists(value: string): Promise<void>;
    mValidateIdExists(value: string): Promise<boolean>;
    validateContentDoesNotExist(connectionType: string | Types.ObjectId, upperItemType: string | Types.ObjectId, lowerItemType: string | Types.ObjectId): Promise<void>;
}

export const connectionRuleModel = model<IConnectionRule, IConnectionRuleModel>('ConnectionRule', connectionRuleSchema);
