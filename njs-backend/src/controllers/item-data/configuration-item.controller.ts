import { Request, Response, NextFunction } from 'express';

import { configurationItemModel,
  IConfigurationItem,
  ItemFilterConditions,
} from '../../models/mongoose/configuration-item.model';
import { getAllowedLowerConfigurationItemsForRule } from '../../models/mongoose/functions';
import { connectionModel, IConnection, IConnectionPopulated } from '../../models/mongoose/connection.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';
import { Connection } from '../../models/item-data/connection.model';
import {
  typeIdField,
  attributesField,
  pageField,
  idField,
  nameField,
  linksField,
  itemsField,
  responsibleUsersField,
  connectionRuleField,
  connectionTypeField,
  countField,
  connectionsToUpperField,
  connectionsToLowerField,
} from '../../util/fields.constants';
import { configurationItemCtx, connectionCtx, createAction, updateAction, deleteAction, deleteManyAction, createManyAction } from '../../util/socket.constants';
import socket from '../socket.controller';
import { logAndRemoveConnection } from './connection.al';
import { MongooseFilterQuery } from 'mongoose';
import { IConnectionRule, connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { checkResponsibility } from '../../routes/validators';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';
import { createConnectionsForFullItem } from './connection.al';
import {
  populateItem,
  getHistoricItem,
  updateItemHistory,
  configurationItemModelUpdate,
  configurationItemModelCreate,
  configurationItemModelFindAll,
  configurationItemModelFind,
  configurationItemModelFindSingle,
  configurationItemModelTakeResponsibility
} from './configuration-item.al';
import { modelGetItemsConnectableAsUpperItem } from './multi-model.al';
import { nothingChanged } from '../../util/messages.constants';

// Helpers
function findAndReturnItems(req: Request, res: Response, next: NextFunction, conditions: ItemFilterConditions) {
  configurationItemModelFind(conditions)
    .then((items) => res.json(items))
    .catch((error: any) => serverError(next, error));
}


// Read
export function getConfigurationItems(req: Request, res: Response, next: NextFunction) {
  const max = 1000;
  const page = +(req.query[pageField] ?? req.params[pageField] ?? req.body[pageField] ?? 1);
  configurationItemModelFindAll(page, max)
    .then((result) => res.json(result))
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemsByIds(req: Request, res: Response, next: NextFunction) {
  findAndReturnItems(req, res, next, { _id: { $in: req.params[itemsField] } });
}

export function getConfigurationItemsByTypes(req: Request, res: Response, next: NextFunction) {
  findAndReturnItems(req, res, next, { type: { $in: req.params[idField] } });
}

export function getConfigurationItemByTypeAndName(req: Request, res: Response, next: NextFunction) {
  findAndReturnItems(req, res, next, { type: req.params[typeIdField], name: req.params[nameField] });
}

export function getConfigurationItemsByTypeWithConnections(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFind({ type: { $in: req.params[idField]}})
    .then(async (items: FullConfigurationItem[]) => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < items.length; index++) {
        items[index].connectionsToUpper = await connectionModel.findAndReturnConnectionsToUpper(items[index].id);
        items[index].connectionsToLower = await connectionModel.findAndReturnConnectionsToLower(items[index].id);
      }
      res.json(items);
    })
    .catch((error: any) => serverError(next, error));
}

// find all items that are not connected due to the given rule or whose connection count doesn't exceed tha
// allowed range
export function getAvailableItemsForConnectionRuleAndCount(req: Request, res: Response, next: NextFunction) {
  const itemsCountToConnect = +req.params[countField];
  const connectionRule = req.params[connectionRuleField];
  connectionModel.find({connectionRule})
    .populate(connectionRuleField)
    .then(async (connections: IConnectionPopulated[] = []) => {
      let cr: IConnectionRule;
      const query: MongooseFilterQuery<Pick<IConfigurationItem, '_id' | 'type'>> = {};
      if (connections.length > 0) {
        const existingItemIds: string[] = [...new Set(connections.map(c => c.lowerItem.id!))];
        cr = connections[0].connectionRule;
        const allowedItemIds: string[] = [];
        existingItemIds.forEach(id => {
          if (cr.maxConnectionsToUpper - itemsCountToConnect >= connections.filter(c => c.lowerItem.toString() === id).length) {
            allowedItemIds.push(id);
          }
        });
        if (existingItemIds.length > 0) {
          if (allowedItemIds.length > 0) {
            query._id = {$or: [{$not: {$in: existingItemIds}}, {$in: allowedItemIds}]};
          }
          query._id = {$not: {$in: existingItemIds}};
        }
      } else {
        cr = await connectionRuleModel.findById(req.params[connectionRuleField]);
        if (!cr) { throw notFoundError; }
      }
      query.type = cr.lowerItemType;
      findAndReturnItems(req, res, next, query);
    })
    .catch((error: any) => serverError(next, error));
}

// find all items that have free connections to upper item type left
export function getConnectableAsLowerItemForRule(req: Request, res: Response, next: NextFunction) {
  getAllowedLowerConfigurationItemsForRule(req.params[connectionRuleField])
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

// find all items that have free connections to upper item type left and are not connected to current item
export function getConnectableAsLowerItem(req: Request, res: Response, next: NextFunction) {
  getAllowedLowerConfigurationItemsForRule(req.params[connectionRuleField], req.params[idField])
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

// find all items that have free connections to lower item type left and are not connected to current item
export function getConnectableAsUpperItem(req: Request, res: Response, next: NextFunction) {
  const connectionRuleId = req.params[connectionRuleField];
  const itemId = req.params[idField];
  modelGetItemsConnectableAsUpperItem(connectionRuleId, itemId)
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

export function searchItems(req: Request, res: Response, next: NextFunction) { // tbd
}

export function searchNeighbors(req: Request, res: Response, next: NextFunction) { // tbd
}

export function getConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFindSingle(req.params[idField])
    .then((item: ConfigurationItem) => item ? res.json(item) : null)
    .catch((error: any) => serverError(next, error));
  }

export function getConfigurationItemForAttributeId(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFind({'attributes._id': req.params[idField]})
    .then(items => {
      if (!items || items.length === 0) {
        throw notFoundError;
      }
      if (items && items.length === 1) {
        res.json(items[0]);
        return;
      }
      res.json(items); // tbd: think about an error handling for this case
    })
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemForLinkId(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFind({'links._id': req.params[idField]})
    .then(items => {
      if (!items || items.length === 0) {
        throw notFoundError;
      }
      if (items && items.length === 1) {
        res.json(items[0]);
        return;
      }
      res.json(items); // tbd: think about an error handling for this case
    })
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemWithConnections(req: Request, res: Response, next: NextFunction) {
  configurationItemModel.readConfigurationItemForId(req.params[idField])
    .then(async (item: FullConfigurationItem) => {
      item.connectionsToUpper = await connectionModel.findAndReturnConnectionsToUpper(req.params[idField]);
      item.connectionsToLower = await connectionModel.findAndReturnConnectionsToLower(req.params[idField]);
      res.json(item);
    })
    .catch((error: any) => serverError(next, error));
}

// Create
export async function createConfigurationItem(req: Request, res: Response, next: NextFunction) {
  const userId = req.authentication.id! as string;
  const authentication = req.authentication;
  const attributes = (req.body[attributesField] ?? []).map((a: ItemAttribute) => ({
    value: a.value,
    type: a.typeId,
  }));
  const links = (req.body[linksField] ?? []).map((l: ItemLink) => ({
    uri: l.uri,
    description: l.description,
  }));
  const name = req.body[nameField] as string;
  const type = req.body[typeIdField] as string;
  const connectionsToUpper = req.body[connectionsToUpperField];
  const connectionsToLower = req.body[connectionsToLowerField];
  const expectedUsers = (req.body[responsibleUsersField] as string[] ?? []);
  try {
    const item = await configurationItemModelCreate(expectedUsers, userId, authentication, name, type, attributes, links);
    socket.emit(createAction, configurationItemCtx, item);
    if (connectionsToUpper || connectionsToLower) {
      const result = await createConnectionsForFullItem(item, req.connectionRules, req.configurationItems, connectionsToUpper, connectionsToLower);
      socket.emit(createManyAction, connectionCtx, result.createdConnections);
      res.status(201).json(result.fullItem);
    } else {
      res.status(201).json(item);
    }
  } catch (error) {
    serverError(next, error);
  }
}

// Update
export function updateConfigurationItem(req: Request, res: Response, next: NextFunction) {
  const itemId = req.params[idField] as string;
  const itemName = req.body[nameField] as string;
  const itemTypeId = req.body[typeIdField] as string;
  const responsibleUserNames = req.body[responsibleUsersField] as string[];
  const attributes = (req.body[attributesField] ?? []) as ItemAttribute[];
  const links = (req.body[linksField] ?? []) as ItemLink[];
  configurationItemModelUpdate(req.authentication, itemId, itemName, itemTypeId, responsibleUserNames, attributes, links)
    .then(item => {
      if (item) {
        socket.emit(updateAction, configurationItemCtx, item);
        res.json(item);
      }
    })
    .catch((error: HttpError) => {
      if (error.httpStatusCode === 304) {
        res.sendStatus(304);
        return;
      }
      serverError(next, error);
    });
}

export function takeResponsibilityForItem(req: Request, res: Response, next: NextFunction) {
  const id = req.params[idField];
  configurationItemModelTakeResponsibility(id, req.authentication)
    .then(item => res.json(item))
    .catch((error: HttpError) => {
      if (error.httpStatusCode === 304) {
        res.sendStatus(304);
        return;
      }
      serverError(next, error);
    });
}

// Delete
export function deleteConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModel.findById(req.params[idField]).populate({ path: responsibleUsersField, select: nameField })
    .then(async (item: IConfigurationItem) => {
      if (!item) {
        throw notFoundError;
      }
      checkResponsibility(req.authentication, item);
      const deletedConnections: IConnection[] = await connectionModel
        .find({ $or: [{ upperItem: item._id }, { lowerItem: item._id }] })
        .populate(connectionRuleField).populate(`${connectionRuleField}.${connectionTypeField}`);
      deletedConnections.forEach(c => logAndRemoveConnection(c));
      const historicItem = getHistoricItem(item);
      updateItemHistory(item._id, historicItem, true);
      const deletedItem = await item.remove();
      return { deletedItem, deletedConnections };
    })
    .then((result: { deletedItem: IConfigurationItem, deletedConnections: IConnection[] }) => {
      const item = new ConfigurationItem(result.deletedItem);
      socket.emit(deleteAction, configurationItemCtx, item);
      const connections: Connection[] = [];
      if (result.deletedConnections.length > 1) {
        result.deletedConnections.forEach((c) =>
          connections.push(new Connection(c))
        );
        socket.emit(deleteManyAction, connectionCtx, connections);
      } else if (result.deletedConnections.length === 1) {
        connections.push(new Connection(result.deletedConnections[0]));
        socket.emit(deleteAction, connectionCtx, connections[0]);
      }
      return res.json({ item, connections });
    })
    .catch((error: any) => serverError(next, error));
}

export function abandonResponsibilityForItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModel.findById(req.params[idField])
    .then((item: IConfigurationItem) => {
      if (!item) {
        throw notFoundError;
      }
      if (!item.responsibleUsers.map(u => u._id.toString()).includes(req.authentication.id)) {
        res.sendStatus(304);
        return;
      }
      item.responsibleUsers.splice(item.responsibleUsers.findIndex(u => u.toString() === req.authentication.id, 1));
      return item.save();
    })
    .then(populateItem)
    .then((item: IConfigurationItem) => {
      if (item) {
        const ci = new ConfigurationItem(item);
        socket.emit(updateAction, configurationItemCtx, item);
        res.json(ci);
      }
    })
    .catch((error: any) => serverError(next, error));
}

