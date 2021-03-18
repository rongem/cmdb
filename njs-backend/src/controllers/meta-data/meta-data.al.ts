import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { attributeGroupModelFindAll } from './attribute-group.al';
import { attributeTypeModelFindAll } from './attribute-type.al';
import { connectionTypeModelFind, connectionTypeModelFindAll } from './connection-type.al';
import { connectionRuleModelFind, connectionRuleModelFindAll } from './connection-rule.al';
import { itemTypeModelFindAll, itemTypeModelFindSingle } from './item-type.al';
import { notFoundError } from '../error.controller';

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
