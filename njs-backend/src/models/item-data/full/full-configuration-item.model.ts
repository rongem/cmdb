import { ConfigurationItem } from '../configuration-item.model';
import { IConfigurationItem } from '../../mongoose/configuration-item.model';
import { FullConnection } from './full-connection.model';

export class FullConfigurationItem extends ConfigurationItem {
    connectionsToUpper?: FullConnection[];
    connectionsToLower?: FullConnection[];

    constructor(item?: IConfigurationItem, connectionsToUpper?: FullConnection[], connectionsToLower?: FullConnection[]) {
        super(item);
        this.connectionsToUpper = connectionsToUpper;
        this.connectionsToLower = connectionsToLower;
    }
}
