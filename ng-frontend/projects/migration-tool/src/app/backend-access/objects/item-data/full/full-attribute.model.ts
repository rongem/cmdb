import { RestFullAttribute } from '../../../old-rest-api/item-data/full/full-attribute.model';
import { Guid } from '../../../guid';

export class FullAttribute {
    id: string;
    type?: string;
    typeId: string;
    value: string;
    lastChange?: Date;
    version?: number;

    constructor(attribute?: RestFullAttribute) {
        if (attribute) {
            this.id = Guid.parse(attribute.id).toString();
            this.type = attribute.type;
            this.typeId = Guid.parse(attribute.typeId).toString();
            this.value = attribute.value;
            this.version = attribute.version;
            this.lastChange = new Date(+attribute.lastChange / 10000);
        }
    }
}
