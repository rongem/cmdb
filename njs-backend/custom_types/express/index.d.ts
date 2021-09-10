import { AttributeType } from '../../src/models/meta-data/attribute-type.model';
import { ConfigurationItem } from '../../src/models/item-data/configuration-item.model';
import { IConnection } from '../../src/models/mongoose/connection.model';
import { ConnectionRule } from '../../src/models/meta-data/connection-rule.model';
import { ItemType } from '../../src/models/meta-data/item-type.model';
import { UserInfo } from '../../src/models/item-data/user-info.model';
// import { AttributeGroup } from '../../src/models/meta-data/attribute-group.model';
// import { ConnectionType } from '../../src/models/meta-data/connection-type.model';

declare global {
    namespace Express {
        interface Request {
            authentication: UserInfo;
            userName: string;
            // configurationItem: ConfigurationItem;
            configurationItems: ConfigurationItem[];
            // attributeGroup: AttributeGroup;
            attributeType: AttributeType;
            attributeTypes: AttributeType[];
            // connectionType: ConnectionType;
            connectionRule: ConnectionRule;
            connectionRules: ConnectionRule[];
            itemType: ItemType;
            conn: IConnection; // abbreviation because of existing property
        }
    }
}