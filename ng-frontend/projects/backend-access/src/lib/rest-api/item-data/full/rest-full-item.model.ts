import { IRestItem } from '../rest-item.model';
import { IRestFullConnection } from './rest-full-connection.model';

export interface IRestFullItem extends IRestItem {
    connectionsToUpper?: IRestFullConnection[];
    connectionsToLower?: IRestFullConnection[];
}
