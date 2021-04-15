import { AssetStatus } from '../asset/asset-status.enum';
import { Model } from '../model.model';
import { Asset } from '../prototypes/asset.model';

export class AssetValue {
    id: string;
    name: string;
    model: Model;
    serialNumber: string;
    status: AssetStatus;
}

export const createAssetValue = (asset: Asset, status: AssetStatus): AssetValue => ({
    id: asset.id,
    name: asset.name,
    model: asset.model,
    serialNumber: asset.serialNumber,
    status,
});

