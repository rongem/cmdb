import { IAttributeGroup } from '../../src/models/mongoose/attribute-group.model';
import { IAttributeType } from '../../src/models/mongoose/attribute-type.model';
import { IConfigurationItem } from '../../src/models/mongoose/configuration-item.model';
import { IConnection } from '../../src/models/mongoose/connection.model';
import { UserInfo } from '../../src/models/item-data/user-info.model';
import { ItemType } from '../../src/models/meta-data/item-type.model';
import { ConnectionRule } from '../../src/models/meta-data/connection-rule.model';
// import { ConnectionType } from '../../src/models/meta-data/connection-type.model';

declare global {
    namespace Express {
        interface Request {
            authentication: UserInfo;
            userName: string;
            configurationItem: IConfigurationItem;
            configurationItems: IConfigurationItem[];
            // attributeGroup: IAttributeGroup;
            attributeType: IAttributeType;
            attributeTypes: IAttributeType[];
            // connectionType: ConnectionType;
            connectionRule: ConnectionRule;
            connectionRules: ConnectionRule[];
            itemType: ItemType;
            conn: IConnection; // abbreviation because of existing property
        }
    }
}