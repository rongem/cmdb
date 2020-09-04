import { IAttribute } from '../mongoose/configuration-item.model';
import { typeField } from '../../util/fields.constants';

export class ItemAttribute {
    id!: string;
    itemId!: string;
    typeId!: string;
    type?: string;
    value!: string;

    constructor(attribute?: IAttribute) {
        if (attribute) {
            this.id = attribute.id;
            this.itemId = attribute.parent().id;
            if (attribute.populated(typeField)) {
                this.typeId = attribute.type.id;
                this.type = attribute.type.name;
            } else {
                this.typeId = attribute.type.toString();
            }
            this.value = attribute.value;
        }
    }
}
