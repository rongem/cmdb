import { Schema, Types, Document, Model, model, PopulatedDoc } from 'mongoose';

import { connectionRuleModel, IConnectionRule } from './connection-rule.model';
import { configurationItemModel, IConfigurationItem } from './configuration-item.model';
import { invalidConnectionRuleMsg, invalidItemTypeMsg } from '../../util/messages.constants';

export interface IConnection extends Document {
    connectionRule: PopulatedDoc<IConnectionRule, Types.ObjectId>;
    upperItem: PopulatedDoc<IConfigurationItem, Types.ObjectId>;
    lowerItem: PopulatedDoc<IConfigurationItem, Types.ObjectId>;
    description: string;
}

const connectionSchema = new Schema<IConnection, IConnectionModel>({
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

export interface IConnectionModel extends Model<IConnection> {
    validateIdExists(value: Types.ObjectId): Promise<boolean>;
    validateContentDoesNotExist(
        connectionRule: string | Types.ObjectId,
        upperItem: string | Types.ObjectId,
        lowerItem: string | Types.ObjectId,
        id?: string | Types.ObjectId): Promise<void>;
}

export const connectionModel = model<IConnection, IConnectionModel>('Connection', connectionSchema);
