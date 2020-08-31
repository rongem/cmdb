import { ConfigurationItem } from '../configuration-item.model';
import { Connection } from '../connection.model';
import { IConfigurationItem } from '../../mongoose/configuration-item.model';

export class FullConfigurationItem extends ConfigurationItem {
    connectionsToUpper?: Connection[];
    connectionsToLower?: Connection[];

    constructor(item?: IConfigurationItem, connectionsToUpper?: Connection[], connectionsToLower?: Connection[]) {
        super(item);
        this.connectionsToUpper = connectionsToUpper;
        this.connectionsToLower = connectionsToLower;
    }
}
