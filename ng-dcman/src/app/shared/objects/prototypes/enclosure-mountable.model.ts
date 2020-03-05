import { Asset } from './asset.model';
import { AssetConnection } from 'src/app/shared/objects/connections/asset-connection.model';

export class EnclosureMountable extends Asset {
    connectionToEnclosure: AssetConnection;
    get slot() { return this.connectionToEnclosure ? this.connectionToEnclosure.minSlot : 0; }
}
