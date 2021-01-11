import { Request, Response, NextFunction } from 'express';
import { IConnection, IConnectionPopulatedRule, connectionModel, IConnectionPopulated } from '../../models/mongoose/connection.model';
import { historicConnectionModel, IHistoricConnection } from '../../models/mongoose/historic-connection.model';
import { connectionTypeModel, IConnectionType } from '../../models/mongoose/connection-type.model';
import {
    connectionRuleField,
    connectionTypeField,
    pageField,
    upperItemField,
    idField,
    lowerItemField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
    descriptionField,
    responsibleUsersField,
    nameField,
} from '../../util/fields.constants';
import { Connection } from '../../models/item-data/connection.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { connectionCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import { checkResponsibility } from '../../routes/validators';
import { connectionRuleModel, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { HttpError } from '../../rest-api/httpError.model';
import { disallowedChangingOfConnectionRuleMsg, disallowedChangingOfConnectionTypeMsg, disallowedChangingOfLowerItemMsg, disallowedChangingOfUpperItemMsg, invalidConnectionIdMsg, invalidUpperItemIdMsg, maximumNumberOfConnectionsToLowerExceededMsg, maximumNumberOfConnectionsToUpperExceededMsg, missingResponsibilityMsg, nothingChanged, validationErrorsMsg } from '../../util/messages.constants';
import { configurationItemModel, IConfigurationItem } from '../../models/mongoose/configuration-item.model';
import { IUser } from '../../models/mongoose/user.model';

// Helpers
export async function logAndRemoveConnection(connection: IConnection) {
    await updateHistoricConnection(connection, true);
    return connection.remove();
}

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

async function updateHistoricConnection(connection: IConnection, deleted: boolean) {
    let hc: IHistoricConnection = await historicConnectionModel.findById(connection._id);
    if (!hc) {
        hc = await createHistoricConnection(connection);
    } else {
        hc.descriptions.push(connection.description);
    }
    hc.deleted = deleted;
    return await hc.save();
}

// Read
export async function getConnections(req: Request, res: Response, next: NextFunction) {
    const max = 1000;
    const totalConnections = await connectionModel.find().countDocuments();
    const page = +(req.query[pageField] ?? req.params[pageField] ?? req.body[pageField] ?? 1);
    connectionModel.find()
      .skip((page - 1) * max)
      .limit(max)
      .then((connections: IConnection[]) =>
        res.json({
          connections: connections.map(c => new Connection(c)),
          totalConnections,
        })
      )
      .catch((error: any) => serverError(next, error));
}

export function getConnectionsForUpperItem(req: Request, res: Response, next: NextFunction) {
    connectionModel.findAndReturnConnections({upperItem: req.params[idField]})
        .then(connections => res.json(connections))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionsForLowerItem(req: Request, res: Response, next: NextFunction) {
    connectionModel.findAndReturnConnections({lowerItem: req.params[idField]})
        .then(connections => res.json(connections))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionsForItem(req: Request, res: Response, next: NextFunction) {
    connectionModel.findAndReturnConnections({$or: [{lowerItem: req.params[idField]}, {upperItem: req.params[idField]}]})
        .then(connections => res.json(connections))
        .catch((error: any) => serverError(next, error));
}

export function getConnection(req: Request, res: Response, next: NextFunction) {
    connectionModel.findById(req.params[idField])
        .then((connection: IConnection) => {
            if (!connection) {
                throw notFoundError;
            }
            res.json(new Connection(connection));
        })
        .catch((error: any) => serverError(next, error));
}

export function getConnectionByContent(req: Request, res: Response, next: NextFunction) {
    connectionModel.findAndReturnConnections({lowerItem: req.params[lowerItemField], upperItem: req.params[upperItemField]})
        .then((connections) => {
            const connection = connections.find(c => c.typeId === req.params[connectionTypeField]);
            if (!connection) {
                throw notFoundError;
            }
            return res.json(connection);
        })
        .catch((error: any) => serverError(next, error));
}

// Create
export function createConnection(req: Request, res: Response, next: NextFunction) {
    const connectionRule = req.body[ruleIdField] as string;
    const upperItem = req.body[upperItemIdField] as string;
    const lowerItem = req.body[lowerItemIdField] as string;
    const description = req.body[descriptionField] as string;
    connectionModelCreate(req.connectionRule, connectionRule, upperItem, lowerItem, description, req.authentication)
        .then(connection => {
            if (connection) {
                socket.emit(connectionCat, createCtx, connection);
                res.status(201).json(connection);
            }
        })
       .catch((error: any) => serverError(next, error));
}

async function connectionModelCreate(rule: IConnectionRule, connectionRule: string, upperItem: string, lowerItem: string,
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

// Update
export function updateConnection(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    const description = req.body[descriptionField] as string;
    const conn = req.conn;
    connectionModelUpdate(conn, description, req.authentication)
        .then((connection) => {
            if (connection) {
                socket.emit(connectionCat, updateCtx, connection);
                return res.json(connection);
            }
        })
        .catch((error: HttpError) => {
            if (error.httpStatusCode === 304)
            {
                res.sendStatus(304);
                return;
            }
            serverError(next, error);
        });
}

async function connectionModelUpdate(connection: IConnection, description: string, authentication: IUser) {
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

// Delete
export function deleteConnection(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    connectionModelDelete(id, req.authentication)
        .then((connection: Connection) => {
            if (connection) {
                socket.emit(connectionCat, deleteCtx, connection);
                return res.json(connection);
            }
        })
        .catch((error: any) => serverError(next, error));
}

async function connectionModelDelete(id: string, authentication: IUser) {
    let connection = await connectionModel.findById(id);
    if (!connection) {
        throw notFoundError;
    }
    const item = await configurationItemModel.findById(connection.upperItem).populate({ path: responsibleUsersField, select: nameField });
    checkResponsibility(authentication, item);
    await updateHistoricConnection(connection, true);
    connection = await connection.remove();
    return new Connection(connection);
}
