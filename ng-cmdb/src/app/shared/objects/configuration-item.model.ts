import { Guid } from 'guid-typescript';

export class ConfigurationItem {
    ItemId: Guid;
    ItemItype: Guid;
    TypeName: string;
    ItemName: string;
    ItemLastChange: Date;
    ItemVersion: number;
    ResponsibleUsers: string[];
}
