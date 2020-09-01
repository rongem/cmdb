import { RestFullConnection } from './full-connection.model';
import { RestItem } from './item.model';

export class RestFullConfigurationItem extends RestItem {
    connectionsToUpper: RestFullConnection[];
    connectionsToLower: RestFullConnection[];
}
