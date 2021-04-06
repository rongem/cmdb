import { IAttribute } from '../mongoose/configuration-item.model';

export class ItemAttribute {
    typeId!: string;
    type?: string;
    value!: string;

    constructor(attribute?: IAttribute) {
        if (attribute) {
            this.typeId = attribute.type.toString();
            this.type = attribute.typeName;
            this.value = attribute.value;
        }
    }
}
