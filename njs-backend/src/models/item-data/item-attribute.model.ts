import { IAttribute } from "../mongoose/configuration-item.model";
import { typeField } from '../../util/fields.constants';

export class ItemAttribute {
    id!: string;
    itemId!: string;
    typeId!: string;
    type?: string;
    value!: string;
    lastChange?: Date;

    constructor(attribute?: IAttribute) {
        if (attribute) {
            this.id = attribute._id.toString();
            this.itemId = attribute.parent()._id.toString();
            if (attribute.populated(typeField)) {
                this.typeId = attribute.type._id.toString();
                this.type = attribute.type.name;
            } else {
                this.typeId = attribute.type.toString();
            }
            this.value = attribute.value;
            this.lastChange = attribute.lastChange;
        }
    }
}
