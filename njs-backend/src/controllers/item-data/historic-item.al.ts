import { IConfigurationItemPopulated } from '../../models/mongoose/configuration-item.model';
import { historicCiModel } from '../../models/mongoose/historic-ci.model';
import { historicConnectionModel, IHistoricConnection } from '../../models/mongoose/historic-connection.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { notFoundError } from '../error.controller';

export async function historicCiModelFindById(id: string) {
    const [item, connectionsToLower, connectionsToUpper] = await Promise.all([
        historicCiModel.findById(id).then(i => (!!i ? {
            id: i._id.toString(),
            typeId: i.typeId,
            type: i.typeName,
            lastChange: i.createdAt,
            oldVersions: i.oldVersions.map(v => ({
                name: v.name,
                type: v.typeName,
                changedAt: v.lastUpdate,
                attributes: v.attributes.map(a => ({
                    typeId: a.typeId,
                    type: a.typeName,
                    value: a.value,
                    id: a._id.toString(),
                })),
                links: v.links.map(l => ({
                    id: l._id.toString(),
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
    id: c._id.toString(),
    ruleId: c.connectionRuleId,
    typeId: c.connectionTypeId,
    typeName: c.connectionTypeName,
    reverseName: c.connectionTypeReverseName,
    upperItemId: c.upperItemId,
    lowerItemId: c.lowerItemId,
    lastChange: c.updatedAt,
    descriptions: [...c.descriptions],
}));

export function buildHistoricItemOldVersion(oldItem: IConfigurationItemPopulated) {
    return {
        name: oldItem.name,
        typeName: oldItem.type.name,
        attributes: oldItem.attributes.map(a => ({
            typeId: a.type._id?.toString() ?? a.type.toString(),
            typeName: a.type.name ?? '',
            value: a.value,
        })),
        links: oldItem.links.map(l => ({
            uri: l.uri,
            description: l.description,
        })),
        responsibleUsers: oldItem.responsibleUsers.map(u => ({
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

