import { IConnection, IConnectionPopulatedRule, connectionModel, IConnectionPopulated, connectionFilterConditions } from '../../models/mongoose/connection.model';
import { historicConnectionModel, IHistoricConnection } from '../../models/mongoose/historic-connection.model';
import { connectionTypeModel, IConnectionType } from '../../models/mongoose/connection-type.model';
import {
    connectionRuleField,
    connectionTypeField,
    responsibleUsersField,
    nameField,
    descriptionField,
    ruleIdField,
    targetIdField,
} from '../../util/fields.constants';
import { Connection } from '../../models/item-data/connection.model';
import { notFoundError } from '../error.controller';
import { checkResponsibility } from '../../routes/validators';
import { IConnectionRule, IConnectionRulePopulated } from '../../models/mongoose/connection-rule.model';
import { configurationItemModel, IConfigurationItem, IConfigurationItemPopulated } from '../../models/mongoose/configuration-item.model';
import { IUser } from '../../models/mongoose/user.model';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';
import { FullConnection } from '../../models/item-data/full/full-connection.model';
import { ProtoConnection } from '../../models/item-data/full/proto-connection.model';
import { HttpError } from '../../rest-api/httpError.model';
import {
    invalidConnectionIdMsg,
    maximumNumberOfConnectionsToLowerExceededMsg,
    maximumNumberOfConnectionsToUpperExceededMsg,
    nothingChanged } from '../../util/messages.constants';
import { connectionRuleModelFindSingle } from '../meta-data/connection-rule.al';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';

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

export async function connectionModelFind(filter: connectionFilterConditions) {
    const connections: IConnection[] = await connectionModel.find(filter).populate({path: connectionRuleField});
    return connections.map(c => new Connection(c));
}

export function connectionModelFindAll(page: number, max: number) {
    return connectionModel.find()
        .skip((page - 1) * max)
        .limit(max)
        .then((connections: IConnection[]) => connections.map(c => new Connection(c)));
}

export function connectionModelFindOne(upperItem: string, lowerItem: string, connectionRule: string) {
    return connectionModel.findOne({upperItem, lowerItem, connectionRule}).then((connection: IConnection) => new Connection(connection));
}

export function connectionModelFindSingle(id: string) {
    return connectionModel.findById(id).then((connection: IConnection) => new Connection(connection));
}

export async function connectionModelSingleExists(id: string) {
    const count: number = await connectionModel.findById(id).countDocuments();
    return count > 0;
}

export async function connectionModelCount() {
    return +(await connectionModel.find().countDocuments());
}

export async function connectionModelCountByFilter(filter: any) {
    return +(await connectionModel.find(filter).countDocuments());
}

// create
export async function connectionModelCreate(rule: IConnectionRule | ConnectionRule | undefined, connectionRule: string, upperItem: string, lowerItem: string,
                                            description: string, authentication: IUser) {
    const promises = [];
    if (!rule || rule.id !== connectionRule) {
        rule = await connectionRuleModelFindSingle(connectionRule);
    }
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

export async function createConnectionsForFullItem(item: ConfigurationItem, connectionRules: IConnectionRule[],
                                                   configurationItems: IConfigurationItem[],
                                                   connectionsToUpper: ProtoConnection[], connectionsToLower: ProtoConnection[]) {
    const fullConnectionsToUpper: FullConnection[] = [];
    const fullConnectionsToLower: FullConnection[] = [];
    const historicConnectionsToCreate: any[] = [];
    const createdConnections: Connection[] = [];
    if (connectionsToUpper && connectionsToUpper.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < connectionsToUpper.length; index++) {
            const value = connectionsToUpper[index];
            const rule = connectionRules.find(r => r.id === value[ruleIdField]) as IConnectionRulePopulated;
            const connection = await connectionModel.create({
                connectionRule: value[ruleIdField],
                upperItem: value[targetIdField],
                lowerItem: item.id,
                description: value[descriptionField] ?? '',
            });
            const targetItem = configurationItems.find(i => i.id === value[targetIdField]) as IConfigurationItem;
            fullConnectionsToUpper.push(createFullConnection(connection, rule, targetItem));
            createdConnections.push(new Connection(connection));
            historicConnectionsToCreate.push(await buildHistoricConnection(connection, [rule.connectionType]));
        }
    }
    if (connectionsToLower && connectionsToLower.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < connectionsToLower.length; index++) {
            const value = connectionsToLower[index];
            const rule = connectionRules.find(r => r.id === value[ruleIdField]) as IConnectionRule;
            const connection = await connectionModel.create({
                connectionRule: value[ruleIdField],
                upperItem: item.id,
                lowerItem: value[targetIdField],
                description: value[descriptionField] ?? '',
            });
            const targetItem = configurationItems.find(i => i.id === value[targetIdField]) as IConfigurationItem;
            fullConnectionsToLower.push(createFullConnection(connection, rule, targetItem));
            createdConnections.push(new Connection(connection));
            historicConnectionsToCreate.push(await buildHistoricConnection(connection, [rule.connectionType]));
        }
    }
    await historicConnectionModel.insertMany(historicConnectionsToCreate);
    const fullItem = new FullConfigurationItem(undefined, fullConnectionsToUpper, fullConnectionsToLower);
    Object.assign(fullItem, item);
    return { fullItem, createdConnections };
}

function createFullConnection(connection: IConnection, rule: IConnectionRulePopulated, targetItem: IConfigurationItemPopulated) {
    const conn = new FullConnection(connection);
    conn.ruleId = rule.id!;
    conn.typeId = rule.connectionType.id!;
    conn.type = rule.connectionType.name;
    conn.targetId = targetItem.id!;
    conn.targetName = targetItem.name;
    conn.targetTypeId = targetItem.type.id;
    conn.targetType = targetItem.type.name;
    conn.targetColor = targetItem.type.color;
    return conn;
}

// Update
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

// delete
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

export function logAndRemoveConnection(connection: IConnection) {
    updateHistoricConnection(connection, true);
    return connection.remove() as Promise<IConnection>;
}

