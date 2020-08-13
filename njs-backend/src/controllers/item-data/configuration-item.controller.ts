import { Request, Response, NextFunction } from 'express';

import configurationItemModel, {
  IAttribute,
  IConfigurationItem,
} from '../../models/mongoose/configuration-item.model';
import itemTypeModel from '../../models/mongoose/item-type.model';
import attributeGroupModel from '../../models/mongoose/attribute-group.model';
import attributeTypeModel from '../../models/mongoose/attribute-type.model';
import connectionModel from '../../models/mongoose/connection.model';
import connectionTypeModel from '../../models/mongoose/connection-type.model';
import historyCiModel, { IHistoricCi } from '../../models/mongoose/historic-ci.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';
import { IUser } from '../../models/mongoose/user.model';
import { Connection } from '../../models/item-data/connection.model';
import {
  invalidItemTypeMsg,
  invalidAttributeTypesMsg,
  noDuplicateTypesMsg,
  disallowedAttributeTypesMsg,
  missingResponsibilityMsg,
  disallowedChangingOfItemTypeMsg,
  invalidAttributeValueMsg,
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

// Validation
export async function validateConfigurationItem(req: Request, res: Response, next: NextFunction) {
  try {
    const itemType = await itemTypeModel.findById(req.body[typeIdField]);
    if (!itemType) {
      serverError(
        next,
        new HttpError(404, invalidItemTypeMsg, req.body[typeIdField])
      );
      return;
    }
    const allowedAttributeTypes = await attributeTypeModel.find({
      attributeGroup: { $in: itemType.attributeGroups },
    });
    const attributes: ItemAttribute[] = req.body[attributesField];
    const requestedAttributeTypes = await attributeTypeModel.find({
      _id: { $in: attributes.map((a) => a.typeId) },
    });
    const nonExistingTypes: ItemAttribute[] = [];
    const existingIds: string[] = [];
    const duplicateIds: string[] = [];
    const invalidAttributeValues: ItemAttribute[] = [];
    attributes.forEach((a) => {
      const attributeType = requestedAttributeTypes.find((at) => at._id.toString() === a.typeId);
      if (!attributeType) {
        nonExistingTypes.push(a);
      } else if (existingIds.includes(a.typeId)) {
        duplicateIds.push(a.typeId);
      } else {
        existingIds.push(a.typeId);
        if (!new RegExp(attributeType.validationExpression).test(a.value)) {
          invalidAttributeValues.push(a);
        }
      }
    });
    if (nonExistingTypes.length > 0) {
      serverError(
        next,
        new HttpError(404, invalidAttributeTypesMsg, nonExistingTypes)
      );
      return;
    }
    if (duplicateIds.length > 0) {
      serverError(next, new HttpError(422, noDuplicateTypesMsg, duplicateIds));
      return;
    }
    if (invalidAttributeValues.length > 0) {
      serverError(next, new HttpError(422, invalidAttributeValueMsg, invalidAttributeValues));
    }
    const attributeTypeIds: string[] = allowedAttributeTypes.map((at) =>
      at._id.toString()
    );
    if (attributes.some((a) => !attributeTypeIds.includes(a.typeId))) {
      const nonAllowedTypes: ItemAttribute[] = [];
      attributes.forEach((a) => {
        if (!attributeTypeIds.includes(a.typeId)) {
          nonAllowedTypes.push(a);
        }
      });
      serverError(next, new HttpError(422, disallowedAttributeTypesMsg, nonAllowedTypes));
      return;
    }
    next();
  } catch (error) {
    serverError(next, error);
  }
}

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
    const value = await historyCiModel.findByIdAndUpdate(itemId, { deleted, $push: { oldVersions: historicItem } });
    if (!value) {
      const itemType = await itemTypeModel.findOne({ name: historicItem.typeName });
      return historyCiModel.create({
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

// Read
export async function getConfigurationItems(req: Request, res: Response, next: NextFunction) {
  const max = 1000;
  const totalItems = await configurationItemModel
    .find()
    .estimatedDocumentCount();
  configurationItemModel
    .find()
    .populate({ path: itemTypeField, select: nameField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: responsibleUsersField, select: nameField })
    .sort({ [`${itemTypeField}.${nameField}`]: 1, [nameField]: 1 })
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

export function getConfigurationItemsByType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  configurationItemModel
    .find({ type: req.params[idField] })
    .then((items) => res.json(items.map((item) => new ConfigurationItem(item))))
    .catch((error) => serverError(next, error));
}

export function getConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModel
    .findById(req.params[idField])
    .populate({ path: itemTypeField, select: nameField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: responsibleUsersField, select: nameField })
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
    .then(async item => {
      const ci = new ConfigurationItem(item);
      socket.emit(configurationItemCat, createCtx, ci);
      res.status(201).json(ci);
      const itemType = await itemTypeModel.findById(item.type) ?? {name: ''};
      return historyCiModel.create({_id: item._id, typeId: item.type, typeName: itemType.name} as IHistoricCi);
    })
    .catch((error) => serverError(next, error));
}

// Update
export function updateConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModel
    .findById(req.params[idField])
    .populate({ path: responsibleUsersField, select: nameField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: typeField, select: nameField })
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
    .then((item) => {
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
  configurationItemModel
    .findById(req.params[idField])
    .populate({ path: responsibleUsersField, select: nameField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: typeField, select: nameField })
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
