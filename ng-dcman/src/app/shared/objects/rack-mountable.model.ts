import { Asset } from './asset.model';
import { AssetConnection } from './asset-connection.model';

export class RackMountable extends Asset {
    assetConnection: AssetConnection;
}
