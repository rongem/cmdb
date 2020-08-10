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
import { handleValidationErrors } from '../../routes/validators';
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
export async function validateConfigurationItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    handleValidationErrors(req);
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
      serverError(
        next,
        new HttpError(422, disallowedAttributeTypesMsg, nonAllowedTypes)
      );
      return;
    }
    next();
  } catch (error) {
    serverError(next, error);
  }
}

function checkResponsibility(
  user: IUser | undefined,
  item: IConfigurationItem
) {
  if (
    !user ||
    !item.responsibleUsers
      .map((u) => u.name.toLocaleLowerCase())
      .includes(user.name.toLocaleLowerCase())
  ) {
    throw new HttpError(403, missingResponsibilityMsg);
  }
}

// Read
export async function getConfigurationItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  handleValidationErrors(req);
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
  handleValidationErrors(req);
  configurationItemModel
    .find({ type: req.params[idField] })
    .then((items) => res.json(items.map((item) => new ConfigurationItem(item))))
    .catch((error) => serverError(next, error));
}

export function getConfigurationItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  handleValidationErrors(req);
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
export function createConfigurationItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  handleValidationErrors(req);
  const lastChange = new Date();
  const userId = req.authentication ? req.authentication._id.toString() : '';
  const attributes = req.body[attributesField].map((a: ItemAttribute) => ({
    value: a.value,
    type: a.typeId,
    lastChange,
  }));
  const links = req.body[linksField].map((l: ItemLink) => ({
    uri: l.uri,
    description: l.description,
  }));
  configurationItemModel
    .create({
      name: req.body[nameField],
      type: req.body[typeIdField],
      lastChange: new Date(),
      responsibleUsers: [userId],
      attributes,
      links,
    })
    .then((item) => {
      const ci = new ConfigurationItem(item);
      socket.emit(configurationItemCat, createCtx, ci);
      return res.status(201).json(ci);
    })
    .catch((error) => serverError(next, error));
}

// Update
export function updateConfigurationItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  handleValidationErrors(req);
  configurationItemModel
    .findById(req.params[idField])
    .populate({ path: responsibleUsersField, select: nameField })
    .then((item) => {
      if (!item) {
        throw notFoundError;
      }
      checkResponsibility(req.authentication, item);
      if (item.type.toString() !== req.body[typeIdField]) {
        throw new HttpError(422, disallowedChangingOfItemTypeMsg, {
          oldType: item.type.toString(),
          newType: req.body[typeIdField],
        });
      }
      let changed = false;
      if (item.name !== req.body[name]) {
        item.name = req.body[name];
        changed = true;
      }
      // tbd: attributes and links
      if (!changed) {
        res.sendStatus(304);
        return;
      }
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
export function deleteConfigurationItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  handleValidationErrors(req);
  configurationItemModel
    .findById(req.params[idField])
    .populate({ path: responsibleUsersField, select: nameField })
    .then(async (item) => {
      if (!item) {
        throw notFoundError;
      }
      checkResponsibility(req.authentication, item);
      const deletedConnections = await connectionModel
        .find({ $or: [{ upperItem: item._id }, { lowerItem: item._id }] })
        .populate({ path: 'connectionType', select: nameField });
      connectionModel.remove(
        { $or: [{ upperItem: item._id }, { lowerItem: item._id }] },
        (err) => serverError(next, err)
      );
      const deletedItem = await item.remove();
      return { deletedItem, deletedConnections };
    })
    .then((result) => {
      const item = new ConfigurationItem(result.deletedItem);
      socket.emit(configurationItemCat, deleteCtx, item);
      const connections: Connection[] = [];
      if (result.deletedConnections.length > 1) {
        result.deletedConnections.forEach((c) =>
          connections.push(new Connection(c))
        );
        socket.emit(connectionCat, deleteManyCtx, connections);
      } else if (result.deletedConnections.length === 1) {
        socket.emit(connectionCat, deleteCtx, new Connection(result.deletedConnections[0]));
      }
      res.json({ item, connections });
    })
    .catch((error) => serverError(next, error));
}
