import { RestFullAttribute } from '../../../rest-api/item-data/full/full-attribute.model';
import { Guid } from '../../../guid';

export class FullAttribute {
    id: string;
    type?: string;
    typeId: string;
    value: string;

    constructor(attribute?: RestFullAttribute) {
        if (attribute) {
            this.id = Guid.parse(attribute.id).toString();
            this.type = attribute.type;
            this.typeId = Guid.parse(attribute.typeId).toString();
            this.value = attribute.value;
        }
    }
}
