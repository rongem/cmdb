import { RestItem } from '../rest-item.model';
import { RestFullConnection } from './rest-full-connection.model';

export class RestFullItem extends RestItem {
    connectionsToUpper?: RestFullConnection[];
    connectionsToLower?: RestFullConnection[];
}
