import { IUser } from '../../src/models/mongoose/user.model';
import { IAttributeGroup } from '../../src/models/mongoose/attribute-group.model';
import { IAttributeType } from '../../src/models/mongoose/attribute-type.model';
import { IConfigurationItem } from '../../src/models/mongoose/configuration-item.model';
import { IConnectionType } from '../../src/models/mongoose/connection-type.model';
import { IConnection } from '../../src/models/mongoose/connection.model';

declare global {
    namespace Express {
        interface Request {
            authentication: IUser;
            userName: string;
            configurationItem: IConfigurationItem;
            configurationItems: IConfigurationItem[];
            // attributeGroup: IAttributeGroup;
            attributeType: IAttributeType;
            attributeTypes: IAttributeType[];
            connectionType: IConnectionType;
            connectionRule: IConnectionRule;
            connectionRules: IConnectionRule[];
            itemType: IItemType;
            conn: IConnection; // abbreviation because of existing property
        }
    }
}