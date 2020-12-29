import { Schema, Types, Document, Model, model, MongooseFilterQuery } from 'mongoose';

import { connectionRuleModel, IConnectionRule } from './connection-rule.model';
import { configurationItemModel, IConfigurationItem } from './configuration-item.model';
import { invalidConnectionRuleMsg, invalidItemTypeMsg } from '../../util/messages.constants';
import { Connection } from '../item-data/connection.model';
import { connectionRuleField, connectionTypeField, upperItemField, lowerItemField } from '../../util/fields.constants';
import { itemTypeModel, IItemType } from './item-type.model';
import { FullConnection } from '../item-data/full/full-connection.model';
import { connectionTypeModel, IConnectionType } from './connection-type.model';

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
    .then((docs: number) => docs > 0 ? Promise.resolve() : Promise.reject())
    .catch((error: any) => Promise.reject(error));

connectionSchema.statics.mValidateIdExists = (value: Types.ObjectId) => connectionModel.findById(value).countDocuments()
    .then((docs: number) => Promise.resolve(docs > 0))
    .catch((error: any) => Promise.reject(error));

connectionSchema.statics.validateContentDoesNotExist =
    (connectionRule: Types.ObjectId, upperItem: Types.ObjectId, lowerItem: Types.ObjectId) =>
        connectionModel.find({connectionRule, upperItem, lowerItem}).countDocuments()
        .then((docs: number) => docs === 0 ? Promise.resolve() : Promise.reject())
        .catch((error: any) => Promise.reject(error));

connectionSchema.statics.findConnectionsAndPopulateRule = (conditions: connectionFilterConditions) =>
    connectionModel.find(conditions).populate({path: connectionRuleField});

connectionSchema.statics.findConnectionsAndPopulateAll = (conditions: connectionFilterConditions) =>
    connectionModel.find(conditions)
        .populate({path: connectionRuleField})
        .populate({path: upperItemField})
        .populate({path: lowerItemField});

connectionSchema.statics.findAndReturnConnectionsToLower = (upperItem: Types.ObjectId) =>
    connectionModel.find({upperItem}).populate({path: connectionRuleField}).populate({path: lowerItemField})
        .then(async (connections: IConnectionPopulated[]) => {
            const itemTypes = await itemTypeModel.find({_id: {$in: connections.map(c => c.lowerItem.type)}});
            const connectionTypes = await connectionTypeModel.find({_id: {$in: connections.map(c => c.connectionRule.connectionType)}});
            const fullConnections: FullConnection[] = [];
            connections.forEach(c => {
                const connection = new FullConnection(c);
                const itemType = itemTypes.find(it => it.id === c.lowerItem.type.toString()) as IItemType;
                const connectionType = connectionTypes.find(ct => ct.id === c.connectionRule.connectionType.toString()) as IConnectionType;
                connection.targetId = c.lowerItem.id!;
                connection.targetName = c.lowerItem.name;
                connection.targetTypeId = itemType.id;
                connection.targetType = itemType.name;
                connection.targetColor = itemType.color;
                connection.type = connectionType.name;
                fullConnections.push(connection);
            });
            return fullConnections;
        });

connectionSchema.statics.findAndReturnConnectionsToUpper = (lowerItem: Types.ObjectId) =>
    connectionModel.find({lowerItem})
        .populate({path: connectionRuleField})
        .populate({path: upperItemField})
        .then(async (connections: IConnectionPopulated[]) => {
            const itemTypes = await itemTypeModel.find({_id: {$in: connections.map(c => c.upperItem.type)}});
            const connectionTypes = await connectionTypeModel.find({_id: {$in: connections.map(c => c.connectionRule.connectionType)}});
            const fullConnections: FullConnection[] = [];
            connections.forEach(c => {
                const connection = new FullConnection(c);
                const itemType = itemTypes.find(it => it.id === c.upperItem.type.toString()) as IItemType;
                const connectionType = connectionTypes.find(ct => ct.id === c.connectionRule.connectionType.toString()) as IConnectionType;
                connection.targetId = c.upperItem.id!;
                connection.targetName = c.upperItem.name;
                connection.targetTypeId = itemType.id;
                connection.targetType = itemType.name;
                connection.targetColor = itemType.color;
                connection.type = connectionType.reverseName;
                fullConnections.push(connection);
            });
            return fullConnections;
        });

connectionSchema.statics.findAndReturnConnections = async (conditions: connectionFilterConditions) => {
    const connections = await connectionModel.findConnectionsAndPopulateRule(conditions);
    return connections.map(c => new Connection(c));
};

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
    findConnectionsAndPopulateRule(conditions: connectionFilterConditions): Promise<IConnectionPopulatedRule[]>;
    findConnectionsAndPopulateAll(conditions: connectionFilterConditions): Promise<IConnectionPopulated[]>;
    findAndReturnConnections(conditions: connectionFilterConditions): Promise<Connection[]>;
    findAndReturnConnectionsToLower(upperItem: string | Types.ObjectId): Promise<FullConnection[]>;
    findAndReturnConnectionsToUpper(lowerItem: string | Types.ObjectId): Promise<FullConnection[]>;
}

export const connectionModel = model<IConnection, IConnectionModel>('Connection', connectionSchema);
