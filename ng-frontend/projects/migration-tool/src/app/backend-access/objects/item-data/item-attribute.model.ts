import { RestItemAttribute } from '../../old-rest-api/item-data/item-attribute.model';
import { Guid } from '../../guid';
import { RestAttribute } from '../../rest-api/item-data/attribute.model';

export class ItemAttribute {
    id: string;
    itemId: string;
    typeId: string;
    type?: string;
    value: string;
    lastChange?: Date;
    version?: number;

    constructor(attribute?: RestItemAttribute | RestAttribute) {
        if (attribute) {
            if ((attribute as RestItemAttribute).AttributeId) {
                attribute = attribute as RestItemAttribute;
                this.id = Guid.parse(attribute.AttributeId).toString();
                this.itemId = Guid.parse(attribute.ItemId).toString();
                this.typeId = Guid.parse(attribute.AttributeTypeId).toString();
                this.type = attribute.AttributeTypeName;
                this.value = attribute.AttributeValue;
                this.lastChange = new Date(+attribute.AttributeLastChange / 10000);
                this.version = attribute.AttributeVersion;
            } else {
                attribute = attribute as RestAttribute;
                this.id = attribute.id;
                this.itemId = attribute.itemId;
                this.typeId = attribute.typeId;
                this.type = attribute.type;
                this.value = attribute.value;
            }
        }
    }
}
