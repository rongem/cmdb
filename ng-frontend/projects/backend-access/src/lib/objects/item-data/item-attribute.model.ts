import { IRestAttribute } from '../../rest-api/item-data/rest-attribute.model';

export class ItemAttribute {
    typeId: string;
    type?: string;
    value: string;
    lastChange?: Date;
    version?: number;

    constructor(attribute?: IRestAttribute) {
        if (attribute) {
            this.typeId = attribute.typeId;
            this.type = attribute.type;
            this.value = attribute.value;
        }
    }
}
