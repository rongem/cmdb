import { FullConnection } from './full-connection.model';
import { IRestFullItem } from '../../../rest-api/item-data/full/rest-full-item.model';
import { ConfigurationItem } from '../configuration-item.model';

// @dynamic
export class FullConfigurationItem extends ConfigurationItem {
    userIsResponsible?: boolean;
    connectionsToUpper?: FullConnection[];
    connectionsToLower?: FullConnection[];

    constructor(item?: IRestFullItem, userIsResponsible?: boolean) {
        super(item);
        if (item) {
            this.connectionsToUpper = item.connectionsToUpper?.map(c => new FullConnection(c));
            this.connectionsToLower = item.connectionsToLower?.map(c => new FullConnection(c));
            this.userIsResponsible = !!userIsResponsible;
        }
    }

    static override copyItem(item: FullConfigurationItem): FullConfigurationItem {
        return {
            ...ConfigurationItem.copyItem(item),
            connectionsToUpper: item.connectionsToUpper ? item.connectionsToUpper.map(c => FullConnection.copyConnection(c)) : [],
            connectionsToLower: item.connectionsToLower ? item.connectionsToLower.map(c => FullConnection.copyConnection(c)) : [],
        };
    }

    static mergeItem(item: ConfigurationItem, connectionsToUpper: FullConnection[], connectionsToLower: FullConnection[]): FullConfigurationItem {
        return {
            ...item,
            connectionsToUpper: [...connectionsToUpper],
            connectionsToLower: [...connectionsToLower],
        };
    }
}
