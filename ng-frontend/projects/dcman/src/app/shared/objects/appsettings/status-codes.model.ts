import { AssetStatus } from '../asset/asset-status.enum';

export class StatusCode {
    code: AssetStatus;
    name: string;
    description: string;
    color: string;
}

export class StatusCodes {
    Booked: StatusCode;
    Error: StatusCode;
    Fault: StatusCode;
    InProduction: StatusCode;
    RepairPending: StatusCode;
    PendingScrap: StatusCode;
    PrepareForScrap: StatusCode;
    Scrapped: StatusCode;
    Stored: StatusCode;
    Unknown: StatusCode;
    Unused: StatusCode;
}
