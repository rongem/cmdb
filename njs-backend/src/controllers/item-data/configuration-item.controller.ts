import { Request, Response, NextFunction } from 'express';

import { configurationItemModel,
  IAttribute,
  IConfigurationItem,
  ILink,
} from '../../models/mongoose/configuration-item.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { connectionModel, IConnectionPopulated } from '../../models/mongoose/connection.model';
import { historicCiModel, IHistoricCi } from '../../models/mongoose/historic-ci.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';
import { IUser } from '../../models/mongoose/user.model';
import { Connection } from '../../models/item-data/connection.model';
import {
  missingResponsibilityMsg,
  disallowedChangingOfAttributeTypeMsg,
} from '../../util/messages.constants';
import {
  typeIdField,
  attributesField,
  pageField,
  idField,
  nameField,
  linksField,
  itemsField,
  responsibleUsersField,
  typeField,
  connectionRuleField,
  connectionTypeField,
  lowerItemField,
  upperItemField,
  countField,
} from '../../util/fields.constants';
import { configurationItemCat, connectionCat, createCtx, updateCtx, deleteCtx, deleteManyCtx } from '../../util/socket.constants';
import { logAndRemoveConnection } from './connection.controller';
import { MongooseFilterQuery } from 'mongoose';
import { IConnectionRule, connectionRuleModel } from '../../models/mongoose/connection-rule.model';

function checkResponsibility(user: IUser | undefined, item: IConfigurationItem) {
  if (
    !user ||
    !item.responsibleUsers
      .map((u) => u.name.toLocaleLowerCase())
      .includes(user.name.toLocaleLowerCase())
  ) {
    throw new HttpError(403, missingResponsibilityMsg);
  }
}

// Helpers

async function getHistoricItem(oldItem: IConfigurationItem) {
  return {
    name: oldItem.name,
    typeName: oldItem.type.name,
    attributes: oldItem.attributes.map(a => ({
      _id: a._id,
      typeId: oldItem.populated(attributesField) ? a.type._id.toString() : a.type.toString(),
      typeName: a.type.name ?? '',
      value: a.value,
    })),
    links: oldItem.links.map(l => ({
      _id: l._id ? l._id.toString() : undefined,
      uri: l.uri,
      description: l.description,
    })),
    responsibleUsers: oldItem.responsibleUsers.map(u => ({
      _id: u._id,
      name: u.name,
    })),
    lastUpdate: oldItem.updatedAt,
  };
}

async function updateItemHistory(itemId: any, historicItem: any, deleted: boolean = false) {
  try {
    const value = await historicCiModel.findByIdAndUpdate(itemId, { deleted, $push: { oldVersions: historicItem } });
    if (!value) {
      const itemType = await itemTypeModel.findOne({ name: historicItem.typeName });
      return historicCiModel.create({
        _id: itemId,
        typeId: itemType?._id,
        typeName: historicItem.typeName,
        oldVersions: [historicItem],
        deleted,
      });
    }
    return value;
  }
  catch (reason) {
    console.log(reason);
  }
}

function populateItem(item?: IConfigurationItem) {
  if (item) {
    return item.populate({ path: responsibleUsersField, select: nameField })
      .populate({ path: `${attributesField}.${typeField}`, select: nameField })
      .populate({ path: typeField, select: nameField }).execPopulate();
  }
}

function findAndReturnItems(req: Request, res: Response, next: NextFunction, conditions: MongooseFilterQuery<Pick<IConfigurationItem,
  "_id" | "createdAt" | "updatedAt" | "currentTime" | "name" | "responsibleUsers" | "attributes" | "type" | "links">>) {
  configurationItemModel.find(conditions)
    .then((items) => res.json(items.map((item) => new ConfigurationItem(item))))
    .catch((error) => serverError(next, error));
}

// Read
export async function getConfigurationItems(req: Request, res: Response, next: NextFunction) {
  const max = 1000;
  const totalItems = await configurationItemModel.find().estimatedDocumentCount();
  configurationItemModel.find()
    .skip((+(req.query[pageField] ?? req.body[pageField] ?? 1) - 1) * max)
    .limit(max)
    .then((items) =>
      res.json({
        items: items.map((item) => new ConfigurationItem(item)),
        totalItems,
      })
    )
    .catch((error) => serverError(next, error));
}

export async function getConfigurationItemsByIds(req: Request, res: Response, next: NextFunction) {
  findAndReturnItems(req, res, next, { _id: { $in: req.params[itemsField] } });
}

export function getConfigurationItemsByType(req: Request, res: Response, next: NextFunction) {
  findAndReturnItems(req, res, next, { type: { $in: req.params[idField] } });
}

// find all items that are not connected due to the given rule or whose connection count doesn't exceed tha
// allowed range
export function getAvailableItemsForConnectionRuleAndCount(req: Request, res: Response, next: NextFunction) {
  const itemsCountToConnect = +req.params[countField];
  connectionModel.find({connectionRule: req.params[connectionRuleField]})
    .populate(connectionRuleField)
    .then(async (connections: IConnectionPopulated[] = []) => {
      let connectionRule: IConnectionRule;
      const query: MongooseFilterQuery<Pick<IConfigurationItem, "_id" | "type">> = {};
      if (connections.length > 0) {
        const existingItemIds: string[] = [...new Set(connections.map(c => c.lowerItem._id.toString()))];
        connectionRule = connections[0].connectionRule;
        const allowedItemIds: string[] = [];
        existingItemIds.forEach(id => {
          if (connectionRule.maxConnectionsToUpper - itemsCountToConnect >= connections.filter(c => c.lowerItem.toString() === id).length) {
            allowedItemIds.push(id);
          }
        });
        if (existingItemIds.length > 0) {
          if (allowedItemIds.length > 0) {
            query._id = {$or: [{$not: {$in: existingItemIds}}, {$in: allowedItemIds}]}
          }
          query._id = {$not: {$in: existingItemIds}};
        }
      } else {
        const cr = await connectionRuleModel.findById(req.params[connectionRuleField]);
        if (!cr) { throw notFoundError; }
        connectionRule = cr;
      }
      query.type = connectionRule.lowerItemType;
      findAndReturnItems(req, res, next, query);
    })
    .catch((error) => serverError(next, error));
}

// find all items that have free connections to upper item type left and are not connected to current item
export function getConnectableAsLowerItem(req: Request, res: Response, next: NextFunction) {
  connectionRuleModel.findById(req.params[connectionRuleField])
    .then(async connectionRule => {
      if (!connectionRule) {
        throw notFoundError;
      }
      const items = await configurationItemModel.find({type: connectionRule.lowerItemType});
      const existingItemIds: string[] = items.map(i => i._id.toString());
      const connections = await connectionModel.find({lowerItem: { $in: existingItemIds } } );
      if (connections.length > 0) {
        const allowedItemIds: string[] = [];
        existingItemIds.forEach(id => {
          if (connectionRule.maxConnectionsToUpper > connections.filter(c =>
            c.upperItem.toString() !== req.params[idField] && c.lowerItem.toString() === id).length) {
            allowedItemIds.push(id);
          }
        });
        res.json(items.filter(item => allowedItemIds.includes(item._id.toString())).map(item => new ConfigurationItem(item)));
      }
    })
    .catch((error) => serverError(next, error));
}

// find all items that have free connections to lower item type left and are not connected to current item
export function getConnectableAsUpperItem(req: Request, res: Response, next: NextFunction) {
  connectionRuleModel.findById(req.params[connectionRuleField])
    .then(async connectionRule => {
      if (!connectionRule) {
        throw notFoundError;
      }
      const items = await configurationItemModel.find({type: connectionRule.upperItemType});
      const existingItemIds: string[] = items.map(i => i._id.toString());
      const connections = await connectionModel.find({upperItem: { $in: existingItemIds } } );
      if (connections.length > 0) {
        const allowedItemIds: string[] = [];
        existingItemIds.forEach(id => {
          if (connectionRule.maxConnectionsToLower > connections.filter(c =>
            c.lowerItem.toString() !== req.params[idField] && c.upperItem.toString() === id).length) {
            allowedItemIds.push(id);
          }
        });
        res.json(items.filter(item => allowedItemIds.includes(item._id.toString())).map(item => new ConfigurationItem(item)));
      }
    })
    .catch((error) => serverError(next, error));
}

export function searchItems(req: Request, res: Response, next: NextFunction) {
}

export function searchNeighbors(req: Request, res: Response, next: NextFunction) {
}

export function getConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModel.findById(req.params[idField])
    .then((item) => {
      if (!item) {
        throw notFoundError;
      }
      res.json(new ConfigurationItem(item));
    })
    .catch((error) => serverError(next, error));
}

// Create
export function createConfigurationItem(req: Request, res: Response, next: NextFunction) {
  const userId = req.authentication ? req.authentication._id.toString() : '';
  const attributes = (req.body[attributesField] ?? []).map((a: ItemAttribute) => ({
    value: a.value,
    type: a.typeId,
  }));
  const links = (req.body[linksField] ?? []).map((l: ItemLink) => ({
    uri: l.uri,
    description: l.description,
  }));
  configurationItemModel
    .create({
      name: req.body[nameField],
      type: req.body[typeIdField],
      responsibleUsers: [userId],
      attributes,
      links,
    })
    .then(populateItem)
    .then(async item => {
      if (item) {
        const ci = new ConfigurationItem(item);
        socket.emit(configurationItemCat, createCtx, ci);
        res.status(201).json(ci);
        const itemType = await itemTypeModel.findById(item.type) ?? {name: ''};
        return historicCiModel.create({_id: item._id, typeId: item.type, typeName: itemType.name} as IHistoricCi);
      }
    })
    .catch((error) => serverError(next, error));
}
// Update
export function updateConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModel.findById(req.params[idField])
    .then(async item => {
      if (!item) {
        throw notFoundError;
      }
      await populateItem(item);
      checkResponsibility(req.authentication, item);
      const historicItem = getHistoricItem(item);
      let changed = false;
      if (item.name !== req.body[nameField]) {
        item.name = req.body[nameField];
        changed = true;
      }
      // attributes
      const attributes = (req.body[attributesField] ?? []) as unknown as ItemAttribute[];
      const attributePositionsToDelete: number[] = [];
      item.attributes.forEach((a: IAttribute, index: number) => {
        const changedAtt = attributes.find(at => at.id && at.id === a._id.toString());
        if (changedAtt) {
          if (changedAtt.typeId === a.type._id.toString()) {
            if (changedAtt.value !== a.value) { // regular change
              a.value = changedAtt.value;
              changed = true;
            }
            attributes.splice(attributes.indexOf(changedAtt), 1);
          } else {
            throw new HttpError(422, disallowedChangingOfAttributeTypeMsg, {oldAttribute: a, newAttribute: changedAtt});
          }
        } else { // no attribute found, so it was deleted
          attributePositionsToDelete.push(index);
          changed = true;
        }
      });
      // delete attributes
      attributePositionsToDelete.reverse().forEach(p => item.attributes.splice(p, 1));
      // create missing attributes
      attributes.forEach(a => {
        item.attributes.push({type: a.typeId, value: a.value} as IAttribute);
        changed = true;
      });
      // links
      const links = (req.body[linksField] ?? []) as unknown as ItemLink[];
      const linkPositionsToDelete: number[] = [];
      item.links.forEach((l: ILink, index: number) => {
        const changedLink = links.find(il => il.id && il.id === l._id.toString());
        if (changedLink) {
          links.splice(links.indexOf(changedLink), 1);
          if (changedLink.uri !== l.uri) {
            l.uri = changedLink.uri;
            changed = true;
          }
          if (changedLink.description !== l.description) {
            l.description = changedLink.description;
            changed = true;
          }
        } else {
          linkPositionsToDelete.push(index);
          changed = true;
        }
      })
      // delete links
      linkPositionsToDelete.reverse().forEach(p => item.links.splice(p, 1));
      // create missing links
      links.forEach(l => {
        item.links.push({uri: l.uri, description: l.description} as ILink);
        changed = true;
      });
      if (!changed) {
        res.sendStatus(304);
        return;
      }
      await updateItemHistory(item._id, historicItem);
      return item.save();
    })
    .then(populateItem)
    .then(item => {
      if (item) {
        const ci = new ConfigurationItem(item);
        socket.emit(configurationItemCat, updateCtx, item);
        res.json(ci);
      }
    })
    .catch((error) => serverError(next, error));
}

// Delete
export function deleteConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModel.findById(req.params[idField])
    .then(async item => {
      if (!item) {
        throw notFoundError;
      }
      checkResponsibility(req.authentication, item);
      const deletedConnections = await connectionModel
        .find({ $or: [{ upperItem: item._id }, { lowerItem: item._id }] })
        .populate(connectionRuleField).populate(`${connectionRuleField}.${connectionTypeField}`);
      deletedConnections.forEach(c => logAndRemoveConnection(c));
      const historicItem = getHistoricItem(item);
      updateItemHistory(item._id, historicItem, true);
      const deletedItem = await item.remove();
      return { deletedItem, deletedConnections };
    })
    .then(result => {
      const item = new ConfigurationItem(result.deletedItem);
      socket.emit(configurationItemCat, deleteCtx, item);
      const connections: Connection[] = [];
      if (result.deletedConnections.length > 1) {
        result.deletedConnections.forEach((c) =>
          connections.push(new Connection(c))
        );
        socket.emit(connectionCat, deleteManyCtx, connections);
      } else if (result.deletedConnections.length === 1) {
        connections.push(new Connection(result.deletedConnections[0]));
        socket.emit(connectionCat, deleteCtx, connections[0]);
      }
      return res.json({ item, connections });
    })
    .catch(error => serverError(next, error));
}
