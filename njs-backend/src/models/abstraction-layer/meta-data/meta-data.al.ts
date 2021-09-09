import { AttributeGroup } from '../../meta-data/attribute-group.model';
import { AttributeType } from '../../meta-data/attribute-type.model';
import { ConnectionType } from '../../meta-data/connection-type.model';
import { ConnectionRule } from '../../meta-data/connection-rule.model';
import { ItemType } from '../../meta-data/item-type.model';
import { attributeGroupModelFindAll } from './attribute-group.al';
import { attributeTypeModelFindAll } from './attribute-type.al';
import { connectionTypeModelFind, connectionTypeModelFindAll } from './connection-type.al';
import { connectionRuleModelFind, connectionRuleModelFindAll } from './connection-rule.al';
import { itemTypeModelFindAll, itemTypeModelFindSingle } from './item-type.al';
import { notFoundError } from '../../../controllers/error.controller';

export async function modelGetMetaData() {
    let attributeGroups: AttributeGroup[];
    let attributeTypes: AttributeType[];
    let connectionTypes: ConnectionType[];
    let connectionRules: ConnectionRule[];
    let itemTypes: ItemType[];
    [attributeGroups, attributeTypes, connectionTypes, connectionRules, itemTypes] = await Promise.all([
        attributeGroupModelFindAll(),
        attributeTypeModelFindAll(),
        connectionTypeModelFindAll(),
        connectionRuleModelFindAll(),
        itemTypeModelFindAll(),
    ]);
    return { attributeGroups, attributeTypes, connectionTypes, connectionRules, itemTypes };
}

export async function modelGetAllowedDownwardConnectionTypesByItemType(itemTypeId: string) {
    let itemType: ItemType;
    let connectionRules: ConnectionRule[];
    [itemType, connectionRules] = await Promise.all([
        itemTypeModelFindSingle(itemTypeId),
        connectionRuleModelFind({upperItemType: itemTypeId})
    ]);
    if (!itemType) {
        throw notFoundError;
    }
    const connectionTypeIds = [...new Set(connectionRules.map(cr => cr.connectionTypeId))];
    const connectionTypes = await connectionTypeModelFind({_id: {$in: connectionTypeIds}});
    return connectionTypes;
}
