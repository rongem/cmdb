import { configurationItemModel,
    IAttribute,
    IConfigurationItem,
    ILink,
    IConfigurationItemPopulated,
    ItemFilterConditions,
} from '../../models/mongoose/configuration-item.model';
import { historicCiModel, IHistoricCi } from '../../models/mongoose/historic-ci.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';
import {
    disallowedChangingOfAttributeTypeMsg,
    disallowedChangingOfItemTypeMsg,
    nothingChangedMsg,
} from '../../util/messages.constants';
import { checkResponsibility } from '../../routes/validators';
import { IUser } from '../../models/mongoose/user.model';
import { getUsersFromAccountNames } from '../meta-data/user.al';
import { ObjectId } from 'mongodb';
import { buildHistoricItem, updateItemHistory } from './historic-item.al';

export async function configurationItemModelFindAll(page: number, max: number) {
    let totalItems: number;
    let items: IConfigurationItemPopulated[];
    [totalItems, items] = await Promise.all([
        configurationItemModel.find().countDocuments(),
        configurationItemModel.find()
            .sort('name')
            .skip((page - 1) * max)
            .limit(max)
            .populate({ path: 'itemType', select: 'name' })
            .populate({ path: 'attributes.type', select: 'name' })
            .populate({ path: 'responsibleUsers', select: 'name' })
    ]);
    return {
        items: items.map((item) => new ConfigurationItem(item)),
        totalItems
    };
}

export async function configurationItemModelFind(filter: ItemFilterConditions): Promise<ConfigurationItem[]> {
    const configurationItems: IConfigurationItemPopulated[] = await configurationItemModel.find(filter).sort('name')
        .populate({ path: 'type' })
        .populate({ path: 'attributes.type', select: 'name' })
        .populate({ path: 'responsibleUsers', select: 'name' });
    return configurationItems.map(ci => new ConfigurationItem(ci));
}

export async function configurationItemModelFindOne(name: string, type: string) {
    const configurationItem = await configurationItemModel.findOne({name: { $regex: '^' + name + '$', $options: 'i' }, type})
        .populate({ path: 'type' })
        .populate({ path: 'attributes.type', select: 'name' })
        .populate({ path: 'responsibleUsers', select: 'name' });
    if (!configurationItem) {
        throw notFoundError;
    }
    return new ConfigurationItem(configurationItem);
}

export async function configurationItemModelFindSingle(id: string): Promise<ConfigurationItem> {
    const configurationItem = await configurationItemModel.findById(id)
        .populate({ path: 'type' })
        .populate({ path: 'attributes.type', select: 'name' })
        .populate({ path: 'responsibleUsers', select: 'name' });
    if (!configurationItem) {
        throw notFoundError;
    }
    return new ConfigurationItem(configurationItem);
}

export async function configurationItemModelSingleExists(id: string) {
    const count: number = await configurationItemModel.findById(id).countDocuments();
    return count > 0;
}

export function populateItem(item?: IConfigurationItem) {
    if (item) {
        return item.populate({ path: 'responsibleUsers', select: 'name' })
            .populate({ path: 'attributes.type', select: 'name' })
            .populate({ path: 'type' }).execPopulate();
    }
}

export async function configurationItemModelGetProposals(text: string, lookupItems: boolean, lookupAttributeValues: boolean) {
    if (!(lookupItems || lookupAttributeValues)) {
        throw new Error();
    }
    const lowerText = text.toLocaleLowerCase();
    const queries: ItemFilterConditions[] = [];
    if (lookupItems === true) {
        queries.push({name: {$regex: text, $options: 'i'}});
    }
    if (lookupAttributeValues === true) {
        queries.push({ 'attributes.value': {$regex: text, $options: 'i'}});
    }
    const query = queries.length > 1 ? {$or: queries} : queries[0];
    const items: IConfigurationItem[] = await configurationItemModel.find(query).limit(20);
    const words: string[] = [];
    items.forEach(item => {
        if (lookupItems) {
            if (item.name.toLocaleLowerCase().includes(lowerText)) {
                if (!words.includes(item.name)) {
                    words.push(item.name);
                }
            }
        }
        if (lookupAttributeValues) {
            item.attributes.forEach(attribute => {
                if (attribute.value.toLocaleLowerCase().includes(lowerText)) {
                    if (!words.includes(attribute.value)) {
                        words.push(attribute.value);
                    }
                }
            });
        }
    });
    return words.sort();
}

// Create
export async function configurationItemModelCreate(expectedUsers: string[], userId: string, authentication: IUser, name: string,
                                                   type: string, itemAttributes: ItemAttribute[] | IAttribute[], links: any) {
    const responsibleUsers: IUser[] = await getUsersFromAccountNames(expectedUsers, userId, authentication);
    // if user who creates this item is not part of responsibilities, add him
    if (!responsibleUsers.map(u => u.id).includes(userId)) {
        responsibleUsers.push();
    }
    let attributes: {type: string | ObjectId, value: string}[];
    if (itemAttributes && itemAttributes.length > 0) {
        if ((itemAttributes[0] as ItemAttribute).typeId) {
            attributes = (itemAttributes as ItemAttribute[]).map(a => ({
                type: a.typeId,
                value: a.value,
            }));
        } else {
            attributes = (itemAttributes as IAttribute[]).map(a => ({
                type: a.type,
                value: a.value,
            }));
        }
    } else {
        attributes = [];
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
    let item: IConfigurationItemPopulated | null = await configurationItemModel.findById(itemId)
        .populate({ path: 'type' })
        .populate({ path: 'attributes.type', select: 'name' })
        .populate({ path: 'responsibleUsers', select: 'name' });
    if (!item) {
        throw notFoundError;
    }
    if (item.type.id !== itemTypeId) {
        throw new HttpError(422, disallowedChangingOfItemTypeMsg);
    }
    checkResponsibility(authentication, item, responsibleUserNames);
    const historicItem = buildHistoricItem(item);
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
        throw new HttpError(304, nothingChangedMsg);
    }
    await updateItemHistory(item._id, historicItem);
    item = await item.save().then(populateItem) as IConfigurationItemPopulated;
    return new ConfigurationItem(item);
}

export async function configurationItemModelTakeResponsibility(id: string, authentication: IUser) {
    let item = await configurationItemModel.findById(id);
    if (!item || !authentication) {
        throw notFoundError;
    }
    if (item.responsibleUsers.map(u => u.id).includes(authentication.id)) {
        throw new HttpError(304, nothingChangedMsg);
    }
    item.responsibleUsers.push(authentication._id);
    item = await item.save();
    return await configurationItemModelFindSingle(id);
}

// delete
// deletion of item is in multi-model.as, because connections are also deleted
export async function configurationItemModelAbandonResponsibility(id: string, authentication: IUser) {
    let item = await configurationItemModel.findById(id);
    if (!item || !authentication) {
        throw notFoundError;
    }
    if (!item.responsibleUsers.map(u => u._id.toString()).includes(authentication.id)) {
        throw new HttpError(304, nothingChangedMsg);
    }
    item.responsibleUsers.splice(item.responsibleUsers.findIndex(u => u.toString() === authentication.id, 1));
    item = await item.save();
    return await configurationItemModelFindSingle(id);
}
