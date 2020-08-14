import { Request, Response, NextFunction } from 'express';

import { configurationItemModel,
  IAttribute,
  IConfigurationItem,
} from '../../models/mongoose/configuration-item.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { connectionModel } from '../../models/mongoose/connection.model';
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
  disallowedChangingOfItemTypeMsg,
  disallowedChangingOfAttributeTypeMsg,
} from '../../util/messages.constants';
import {
  typeIdField,
  attributesField,
  pageField,
  idField,
  nameField,
  linksField,
  itemTypeField,
  responsibleUsersField,
  typeField,
} from '../../util/fields.constants';
import { configurationItemCat, connectionCat, createCtx, updateCtx, deleteCtx, deleteManyCtx } from '../../util/socket.constants';

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

function getHistoricItem(oldItem: IConfigurationItem) {
  return {
    name: oldItem.name,
    typeName: oldItem.type.name,
    attributes: oldItem.attributes.map(a => ({
      _id: a._id,
      typeId: a.type._id,
      typeName: a.type.name,
      value: a.value,
    })),
    links: oldItem.links.map(l => ({
      _id: l._id,
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

async function updateHistory(itemId: any, historicItem: any, deleted: boolean = false) {
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

// Read
export async function getConfigurationItems(req: Request, res: Response, next: NextFunction) {
  const max = 1000;
  const totalItems = await configurationItemModel.find().estimatedDocumentCount();
  configurationItemModel.find()
    .skip((+req.params[pageField] - 1) * max)
    .limit(max)
    .then((items) =>
      res.json({
        items: items.map((item) => new ConfigurationItem(item)),
        totalItems,
      })
    )
    .catch((error) => serverError(next, error));
}

export function getConfigurationItemsByType(req: Request, res: Response, next: NextFunction) {
  configurationItemModel.find({ type: req.params[idField] })
    .then((items) => res.json(items.map((item) => new ConfigurationItem(item))))
    .catch((error) => serverError(next, error));
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
      const ci = new ConfigurationItem(item);
      socket.emit(configurationItemCat, createCtx, ci);
      res.status(201).json(ci);
      const itemType = await itemTypeModel.findById(item.type) ?? {name: ''};
      return historicCiModel.create({_id: item._id, typeId: item.type, typeName: itemType.name} as IHistoricCi);
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
      checkResponsibility(req.authentication, item);
      if (item.type._id.toString() !== req.body[typeIdField]) {
        throw new HttpError(422, disallowedChangingOfItemTypeMsg, {
          oldType: item.type.toString(),
          newType: req.body[typeIdField],
        });
      }
      const historicItem = getHistoricItem(item);
      let changed = false;
      if (item.name !== req.body[nameField]) {
        item.name = req.body[nameField];
        changed = true;
      }
      const attributes = (req.body[attributesField] ?? []) as unknown as ItemAttribute[];
      const attributePositionsToDelete: number[] = [];
      item.attributes.forEach((a: IAttribute, index: number) => {
        const changedAtt = attributes.find(at => at.id === a._id.toString());
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
      // tbd: links
      if (!changed) {
        res.sendStatus(304);
        return;
      }
      await updateHistory(item._id, historicItem);
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
        .populate({ path: 'connectionType', select: nameField });
      connectionModel.deleteMany({ $or: [{ upperItem: item._id }, { lowerItem: item._id }] }).exec();
      const historicItem = getHistoricItem(item);
      updateHistory(item._id, historicItem, true);
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
      return res.status(200).json({ item, connections });
    })
    .catch(error => serverError(next, error));
}
