import { AssetStatus } from '../asset/asset-status.enum';
import { Model } from '../model.model';

export class AssetValue {
    id: string;
    name: string;
    model: Model;
    serialNumber: string;
    status: AssetStatus;
}
