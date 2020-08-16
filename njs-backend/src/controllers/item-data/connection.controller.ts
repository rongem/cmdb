import { Request, Response, NextFunction } from 'express';
import { IConnection, IConnectionPopulatedRule, connectionModel } from '../../models/mongoose/connection.model';
import { historicConnectionModel } from '../../models/mongoose/historic-connection.model';
import { connectionRuleField, connectionTypeField, pageField } from '../../util/fields.constants';
import { Connection } from '../../models/item-data/connection.model';
import { serverError } from '../error.controller';

// Helpers
export async function logAndRemoveConnection(connection: IConnection) {
    await updateHistoricConnection(connection, true);
    return connection.remove();
}

async function createHistoricConnection(connection: IConnectionPopulatedRule) {
    if (!connection.populated(connectionRuleField) || !connection.populated(`${connectionRuleField}.${connectionTypeField}`)) {
        await connection.populate(connectionRuleField).populate(`${connectionRuleField}.${connectionTypeField}`).execPopulate();
    }
    return historicConnectionModel.create({
        connectionRuleId: connection.connectionRule._id.toString(),
        connectionTypeId: connection.connectionRule.connectionType._id.toString(),
        connectionTypeName: connection.connectionRule.connectionType.name,
        connectionTypeReverseName: connection.connectionRule.connectionType.reverseName,
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
    connectionModel.find()
      .skip((+req.params[pageField] - 1) * max)
      .limit(max)
      .then((connections) =>
        res.json({
          connections: connections.map(c => new Connection(c)),
          totalConnections,
        })
      )
      .catch((error) => serverError(next, error));
}

export function getConnectionsForUpperItem(req: Request, res: Response, next: NextFunction) {}

export function getConnectionsForLowerItem(req: Request, res: Response, next: NextFunction) {}

export function getConnectionsForItem(req: Request, res: Response, next: NextFunction) {}

export function getConnection(req: Request, res: Response, next: NextFunction) {}

export function getConnectionByContent(req: Request, res: Response, next: NextFunction) {}

// Create
export function createConnection(req: Request, res: Response, next: NextFunction) {}

// Update
export function updateConnection(req: Request, res: Response, next: NextFunction) {}

// Delete
export function deleteConnection(req: Request, res: Response, next: NextFunction) {}
