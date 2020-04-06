import { Guid } from '../../guid';

export class ItemAttribute {
    AttributeId: Guid;
    ItemId: Guid;
    AttributeTypeId: Guid;
    AttributeTypeName: string;
    AttributeValue: string;
    AttributeLastChange: Date;
    AttributeVersion: number;
}
