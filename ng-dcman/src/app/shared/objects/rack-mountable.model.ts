import { Asset } from './asset.model';
import { AssetConnection } from './asset-connection.model';
import { FullConfigurationItem } from './rest-api/full-configuration-item.model';

export class RackMountable extends Asset {
    assetConnection: AssetConnection;
    constructor(item?: FullConfigurationItem) {
        super(item);
    }
}
