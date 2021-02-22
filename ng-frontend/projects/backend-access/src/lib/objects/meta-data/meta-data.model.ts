import { AttributeGroup } from './attribute-group.model';
import { AttributeType } from './attribute-type.model';
import { ConnectionRule } from './connection-rule.model';
import { ConnectionType } from './connection-type.model';
import { ItemType } from './item-type.model';
import { UserRole } from './user-role.enum';
import { IRestMetaData } from '../../rest-api/meta-data/meta-data.model';

export class MetaData {
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
    userName: string;
    userRole: UserRole;

    constructor(meta?: IRestMetaData) {
        if (meta) {
            this.attributeGroups = meta.attributeGroups?.map(a => new AttributeGroup(a));
            this.attributeTypes = meta.attributeTypes?.map(a => new AttributeType(a));
            this.connectionRules = meta.connectionRules?.map(c => new ConnectionRule(c));
            this.connectionTypes = meta.connectionTypes?.map(c => new ConnectionType(c));
            this.itemTypes = meta.itemTypes?.map(i => new ItemType(i));
            this.userName = meta.userName;
            this.userRole = meta.userRole;
        }
    }
}
