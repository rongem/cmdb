import { Guid } from 'backend-access';

export class ConfigurationItem {
    ItemId: Guid;
    ItemType: Guid;
    TypeName?: string;
    ItemName: string;
    ItemLastChange: Date;
    ItemVersion: number;
    ResponsibleUsers?: string[];
}
