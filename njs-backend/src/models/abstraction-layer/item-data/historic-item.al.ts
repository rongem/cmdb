import { IConfigurationItem } from '../../mongoose/configuration-item.model';
import { historicCiModel } from '../../mongoose/historic-ci.model';
import { historicConnectionModel, IHistoricConnection } from '../../mongoose/historic-connection.model';
import { itemTypeModel } from '../../mongoose/item-type.model';
import { notFoundError } from '../../../controllers/error.controller';
import { IUser } from '../../mongoose/user.model';

export const historicCiModelFindById = async (id: string) => {
    const [item, connectionsToLower, connectionsToUpper] = await Promise.all([
        historicCiModel.findById(id).then(i => (!!i ? {
            id: (i._id as any).toString(),
            typeId: i.typeId,
            type: i.typeName,
            lastChange: i.createdAt,
            oldVersions: i.oldVersions.map(v => ({
                name: v.name,
                type: v.typeName,
                changedAt: v.lastUpdate,
                changedBy: v.savedBy,
                attributes: v.attributes.map(a => ({
                    typeId: a.typeId,
                    type: a.typeName,
                    value: a.value,
                    id: (a._id as any).toString(),
                })),
                links: v.links.map(l => ({
                    id: (l._id as any).toString(),
                    uri: l.uri,
                    description: l.description,
                })),
                responsibleUsers: v.responsibleUsers.map(u => u.name),
            }))
        } : null)),
        historicConnectionModel.find({upperItemId: id}).then(mapConnections),
        historicConnectionModel.find({lowerItemId: id}).then(mapConnections),
    ]);
    if (!item && connectionsToLower.length === 0 && connectionsToUpper.length === 0) {
        throw notFoundError;
    }
    return { item, connectionsToLower, connectionsToUpper };
}

const mapConnections = (connections: IHistoricConnection[]) => connections.map(c => ({
    id: (c._id as any).toString(),
    ruleId: c.connectionRuleId,
    typeId: c.connectionTypeId,
    typeName: c.connectionTypeName,
    reverseName: c.connectionTypeReverseName,
    upperItemId: c.upperItemId,
    lowerItemId: c.lowerItemId,
    lastChange: c.updatedAt,
    deleted: c.deleted,
    descriptions: [...c.descriptions],
}));

export const buildHistoricItemVersion = (item: IConfigurationItem, userName: string) => {
    return {
        name: item.name,
        typeName: item.typeName,
        attributes: item.attributes.map(a => ({
            typeId: a.type?.toString() ?? a.type.toString(),
            typeName: a.typeName ?? '',
            value: a.value,
        })),
        links: item.links.map(l => ({
            uri: l.uri,
            description: l.description,
        })),
        responsibleUsers: item.responsibleUsers.map(u => ({
            name: (u as IUser).name,
        })),
        lastUpdate: item.updatedAt,
        savedBy: userName,
    };
}

export const updateItemHistory = async (itemId: any, historicItem: any, deleted: boolean = false) => {
    try {
        const value = await historicCiModel.findByIdAndUpdate(itemId, { deleted, $push: { oldVersions: historicItem } });
        if (!value) {
            const itemType = await itemTypeModel.findOne({ name: historicItem.typeName });
            return historicCiModel.create({
                _id: itemId,
                typeId: itemType?._id,
                typeName: itemType?.name ?? historicItem.typeName,
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

