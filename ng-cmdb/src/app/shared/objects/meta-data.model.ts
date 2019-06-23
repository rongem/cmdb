import { AttributeGroup } from './attribute-group.model';
import { AttributeType } from './attribute-type.model';
import { ConnectionRule } from './connection-rule.model';
import { ConnectionType } from './connection-type.model';
import { ItemType } from './item-type.model';
import { UserRole } from '../meta-data.service';

export class MetaData {
    attributeGroups: AttributeGroup[];
    attributeTypes: AttributeType[];
    connectionRules: ConnectionRule[];
    connectionTypes: ConnectionType[];
    itemTypes: ItemType[];
    userName: string;
    userRole: UserRole;
}
