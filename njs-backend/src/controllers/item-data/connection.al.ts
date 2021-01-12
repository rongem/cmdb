import { IConnection, IConnectionPopulatedRule, connectionModel, IConnectionPopulated } from '../../models/mongoose/connection.model';
import { historicConnectionModel, IHistoricConnection } from '../../models/mongoose/historic-connection.model';
import { connectionTypeModel, IConnectionType } from '../../models/mongoose/connection-type.model';
import {
    connectionRuleField,
    connectionTypeField,
    responsibleUsersField,
    nameField,
} from '../../util/fields.constants';
import { Connection } from '../../models/item-data/connection.model';
import { notFoundError } from '../error.controller';
import { checkResponsibility } from '../../routes/validators';
import { IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { HttpError } from '../../rest-api/httpError.model';
import {
    invalidConnectionIdMsg,
    maximumNumberOfConnectionsToLowerExceededMsg,
    maximumNumberOfConnectionsToUpperExceededMsg,
    nothingChanged } from '../../util/messages.constants';
import { configurationItemModel, IConfigurationItem } from '../../models/mongoose/configuration-item.model';
import { IUser } from '../../models/mongoose/user.model';

export async function buildHistoricConnection(connection: IConnectionPopulated, connectionTypes?: IConnectionType[]) {
    if (!connection.populated(connectionRuleField) || !connection.populated(`${connectionRuleField}.${connectionTypeField}`)) {
        await connection.populate(connectionRuleField)
            .populate(`${connectionRuleField}.${connectionTypeField}`)
            .execPopulate();
    }
    let connectionType;
    if (connectionTypes) {
        connectionType = connectionTypes.find(c => c.id === connection.connectionRule.connectionType);
    }
    if (!connectionType) {
        connectionType = (await connectionTypeModel.findById(connection.connectionRule.connectionType)) as IConnectionType;
    }
    return {
        _id: connection._id,
        connectionRuleId: connection.connectionRule.id!,
        connectionTypeId: connectionType.id!,
        connectionTypeName: connectionType.name,
        connectionTypeReverseName: connectionType.reverseName,
        upperItemId: connection.upperItem.toString(),
        lowerItemId: connection.lowerItem.toString(),
        descriptions: [connection.description],
        deleted: false,
    };
}

export async function createHistoricConnection(connection: IConnectionPopulatedRule, connectionTypes?: IConnectionType[]) {
    return historicConnectionModel.create(await buildHistoricConnection(connection, connectionTypes));
}

export async function updateHistoricConnection(connection: IConnection, deleted: boolean) {
    let hc: IHistoricConnection = await historicConnectionModel.findById(connection._id);
    if (!hc) {
        hc = await createHistoricConnection(connection);
    } else {
        hc.descriptions.push(connection.description);
    }
    hc.deleted = deleted;
    return await hc.save();
}

export function connectionModelFind(filter: any) {
    return connectionModel.findAndReturnConnections(filter);
}

export function connectionModelFindAll(page: number, max: number) {
    return connectionModel.find()
        .skip((page - 1) * max)
        .limit(max)
        .then((connections: IConnection[]) => connections.map(c => new Connection(c)));
}

export function connectionModelFindSingle(id: string) {
    return connectionModel.findById(id).then((connection: IConnection) => new Connection(connection));
}

export async function connectionModelCount() {
    return +(await connectionModel.find().countDocuments());
}

export async function connectionModelCountByFilter(filter: any) {
    return +(await connectionModel.find(filter).countDocuments());
}

export async function connectionModelCreate(rule: IConnectionRule, connectionRule: string, upperItem: string, lowerItem: string,
                                            description: string, authentication: IUser) {
    const promises = [];
    promises.push(configurationItemModel.findById(upperItem).populate({ path: responsibleUsersField, select: nameField }));
    promises.push(connectionModel.find({ upperItem, connectionRule }).countDocuments());
    promises.push(connectionModel.find({ lowerItem, connectionRule }).countDocuments());
    const [item, upperConnections, lowerConnections] = await Promise.all(promises);
    checkResponsibility(authentication, item);
    if (upperConnections >= rule.maxConnectionsToLower) {
        throw new HttpError(422, maximumNumberOfConnectionsToLowerExceededMsg);
    }
    if (lowerConnections >= rule.maxConnectionsToUpper) {
        throw new HttpError(422, maximumNumberOfConnectionsToUpperExceededMsg);
    }
    let connection = await connectionModel.create({ connectionRule, upperItem, lowerItem, description });
    createHistoricConnection(connection).catch(err => console.log(err));
    connection = await connection.populate({ path: connectionRuleField, select: connectionTypeField }).execPopulate();
    return new Connection(connection);
}

export async function connectionModelUpdate(connection: IConnection, description: string, authentication: IUser) {
    if (!connection) {
        throw new HttpError(404, invalidConnectionIdMsg);
    }
    const item: IConfigurationItem = await configurationItemModel.findById(connection.upperItem).populate({ path: responsibleUsersField, select: nameField });
    checkResponsibility(authentication, item);
    let changed = false;
    if (connection.description !== description) {
        connection.description = description;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChanged);
    }
    connection = await connection.save();
    connection = await connection.populate({ path: connectionRuleField, select: connectionTypeField }).execPopulate();
    return new Connection(connection);
}

export async function connectionModelDelete(id: string, authentication: IUser) {
    let connection = await connectionModel.findById(id);
    if (!connection) {
        throw notFoundError;
    }
    const item = await configurationItemModel.findById(connection.upperItem).populate({ path: responsibleUsersField, select: nameField });
    checkResponsibility(authentication, item);
    connection = await logAndRemoveConnection(connection);
    return new Connection(connection);
}

export async function logAndRemoveConnection(connection: IConnection) {
    await updateHistoricConnection(connection, true);
    return connection.remove();
}

