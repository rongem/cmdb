import { IUser } from '../../src/models/mongoose/user.model';
import { ConfigurationItem } from '../../src/models/item-data/configuration-item.model';

declare global {
    namespace Express {
        interface Request {
            authentication: IUser;
            userName: string;
            configurationItem: ConfigurationItem;
        }
    }
}