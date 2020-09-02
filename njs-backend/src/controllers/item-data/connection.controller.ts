import { Request, Response, NextFunction } from 'express';
import { IConnection, IConnectionPopulatedRule, connectionModel, IConnectionPopulated } from '../../models/mongoose/connection.model';
import { historicConnectionModel } from '../../models/mongoose/historic-connection.model';
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
} from '../../util/fields.constants';
import { Connection } from '../../models/item-data/connection.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { connectionCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import { checkResponsibility } from '../../routes/validators';

// Helpers
export async function logAndRemoveConnection(connection: IConnection) {
    await updateHistoricConnection(connection, true);
    return connection.remove();
}

async function createHistoricConnection(connection: IConnectionPopulatedRule) {
    if (!connection.populated(connectionRuleField) || !connection.populated(`${connectionRuleField}.${connectionTypeField}`)) {
        await connection.populate(connectionRuleField)
            .populate(`${connectionRuleField}.${connectionTypeField}`)
            .execPopulate();
    }
    const connectionType = (await connectionTypeModel.findById(connection.connectionRule.connectionType)) as IConnectionType;
    return historicConnectionModel.create({
        _id: connection._id,
        connectionRuleId: connection.connectionRule._id.toString(),
        connectionTypeId: connectionType._id.toString(),
        connectionTypeName: connectionType.name,
        connectionTypeReverseName: connectionType.reverseName,
        upperItemId: connection.upperItem.toString(),
        lowerItemId: connection.lowerItem.toString(),
        descriptions: [connection.description],
        deleted: false,
    });
}

async function updateHistoricConnection(connection: IConnection, deleted: boolean) {
    let hc = await historicConnectionModel.findById(connection._id);
    if (!hc) {
        hc = await createHistoricConnection(connection);
    } else {
        hc.descriptions.push(connection.description);
    }
    hc.deleted = deleted;
    return hc.save();
}

// Read
export async function getConnections(req: Request, res: Response, next: NextFunction) {
    const max = 1000;
    const totalConnections = await connectionModel.find().estimatedDocumentCount();
    const page = +(req.query[pageField] ?? req.params[pageField] ?? req.body[pageField] ?? 1);
    connectionModel.find()
      .skip((page - 1) * max)
      .limit(max)
      .then((connections) =>
        res.json({
          connections: connections.map(c => new Connection(c)),
          totalConnections,
        })
      )
      .catch((error) => serverError(next, error));
}

export function getConnectionsForUpperItem(req: Request, res: Response, next: NextFunction) {
    connectionModel.findAndReturnConnections({upperItem: req.params[idField]})
        .then(connections => res.json(connections))
        .catch((error) => serverError(next, error));
}

export function getConnectionsForLowerItem(req: Request, res: Response, next: NextFunction) {
    connectionModel.findAndReturnConnections({lowerItem: req.params[idField]})
        .then(connections => res.json(connections))
        .catch((error) => serverError(next, error));
}

export function getConnectionsForItem(req: Request, res: Response, next: NextFunction) {
    connectionModel.findAndReturnConnections({$or: [{lowerItem: req.params[idField]}, {upperItem: req.params[idField]}]})
        .then(connections => res.json(connections))
        .catch((error) => serverError(next, error));
}

export function getConnection(req: Request, res: Response, next: NextFunction) {
    connectionModel.findById(req.params[idField])
        .then(connection => {
            if (!connection) {
                throw notFoundError;
            }
            res.json(new Connection(connection));
        })
        .catch((error) => serverError(next, error));
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
        .catch((error) => serverError(next, error));
}

// Create
export function createConnection(req: Request, res: Response, next: NextFunction) {
    connectionModel.create({
        connectionRule: req.body[ruleIdField],
        upperItem: req.body[upperItemIdField],
        lowerItem: req.body[lowerItemIdField],
        description: req.body[descriptionField] ?? '',
    }).then(connection => {
        if (connection) {
            const conn = new Connection(connection);
            socket.emit(connectionCat, createCtx, conn);
            res.status(201).json(conn);
            return createHistoricConnection(connection).catch(err => console.log(err));
        }
    })
       .catch((error) => serverError(next, error));
}

// Update
export function updateConnection(req: Request, res: Response, next: NextFunction) {
    connectionModel.findById(req.params[idField])
        .populate({ path: connectionRuleField})
        // .populate({ path: lowerItemField })
        .populate({ path: upperItemField })
        .populate({ path: `${upperItemField}.${responsibleUsersField}` })
        .then(async (connection: IConnectionPopulated | null) => {
            if (!connection) { throw notFoundError; }
            checkResponsibility(req.authentication, connection.upperItem);
            await updateHistoricConnection(connection, false);
            let changed = false;
            if (connection.description !== req.body[descriptionField]) {
                connection.description = req.body[descriptionField];
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return connection.save();
        })
        .then(connection => {
            if (connection) {
                const conn = new Connection(connection);
                socket.emit(connectionCat, updateCtx, conn);
                return res.json(conn);
            }
        })
        .catch((error) => serverError(next, error));
}

// Delete
export function deleteConnection(req: Request, res: Response, next: NextFunction) {
    connectionModel.findById(req.params[idField])
    .populate({ path: connectionRuleField})
    // .populate({ path: lowerItemField })
    .populate({ path: upperItemField })
    .populate({ path: `${upperItemField}.${responsibleUsersField}` })
    .then(async (connection: IConnectionPopulated | null) => {
        if (!connection) { throw notFoundError; }
        checkResponsibility(req.authentication, connection.upperItem);
        await updateHistoricConnection(connection, true);
        return connection.remove();
    })
    .then(connection => {
        if (connection) {
            const conn = new Connection(connection);
            socket.emit(connectionCat, deleteCtx, conn);
            return res.json(conn);
        }
    })
    .catch((error) => serverError(next, error));
}
