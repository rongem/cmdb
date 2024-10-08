import { IConnection, connectionModel } from '../../mongoose/connection.model';
import { historicConnectionModel } from '../../mongoose/historic-connection.model';
import { connectionTypeModel, IConnectionType } from '../../mongoose/connection-type.model';
import { Connection } from '../../item-data/connection.model';
import { notFoundError } from '../../../controllers/error.controller';
import { checkResponsibility } from './configuration-item.al';
import { IConnectionRule } from '../../mongoose/connection-rule.model';
import { FullConfigurationItem } from '../../item-data/full/full-configuration-item.model';
import { FullConnection } from '../../item-data/full/full-connection.model';
import { ProtoConnection } from '../../item-data/full/proto-connection.model';
import { HttpError } from '../../../rest-api/httpError.model';
import {
    invalidConnectionIdMsg,
    maximumNumberOfConnectionsToLowerExceededMsg,
    maximumNumberOfConnectionsToUpperExceededMsg,
    nothingChangedMsg } from '../../../util/messages.constants';
import { connectionRuleModelFindSingle } from '../meta-data/connection-rule.al';
import { ConnectionRule } from '../../meta-data/connection-rule.model';
import { ConfigurationItem } from '../../item-data/configuration-item.model';
import { configurationItemFindByIdPopulatedUsers } from './configuration-item.al';
import { FilterQuery, Types } from 'mongoose';
import { UserAccount } from '../../item-data/user-account.model';

export const buildHistoricConnection = async (connection: IConnection, connectionTypes?: IConnectionType[]) => {
    if (!connection.populated('connectionRule')) {
        await connection.populate('connectionRule');
    }
    let connectionType;
    if (connectionTypes) {
        connectionType = connectionTypes.find(c => c.id === (connection.connectionRule as IConnectionRule).connectionType);
    }
    if (!connectionType) {
        connectionType = (await connectionTypeModel.findById((connection.connectionRule as IConnectionRule).connectionType)) as IConnectionType;
    }
    return {
        _id: connection._id,
        connectionRuleId: (connection.connectionRule as IConnectionRule).id!,
        connectionTypeId: connectionType.id!,
        connectionTypeName: connectionType.name,
        connectionTypeReverseName: connectionType.reverseName,
        upperItemId: connection.upperItem.toString(),
        lowerItemId: connection.lowerItem.toString(),
        descriptions: [connection.description],
        deleted: false,
    };
}

export const createHistoricConnection = async (connection: IConnection, connectionTypes?: IConnectionType[]) => {
    return historicConnectionModel.create(await buildHistoricConnection(connection, connectionTypes));
}

export const updateHistoricConnection = async (connection: IConnection, deleted: boolean) => {
    let hc = await historicConnectionModel.findById(connection._id);
    if (!hc) {
        hc = await createHistoricConnection(connection);
    } else {
        hc.descriptions.push(connection.description);
    }
    hc!.deleted = deleted;
    return await hc!.save();
}

export const connectionModelFind = async (filter: FilterQuery<IConnection>) => {
    const connections: IConnection[] = await connectionFindPopulated(filter);
    return connections.map(c => new Connection(c));
}

export const connectionFindPopulated = (filter: FilterQuery<IConnection>) => {
    return connectionModel.find(filter).populate({ path: 'connectionRule' }).exec();
}

export const connectionModelFindAll = async (page: number, max: number) => {
    const connections = await connectionsAllPopulated(page, max);
    return connections.map(c => new Connection(c));
}

export const connectionsAllPopulated = (page: number, max: number) => {
    return connectionModel.find()
        .populate({ path: 'connectionRule' })
        .skip((page - 1) * max)
        .limit(max)
        .exec();
}

export const connectionModelFindOne = async (upperItem: string, lowerItem: string, connectionRule: string) => {
    const connection = await connectionFindByContentPopulated(upperItem, lowerItem, connectionRule);
    return connection ? new Connection(connection) : undefined;
}

export const connectionFindByContentPopulated = (upperItem: string, lowerItem: string, connectionRule: string) => {
    return connectionModel.findOne({ upperItem, lowerItem, connectionRule })
        .populate({ path: 'connectionRule' })
        .exec();
}

export const connectionsFindByUpperItemPopulated = (upperItem: string | Types.ObjectId) => {
    return connectionModel.find({ upperItem })
        .populate({ path: 'connectionRule' })
        .populate({ path: 'lowerItem'})
        .exec();
}

export const connectionFindByLowerItemPopulated = (lowerItem: string | Types.ObjectId) => {
    return connectionModel.find({ lowerItem })
        .populate({ path: 'connectionRule' })
        .populate({ path: 'upperItem'})
        .exec();
}

export const connectionsFindByUpperItems = (upperItemIds: string[] | Types.ObjectId[]) => {
    return connectionModel.find({ upperItem: {$in: upperItemIds} })
        .exec();
}

export const connectionsFindByLowerItems = (lowerItemIds: string[] | Types.ObjectId[]) => {
    return connectionModel.find({ lowerItem: {$in: lowerItemIds} })
        .exec();
}

export const connectionModelFindSingle = async (id: string) => {
    const connection = await connectionByIdPopulated(id);
    if (!connection) {
        throw notFoundError;
    }
    return new Connection(connection);
}

export const connectionByIdPopulated = (id: string) => {
    return connectionModel.findById(id)
        .populate({ path: 'connectionRule' })
        .exec();
}

export const connectionModelSingleExists = async (id: string) => {
    const count: number = await connectionByIdCount(id);
    return count > 0;
}

export const connectionByIdCount = (id: string) => {
    return connectionModel.findById(id).countDocuments().exec();
}

export const connectionsCount = async () => {
    return connectionModel.find().countDocuments().exec();
}

export const connectionsCountByFilter = (filter: any) => {
    return connectionModel.find(filter).countDocuments().exec();
}

export const connectionModelValidateContentDoesNotExist = (connectionRule: string, upperItem: string, lowerItem: string, id?: string) =>
    connectionModel.find({connectionRule, upperItem, lowerItem, _id: {$ne: id}}).countDocuments()
        .then((docs: number) => docs === 0 ? Promise.resolve() : Promise.reject())
        .catch((error: any) => Promise.reject(error)
);


// create
export const connectionModelCreate = async (rule: IConnectionRule | ConnectionRule | undefined, connectionRule: string, upperItem: string, lowerItem: string,
                                            description: string, authentication: UserAccount) => {
    const promises: Promise<number>[] = [];
    if (!rule || rule.id !== connectionRule) {
        rule = await connectionRuleModelFindSingle(connectionRule);
    }
    const itemPromise = configurationItemFindByIdPopulatedUsers(upperItem);
    promises.push(connectionsCountByFilter({ upperItem, connectionRule }));
    promises.push(connectionsCountByFilter({ lowerItem, connectionRule }));
    const item = await itemPromise;
    const [upperConnections, lowerConnections] = await Promise.all(promises);
    checkResponsibility(authentication, item!);
    if (upperConnections >= rule.maxConnectionsToLower) {
        throw new HttpError(400, maximumNumberOfConnectionsToLowerExceededMsg);
    }
    if (lowerConnections >= rule.maxConnectionsToUpper) {
        throw new HttpError(400, maximumNumberOfConnectionsToUpperExceededMsg);
    }
    let connection = await connectionModel.create({ connectionRule, upperItem, lowerItem, description });
    createHistoricConnection(connection).catch(err => console.log(err));
    connection = await connection.populate({ path: 'connectionRule', select: 'connectionType' });
    return new Connection(connection);
}

export const createConnectionsForFullItem = async (item: ConfigurationItem, connectionRules: ConnectionRule[],
                                                   configurationItems: ConfigurationItem[],
                                                   connectionsToUpper: ProtoConnection[], connectionsToLower: ProtoConnection[]) => {
    const fullConnectionsToUpper: FullConnection[] = [];
    const fullConnectionsToLower: FullConnection[] = [];
    const historicConnectionsToCreate: any[] = [];
    const createdConnections: Connection[] = [];
    if (connectionsToUpper && connectionsToUpper.length > 0) {
        for (let index = 0; index < connectionsToUpper.length; index++) {
            const value = connectionsToUpper[index];
            const rule = connectionRules.find(r => r.id === value.ruleId)!;
            const connection = await connectionModel.create({
                connectionRule: value.ruleId,
                upperItem: value.targetId,
                lowerItem: item.id,
                description: value.description ?? '',
            });
            const targetItem = configurationItems.find(i => i.id === value.targetId)!;
            fullConnectionsToUpper.push(createFullConnection(connection, rule, targetItem));
            createdConnections.push(new Connection(connection));
            historicConnectionsToCreate.push(await buildHistoricConnection(connection));
        }
    }
    if (connectionsToLower && connectionsToLower.length > 0) {
        for (let index = 0; index < connectionsToLower.length; index++) {
            const value = connectionsToLower[index];
            const rule = connectionRules.find(r => r.id === value.ruleId)!;
            const connection = await connectionModel.create({
                connectionRule: value.ruleId,
                upperItem: item.id,
                lowerItem: value.targetId,
                description: value.description ?? '',
            });
            const targetItem = configurationItems.find(i => i.id === value.targetId)!;
            fullConnectionsToLower.push(createFullConnection(connection, rule, targetItem));
            createdConnections.push(new Connection(connection));
            historicConnectionsToCreate.push(await buildHistoricConnection(connection));
        }
    }
    await historicConnectionModel.insertMany(historicConnectionsToCreate);
    const fullItem = new FullConfigurationItem(undefined, fullConnectionsToUpper, fullConnectionsToLower);
    Object.assign(fullItem, item);
    return { fullItem, createdConnections };
}

function createFullConnection(connection: IConnection, rule: ConnectionRule, targetItem: ConfigurationItem) {
    const conn = new FullConnection(connection);
    conn.ruleId = rule.id;
    conn.typeId = rule.connectionTypeId;
    conn.type = ''; // tbd
    conn.targetId = targetItem.id;
    conn.targetName = targetItem.name;
    conn.targetTypeId = targetItem.typeId;
    conn.targetType = targetItem.type;
    conn.targetColor = targetItem.backColor;
    return conn;
}

// Update
export const connectionModelUpdate = async (connectionId: string, description: string, authentication: UserAccount) => {
    let connection = await connectionModel.findById(connectionId);
    if (!connection) {
        throw new HttpError(404, invalidConnectionIdMsg);
    }
    const item = await configurationItemFindByIdPopulatedUsers(connection.upperItem.toString());
    checkResponsibility(authentication, item!);
    let changed = false;
    if (connection.description !== description) {
        connection.description = description;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    connection = await connection.save();
    connection = await connection.populate({ path: 'connectionRule', select: 'connectionType' });
    updateHistoricConnection(connection, false);
    return new Connection(connection);
}

// delete
export const connectionModelDelete = async (id: string, authentication: UserAccount) => {
    const connection: IConnection | null = await connectionModel.findById(id);
    if (!connection) {
        throw notFoundError;
    }
    const item = await configurationItemFindByIdPopulatedUsers(connection.upperItem.toString());
    checkResponsibility(authentication, item!);
    const result = await logAndRemoveConnection(connection);
    return new Connection(connection);
}

export const logAndRemoveConnection = (connection: IConnection) => {
    updateHistoricConnection(connection, true);
    return connection.deleteOne();
}

