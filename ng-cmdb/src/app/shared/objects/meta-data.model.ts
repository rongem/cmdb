import { AttributeGroup } from './attribute-group.model';
import { AttributeType } from './attribute-type.model';
import { ConnectionRule } from './connection-rule.model';
import { ConnectionType } from './connection-type.model';
import { ItemType } from './item-type.model';
import { UserRole } from '../meta-data.service';
import { GroupAttributeTypeMapping } from './group-attribute-type-mapping.model';
import { ItemTypeAttributeGroupMapping } from './item-type-attribute-group-mapping.model';

export class MetaData {
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    groupAttributeTypeMappings: GroupAttributeTypeMapping[];
    itemTypeAttributeGroupMappings: ItemTypeAttributeGroupMapping[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
    userName: string;
    userRole: UserRole;
}
