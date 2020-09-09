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

connectionRuleSchema.index({connectionType: 1, upperItemType: 1, lowerItemType: 1}, {unique: true});

connectionRuleSchema.statics.validateIdExists = async (value: string | Types.ObjectId) => {
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

connectionRuleSchema.statics.validateContentDoesNotExist =
    async (connectionType: string | Types.ObjectId, upperItemType: string | Types.ObjectId, lowerItemType: string | Types.ObjectId) => {
    try {
        const count = await connectionRuleModel.find({ connectionType, upperItemType, lowerItemType }).countDocuments();
        return count === 0 ? Promise.resolve() : Promise.reject();
    }
    catch (err) {
        return Promise.reject(err);
    }
};

connectionRuleSchema.statics.validateRuleIdAndTypeIdMatch = (ruleId: Types.ObjectId, typeId: Types.ObjectId) =>
    connectionRuleModel.find({_id: ruleId, connectionType: typeId}).countDocuments()
        .then(docs => docs === 1 ? Promise.resolve() : Promise.reject())
        .catch(error => Promise.reject(error));

connectionRuleSchema.statics.findByContent = (upperItemType: Types.ObjectId, lowerItemType: Types.ObjectId, connectionType: Types.ObjectId) =>
    connectionRuleModel.findOne({upperItemType, lowerItemType, connectionType});

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
    validateContentDoesNotExist(connectionType: string | Types.ObjectId,
                                upperItemType: string | Types.ObjectId,
                                lowerItemType: string | Types.ObjectId): Promise<void>;
    validateRuleIdAndTypeIdMatch(ruleId: string |  Types.ObjectId, typeId: string | Types.ObjectId): Promise<void>;
    findByContent(upperItemType: string | Types.ObjectId,
                  lowerItemType: string | Types.ObjectId,
                  connectionType: string | Types.ObjectId): Promise<IConnectionRule | undefined>;
}

export const connectionRuleModel = model<IConnectionRule, IConnectionRuleModel>('ConnectionRule', connectionRuleSchema);
