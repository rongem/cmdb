import { OldRestAttributeGroup } from './attribute-group.model';
import { OldRestAttributeType } from './attribute-type.model';
import { OldRestConnectionRule } from './connection-rule.model';
import { OldRestConnectionType } from './connection-type.model';
import { OldRestItemType } from './item-type.model';
import { OldRestItemTypeAttributeGroupMapping } from './item-type-attribute-group-mapping.model';

export class OldRestMetaData {
    attributeGroups: OldRestAttributeGroup[];
    attributeTypes: OldRestAttributeType[];
    itemTypeAttributeGroupMappings: OldRestItemTypeAttributeGroupMapping[];
    connectionRules: OldRestConnectionRule[];
    connectionTypes: OldRestConnectionType[];
    itemTypes: OldRestItemType[];
    userName: string;
    userRole: number;
}
