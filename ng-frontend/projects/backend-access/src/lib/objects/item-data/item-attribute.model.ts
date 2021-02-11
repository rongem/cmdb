import { RestAttribute } from '../../rest-api/item-data/rest-attribute.model';

export class ItemAttribute {
    id: string;
    itemId: string;
    typeId: string;
    type?: string;
    value: string;
    lastChange?: Date;
    version?: number;

    constructor(attribute?: RestAttribute) {
        if (attribute) {
            this.id = attribute.id;
            this.itemId = attribute.itemId;
            this.typeId = attribute.typeId;
            this.type = attribute.type;
            this.value = attribute.value;
        }
    }
}
