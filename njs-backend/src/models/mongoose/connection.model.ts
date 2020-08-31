import { Schema, Types, Document, Model, model, MongooseFilterQuery } from 'mongoose';

import { connectionRuleModel, IConnectionRule } from './connection-rule.model';
import { configurationItemModel, IConfigurationItem } from './configuration-item.model';
import { invalidConnectionRuleMsg, invalidItemTypeMsg } from '../../util/messages.constants';
import { notFoundError } from '../../controllers/error.controller';
import { Connection } from '../item-data/connection.model';
import { connectionRuleField, connectionTypeField } from '../../util/fields.constants';

export interface connectionFilterConditions extends MongooseFilterQuery<Pick<IConnection,
    "_id" | "connectionRule" | "upperItem" | "lowerItem" | "description">> {}

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
    .then(docs => docs > 0 ? Promise.resolve() : Promise.reject())
    .catch(error => Promise.reject(error));

connectionSchema.statics.mValidateIdExists = (value: Types.ObjectId) => connectionModel.findById(value).countDocuments()
    .then(docs => Promise.resolve(docs > 0))
    .catch(error => Promise.reject(error));

connectionSchema.statics.validateContentDoesNotExist = (connectionRule: Types.ObjectId, upperItem: Types.ObjectId, lowerItem: Types.ObjectId) =>
    connectionModel.find({connectionRule, upperItem, lowerItem}).countDocuments()
    .then(docs => docs === 0 ? Promise.resolve() : Promise.reject())
    .catch(error => Promise.reject(error));

connectionSchema.statics.findAndReturnConnections = async (conditions: connectionFilterConditions) => {
    const connections = await connectionModel.find(conditions)
        .populate({path: connectionRuleField, select: connectionTypeField});
    return connections.map(c => new Connection(c));
}

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
    validateContentDoesNotExist(connectionRule: Types.ObjectId, upperItem: Types.ObjectId, lowerItem: Types.ObjectId): Promise<void>;
    findAndReturnConnections(conditions: connectionFilterConditions): Promise<Connection[]>
}

export const connectionModel = model<IConnection, IConnectionModel>('Connection', connectionSchema);
