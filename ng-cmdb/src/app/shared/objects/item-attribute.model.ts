import { Guid } from 'guid-typescript';

export class ItemAttribute {
    AttributeId: Guid;
    ItemId: Guid;
    AttributeTypeId: Guid;
    AttributeTypeName: Guid;
    AttributeValue: string;
    AttributeLastChange: Date;
    AttributeVersion: number;
}
