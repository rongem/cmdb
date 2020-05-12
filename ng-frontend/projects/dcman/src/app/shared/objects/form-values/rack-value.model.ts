import { AssetStatus } from '../asset/asset-status.enum';

export class RackValue {
    id: string;
    name: string;
    modelId: string;
    serialNumber: string;
    status: AssetStatus;
    heightUnits: string;
    roomId: string;
}
