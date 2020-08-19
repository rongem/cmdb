import { Schema, Types, Document, Model, model } from 'mongoose';

import { connectionRuleModel, IConnectionRule } from './connection-rule.model';
import { configurationItemModel, IConfigurationItem } from './configuration-item.model';
import { invalidConnectionRuleMsg, invalidItemTypeMsg } from '../../util/messages.constants';

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
            validator: configurationItemModel.mValidateIdExists,
            message: invalidItemTypeMsg,
        }
    },
    lowerItem: {
        type: Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConfigurationItem',
        validate: {
            validator: configurationItemModel.mValidateIdExists,
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
    .then(docs => Promise.resolve(docs > 0))
    .catch(error => Promise.reject(error));

connectionSchema.statics.mValidateIdExists = (value: Types.ObjectId) => connectionModel.findById(value).countDocuments()
    .then(docs => Promise.resolve(docs > 0))
    .catch(error => Promise.reject(error));
  

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
    validateIdExists(value: string): Promise<void>;
    mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
}

export const connectionModel = model<IConnection, IConnectionModel>('Connection', connectionSchema);
