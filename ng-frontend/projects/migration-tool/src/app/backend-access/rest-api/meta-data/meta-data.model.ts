import { RestAttributeGroup } from './attribute-group.model';
import { RestAttributeType } from './attribute-type.model';
import { RestConnectionRule } from './connection-rule.model';
import { RestConnectionType } from './connection-type.model';
import { RestItemType } from './item-type.model';
import { RestItemTypeAttributeGroupMapping } from './item-type-attribute-group-mapping.model';

export class RestMetaData {
    attributeGroups: RestAttributeGroup[];
    attributeTypes: RestAttributeType[];
    itemTypeAttributeGroupMappings: RestItemTypeAttributeGroupMapping[];
    connectionRules: RestConnectionRule[];
    connectionTypes: RestConnectionType[];
    itemTypes: RestItemType[];
    userName: string;
    userRole: number;
}
