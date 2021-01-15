import { configurationItemModel,
  IAttribute,
  IConfigurationItem,
  ILink,
  IConfigurationItemPopulated,
  ItemFilterConditions,
} from '../../models/mongoose/configuration-item.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { historicCiModel, IHistoricCi } from '../../models/mongoose/historic-ci.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';
import {
  disallowedChangingOfAttributeTypeMsg,
  disallowedChangingOfItemTypeMsg,
  nothingChanged,
} from '../../util/messages.constants';
import {
  attributesField,
  itemTypeField,
  nameField,
  responsibleUsersField,
  typeField,
} from '../../util/fields.constants';
import { checkResponsibility } from '../../routes/validators';
import { IUser } from '../../models/mongoose/user.model';
import { getUsersFromAccountNames } from '../meta-data/user.al';

export async function configurationItemModelFindAll(page: number, max: number) {
  const totalItems = await configurationItemModel.find().countDocuments();
  const items: IConfigurationItemPopulated[] = configurationItemModel.find()
    .sort(nameField)
    .skip((page - 1) * max)
    .limit(max)
    .populate({ path: itemTypeField, select: nameField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: responsibleUsersField, select: nameField });
  return {
    items: items.map((item) => new ConfigurationItem(item)),
    totalItems
  };
}

export async function configurationItemModelFind(filter: ItemFilterConditions): Promise<ConfigurationItem[]> {
  const configurationItems: IConfigurationItemPopulated[] = await configurationItemModel.find(filter).sort(nameField)
    .populate({ path: typeField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: responsibleUsersField, select: nameField });
  return configurationItems.map(ci => new ConfigurationItem(ci));
}

export async function configurationItemModelFindOne(name: string, type: string) {
  const configurationItem: IConfigurationItem = await configurationItemModel.findOne({name, type})
    .populate({ path: typeField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: responsibleUsersField, select: nameField });
  return new ConfigurationItem(configurationItem);
}

export function configurationItemModelFindSingle(id: string): Promise<ConfigurationItem> {
  return configurationItemModel.findById(id)
    .populate({ path: typeField })
    .populate({ path: `${attributesField}.${typeField}`, select: nameField })
    .populate({ path: responsibleUsersField, select: nameField })
    .then((configurationItem: IConfigurationItem) => {
        if (!configurationItem) {
            throw notFoundError;
        }
        return new ConfigurationItem(configurationItem);
    });
}

export async function configurationItemModelSingleExists(id: string) {
  const count: number = await configurationItemModel.findById(id).countDocuments();
  return count > 0;
}

export function getHistoricItem(oldItem: IConfigurationItem) {
  return {
    name: oldItem.name,
    typeName: oldItem.type.name,
    attributes: oldItem.attributes.map(a => ({
      _id: a._id,
      typeId: oldItem.type._id ?? oldItem.type,
      typeName: a.type.name ?? '',
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

export async function updateItemHistory(itemId: any, historicItem: any, deleted: boolean = false) {
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

export function populateItem(item?: IConfigurationItem) {
  if (item) {
    return item.populate({ path: responsibleUsersField, select: nameField })
      .populate({ path: `${attributesField}.${typeField}`, select: nameField })
      .populate({ path: typeField, select: nameField }).execPopulate();
  }
}

// Create
export async function configurationItemModelCreate(expectedUsers: string[], userId: string, authentication: IUser, name: string,
                                                   type: string, attributes: ItemAttribute[], links: any) {
  const responsibleUsers: IUser[] = await getUsersFromAccountNames(expectedUsers, userId, authentication);
  // if user who creates this item is not part of responsibilities, add him
  if (!responsibleUsers.map(u => u.id).includes(userId)) {
    responsibleUsers.push();
  }

  const item = await configurationItemModel.create({
    name,
    type,
    responsibleUsers,
    attributes,
    links,
  }).then(populateItem) as IConfigurationItemPopulated;
  historicCiModel.create({ _id: item._id, typeId: item.type.id, typeName: item.type.name } as IHistoricCi);
  return new ConfigurationItem(item);
}

// Update
function updateResponsibleUsers(item: IConfigurationItem, responsibleUsers: IUser[], changed: boolean) {
  const usersToDelete: number[] = [];
  item.responsibleUsers.forEach((u, index) => {
    const del = responsibleUsers.findIndex(us => us.id === u.id);
    if (del > -1) {
      responsibleUsers.splice(del, 1);
    } else {
      usersToDelete.push(index);
    }
  });
  if (usersToDelete.length > 0) {
    usersToDelete.reverse().forEach(n => item.responsibleUsers.splice(n, 1));
    changed = true;
  }
  if (responsibleUsers.length > 0) {
    item.responsibleUsers = item.responsibleUsers.concat(responsibleUsers);
    changed = true;
  }
  return changed;
}

function updateLinks(item: IConfigurationItem, links: ItemLink[], changed: boolean) {
  const linkPositionsToDelete: number[] = [];
  item.links.forEach((l: ILink, index: number) => {
    const changedLink = links.find(il => il.id && il.id === l.id);
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
  });
  // delete links
  linkPositionsToDelete.reverse().forEach(p => item.links.splice(p, 1));
  // create missing links
  links.forEach(l => {
    item.links.push({ uri: l.uri, description: l.description } as ILink);
    changed = true;
  });
  return changed;
}

function updateAttributes(item: IConfigurationItem, attributes: ItemAttribute[], changed: boolean) {
  const attributePositionsToDelete: number[] = [];
  item.attributes.forEach((a: IAttribute, index: number) => {
    const changedAtt = attributes.find(at => at.id && at.id === a.id);
    if (changedAtt) {
      if (changedAtt.typeId === a.type.id) {
        if (changedAtt.value !== a.value) { // regular change
          a.value = changedAtt.value;
          changed = true;
        }
        attributes.splice(attributes.indexOf(changedAtt), 1);
      } else {
        throw new HttpError(422, disallowedChangingOfAttributeTypeMsg, { oldAttribute: a, newAttribute: changedAtt });
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
    item.attributes.push({ type: a.typeId, value: a.value } as IAttribute);
    changed = true;
  });
  return changed;
}

export async function configurationItemModelUpdate(
  authentication: IUser,
  itemId: string,
  itemName: string,
  itemTypeId: string,
  responsibleUserNames: string[],
  attributes: ItemAttribute[],
  links: ItemLink[]) {
  let item: IConfigurationItemPopulated = await configurationItemModel.findByIdAndPopulate(itemId);
  if (!item) {
    throw notFoundError;
  }
  if (item.type.id !== itemTypeId) {
    throw new HttpError(422, disallowedChangingOfItemTypeMsg);
  }
  checkResponsibility(authentication, item, responsibleUserNames);
  const historicItem = getHistoricItem(item);
  let changed = false;
  if (item.name !== itemName) {
    item.name = itemName;
    changed = true;
  }
  // attributes
  changed = updateAttributes(item, attributes, changed);
  // links
  changed = updateLinks(item, links, changed);
  // responsibilities
  const userId = authentication.id! as string;
  const expectedUsers = responsibleUserNames;
  const responsibleUsers = await getUsersFromAccountNames(expectedUsers, userId, authentication);
  changed = updateResponsibleUsers(item, responsibleUsers, changed);
  if (!changed) {
    throw new HttpError(304, nothingChanged);
  }
  await updateItemHistory(item._id, historicItem);
  item = await item.save();
  await populateItem(item);
  return new ConfigurationItem(item);
}

export async function configurationItemModelTakeResponsibility(id: string, authentication: IUser) {
  let item: IConfigurationItem = await configurationItemModel.findById(id);
  if (!item || !authentication) {
    throw notFoundError;
  }
  if (item.responsibleUsers.map(u => u.id).includes(authentication.id)) {
    throw new HttpError(304, nothingChanged);
  }
  item.responsibleUsers.push(authentication._id);
  item = await item.save();
  return await configurationItemModelFindSingle(id);
}

