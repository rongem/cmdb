import { NamedObject } from './named-object';
import { AssetStatus } from './asset-status.enum';
import { Model } from './model.model';

export class Asset extends NamedObject {
    status: AssetStatus;
    serialNumber: string;
    assetType: NamedObject;
    model: Model;
}
