import { AttributeGroup } from './attribute-group.model';
import { AttributeType } from './attribute-type.model';
import { ConnectionRule } from './connection-rule.model';
import { ConnectionType } from './connection-type.model';
import { ItemType } from './item-type.model';
import { UserRole } from './user-role.enum';
import { ItemTypeAttributeGroupMapping } from './item-type-attribute-group-mapping.model';
import { RestMetaData } from '../../rest-api/meta-data/meta-data.model';
import { OldRestMetaData } from '../../old-rest-api/meta-data/meta-data.model';

export class MetaData {
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    itemTypeAttributeGroupMappings: ItemTypeAttributeGroupMapping[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
    userName: string;
    userRole: UserRole;

    constructor(meta?: RestMetaData | OldRestMetaData) {
        if (meta) {
            if (meta instanceof RestMetaData) {
                this.attributeGroups = meta.attributeGroups?.map(a => new AttributeGroup(a));
                this.attributeTypes = meta.attributeTypes?.map(a => new AttributeType(a));
                this.itemTypeAttributeGroupMappings = meta.itemTypeAttributeGroupMappings?.map(m => new ItemTypeAttributeGroupMapping(m));
                this.connectionRules = meta.connectionRules?.map(c => new ConnectionRule(c));
                this.connectionTypes = meta.connectionTypes?.map(c => new ConnectionType(c));
                this.itemTypes = meta.itemTypes?.map(i => new ItemType(i));
            } else {
                this.attributeGroups = meta.attributeGroups?.map(a => new AttributeGroup(a));
                this.attributeTypes = meta.attributeTypes?.map(a => new AttributeType(a));
                this.itemTypeAttributeGroupMappings = meta.itemTypeAttributeGroupMappings?.map(m => new ItemTypeAttributeGroupMapping(m));
                this.connectionRules = meta.connectionRules?.map(c => new ConnectionRule(c));
                this.connectionTypes = meta.connectionTypes?.map(c => new ConnectionType(c));
                this.itemTypes = meta.itemTypes?.map(i => new ItemType(i));
            }
            this.userName = meta.userName;
            this.userRole = meta.userRole;
        }
    }
}
