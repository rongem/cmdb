import { Request, Response, NextFunction } from 'express';

import { serverError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';
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
  countField,
  connectionsToUpperField,
  connectionsToLowerField,
  nameOrValueField,
  itemTypeIdField,
  changedBeforeField,
  changedAfterField,
  responsibleUserField,
  extraSearchField,
  maxLevelsField,
  searchDirectionField,
  textField,
} from '../../util/fields.constants';
import {
  configurationItemCtx,
  connectionCtx,
  createAction,
  updateAction,
  deleteAction,
  deleteManyAction,
  createManyAction
} from '../../util/socket.constants';
import socket from '../socket.controller';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';
import { createConnectionsForFullItem } from '../../models/abstraction-layer/item-data/connection.al';
import {
  configurationItemModelUpdate,
  configurationItemModelCreate,
  configurationItemModelFindAll,
  configurationItemModelFind,
  configurationItemModelFindSingle,
  configurationItemModelTakeResponsibility,
  configurationItemModelAbandonResponsibility,
  configurationItemModelFindOne,
  configurationItemModelGetProposals,
} from '../../models/abstraction-layer/item-data/configuration-item.al';
import {
  configurationItemModelDelete,
  modelAvailableItemsForConnectionRuleAndCount,
  modelGetAllowedLowerConfigurationItemsForRule,
  modelGetAllowedUpperConfigurationItemsForRule,
  modelFindAndReturnConnectionsToLower,
  modelFindAndReturnConnectionsToUpper,
  modelGetFullConfigurationItemsByIds,
  modelGetFullConfigurationItemsByTypeIds,
} from '../../models/abstraction-layer/item-data/multi-model.al';
import { SearchContent } from '../../models/item-data/search/search-content.model';
import { modelSearchItems, modelSearchNeighbor } from '../../models/abstraction-layer/item-data/search.al';
import { Direction, NeighborSearch } from '../../models/item-data/search/neighbor-search.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { attributeTypeModelFindAll } from '../../models/abstraction-layer/meta-data/attribute-type.al';
import { itemTypeModelFindSingle } from '../../models/abstraction-layer/meta-data/item-type.al';

// Read
export function getConfigurationItems(req: Request, res: Response, next: NextFunction) {
  const max = 1000;
  const page = +(req.query[pageField] ?? req.params[pageField] ?? req.body[pageField] ?? 1);
  configurationItemModelFindAll(page, max)
    .then((result) => res.json(result))
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemsByIds(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFind({ _id: { $in: req.params[itemsField] } })
    .then((items) => res.json(items))
    .catch((error: any) => serverError(next, error));
}

export function getFullConfigurationItemsByIds(req: Request, res: Response, next: NextFunction) {
  const itemIds = req.params[itemsField] as unknown as string[];
  modelGetFullConfigurationItemsByIds(itemIds)
    .then((result) => res.json(result))
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemsByTypes(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFind({ type: { $in: req.params[idField] as unknown as string[] } })
    .then((items) => res.json(items))
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemByTypeAndName(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFindOne(req.params[nameField], req.params[typeIdField])
    .then(item => {
      res.json(item);
    })
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemsByTypeWithConnections(req: Request, res: Response, next: NextFunction) {
  const typeIds = req.params[idField] as unknown as string[];
  modelGetFullConfigurationItemsByTypeIds(typeIds)
    .then((items: FullConfigurationItem[]) => {
      res.json(items);
    })
    .catch((error: any) => serverError(next, error));
}

// find all items that are not connected due to the given rule or whose connection count doesn't exceed the allowed range
export function getAvailableItemsForConnectionRuleAndCount(req: Request, res: Response, next: NextFunction) {
  const itemsCountToConnect = +req.params[countField];
  const connectionRule = req.params[connectionRuleField];
  modelAvailableItemsForConnectionRuleAndCount(connectionRule, itemsCountToConnect)
    .then((items) => res.json(items))
    .catch((error: any) => serverError(next, error));
}

// find all items that have free connections to upper item type left
export function getConnectableAsLowerItemForRule(req: Request, res: Response, next: NextFunction) {
  modelGetAllowedLowerConfigurationItemsForRule(req.params[connectionRuleField])
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

// find all items that have free connections to upper item type left and are not connected to current item
export function getConnectableAsLowerItem(req: Request, res: Response, next: NextFunction) {
  const connectionRuleId = req.params[connectionRuleField];
  const itemId = req.params[idField];
  modelGetAllowedLowerConfigurationItemsForRule(connectionRuleId, itemId)
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

// find all items that have free connections to lower item type left and are not connected to current item
export function getConnectableAsUpperItem(req: Request, res: Response, next: NextFunction) {
  const connectionRuleId = req.params[connectionRuleField];
  const itemId = req.params[idField];
  modelGetAllowedUpperConfigurationItemsForRule(connectionRuleId, itemId)
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

export function searchItems(req: Request, res: Response, next: NextFunction) {
  const search = getSearchContent(req.body);
  modelSearchItems(search)
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

function getSearchContent(bodyPart: any): SearchContent {
  return {
    nameOrValue: bodyPart[nameOrValueField],
    itemTypeId: bodyPart[itemTypeIdField],
    attributes: bodyPart[attributesField],
    connectionsToLower: bodyPart[connectionsToLowerField],
    connectionsToUpper: bodyPart[connectionsToUpperField],
    changedBefore: bodyPart[changedBeforeField],
    changedAfter: bodyPart[changedAfterField],
    responsibleUser: bodyPart[responsibleUserField],
  };
}

export function searchFullItems(req: Request, res: Response, next: NextFunction) {
  const search = getSearchContent(req.body);
  modelSearchItems(search, true)
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

export function searchNeighbors(req: Request, res: Response, next: NextFunction) {
  let searchDirection: Direction;
  switch (req.body[searchDirectionField]) {
    case 'up':
      searchDirection = Direction.up;
      break;
    case 'down':
      searchDirection = Direction.down;
      break;
    default:
      searchDirection = Direction.both;
  }
  const search: NeighborSearch = {
    itemTypeId: req.body[itemTypeIdField],
    maxLevels: +req.body[maxLevelsField],
    searchDirection,
    sourceItem: req.params[idField],
  };
  if (req.body[extraSearchField]) {
    search.extraSearch = getSearchContent(req.body[extraSearchField]);
  }
  modelSearchNeighbor(search)
    .then(items => res.json(items))
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItem(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFindSingle(req.params[idField])
    .then((item: ConfigurationItem) => item ? res.json(item) : null)
    .catch((error: any) => serverError(next, error));
}

export function getConfigurationItemWithConnections(req: Request, res: Response, next: NextFunction) {
  configurationItemModelFindSingle(req.params[idField])
    .then(async (item: FullConfigurationItem) => {
      item.connectionsToUpper = await modelFindAndReturnConnectionsToUpper(req.params[idField]);
      item.connectionsToLower = await modelFindAndReturnConnectionsToLower(req.params[idField]);
      res.json(item);
    })
    .catch((error: any) => serverError(next, error));
}

export function getTextProposals(req: Request, res: Response, next: NextFunction) {
  const text = req.params[textField];
  const items = true;
  const attributes = true;
  configurationItemModelGetProposals(text, items, attributes)
    .then(words => res.json(words))
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
  const itemType = req.itemType ?? await itemTypeModelFindSingle(type);
  const connectionsToUpper = req.body[connectionsToUpperField];
  const connectionsToLower = req.body[connectionsToLowerField];
  const expectedUsers = (req.body[responsibleUsersField] as string[] ?? []);
  const attributeTypes = req.attributeTypes ?? await attributeTypeModelFindAll();
  try {
    const item = await configurationItemModelCreate(expectedUsers, userId, authentication, name, type, attributes, links,
      itemType, attributeTypes);
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
export async function updateConfigurationItem(req: Request, res: Response, next: NextFunction) {
  const itemId = req.params[idField] as string;
  const itemName = req.body[nameField] as string;
  const itemTypeId = req.body[typeIdField] as string;
  const responsibleUserNames = req.body[responsibleUsersField] as string[];
  const attributes = (req.body[attributesField] ?? []) as ItemAttribute[];
  const links = (req.body[linksField] ?? []) as ItemLink[];
  const attributeTypes = req.attributeTypes ?? await attributeTypeModelFindAll();
  configurationItemModelUpdate(req.authentication, itemId, itemName, itemTypeId, responsibleUserNames, attributes, links, attributeTypes)
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
  const id = req.params[idField];
  configurationItemModelDelete(id, req.authentication)
    .then(result => {
      if (result.connections && result.connections.length > 0) {
        if (result.connections.length > 1) {
          socket.emit(deleteManyAction, connectionCtx, result.connections);
        } else {
          socket.emit(deleteAction, connectionCtx, result.connections[0]);
        }
        socket.emit(deleteAction, configurationItemCtx, result.item);
      }
      res.json(result);
    })
    .catch((error: any) => serverError(next, error));
}

export function abandonResponsibilityForItem(req: Request, res: Response, next: NextFunction) {
  const id = req.params[idField];
  configurationItemModelAbandonResponsibility(id, req.authentication)
    .then(item => res.json(item))
    .catch((error: HttpError) => {
      if (error.httpStatusCode === 304) {
        res.sendStatus(304);
        return;
      }
      serverError(next, error);
    });
}

