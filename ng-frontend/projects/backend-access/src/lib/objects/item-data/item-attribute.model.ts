import { RestItemAttribute } from '../../rest-api/item-data/item-attribute.model';
import { Guid } from '../../guid';

export class ItemAttribute {
    id: string;
    itemId: string;
    typeId: string;
    type?: string;
    value: string;
    lastChange: Date;
    version: number;

    constructor(attribute?: RestItemAttribute) {
        if (attribute) {
            this.id = Guid.parse(attribute.AttributeId).toString();
            this.itemId = Guid.parse(attribute.ItemId).toString();
            this.typeId = Guid.parse(attribute.AttributeTypeId).toString();
            this.typeId = attribute.AttributeTypeName;
            this.value = attribute.AttributeValue;
            this.lastChange = new Date(attribute.AttributeLastChange);
            this.version = attribute.AttributeVersion;
        }
    }
}
