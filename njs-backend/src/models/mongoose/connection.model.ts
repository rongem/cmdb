import { Schema, Types, Document, Model, model, MongooseFilterQuery } from 'mongoose';

import { connectionRuleModel, IConnectionRule } from './connection-rule.model';
import { configurationItemModel, IConfigurationItem } from './configuration-item.model';
import { invalidConnectionRuleMsg, invalidItemTypeMsg } from '../../util/messages.constants';

export type connectionFilterConditions = MongooseFilterQuery<Pick<IConnection,
    '_id' | 'connectionRule' | 'upperItem' | 'lowerItem' | 'description'>>;

interface IConnectionSchema extends Document {
    description: string;
}

const connectionSchema = new Schema({
    connectionRule: {
        type: Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConnectionRule',
        validate: {
            validator: connectionRuleModel.mValidateIdExists,
            message: invalidConnectionRuleMsg,
        },
    },
    upperItem: {
        type: Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConfigurationItem',
        validate: {
            validator: configurationItemModel.validateIdExists,
            message: invalidItemTypeMsg,
        }
    },
    lowerItem: {
        type: Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConfigurationItem',
        validate: {
            validator: configurationItemModel.validateIdExists,
            message: invalidItemTypeMsg,
        }
    },
    description: {
        type: String,
        required: false,
        default: '',
    }
});

connectionSchema.index({connectionRule: 1, upperItem: 1, lowerItem: 1}, {unique: true});

connectionSchema.statics.validateIdExists = (value: Types.ObjectId) => connectionModel.findById(value).countDocuments()
    .then((docs: number) => Promise.resolve(docs > 0))
    .catch((error: any) => Promise.reject(error));

connectionSchema.statics.validateContentDoesNotExist =
    (connectionRule: string | Types.ObjectId, upperItem: string | Types.ObjectId,
     lowerItem: string | Types.ObjectId, id?: string | Types.ObjectId) =>
        connectionModel.find({connectionRule, upperItem, lowerItem, _id: {$ne: id}}).countDocuments()
        .then((docs: number) => docs === 0 ? Promise.resolve() : Promise.reject())
        .catch((error: any) => Promise.reject(error));

export interface IConnection extends IConnectionSchema {
    connectionRule: IConnectionRule['_id'];
    upperItem: IConfigurationItem['_id'];
    lowerItem: IConfigurationItem['_id'];
}

export interface IConnectionPopulatedRule extends IConnectionSchema {
    connectionRule: IConnectionRule;
    upperItem: IConfigurationItem['_id'];
    lowerItem: IConfigurationItem['_id'];
}

export interface IConnectionPopulated extends IConnectionSchema {
    connectionRule: IConnectionRule;
    upperItem: IConfigurationItem;
    lowerItem: IConfigurationItem;
}

export interface IConnectionModel extends Model<IConnection> {
    validateIdExists(value: Types.ObjectId): Promise<boolean>;
    validateContentDoesNotExist(
        connectionRule: string | Types.ObjectId,
        upperItem: string | Types.ObjectId,
        lowerItem: string | Types.ObjectId,
        id?: string | Types.ObjectId): Promise<void>;
}

export const connectionModel = model<IConnection, IConnectionModel>('Connection', connectionSchema);
