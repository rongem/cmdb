import { RestItemType } from '../../rest-api/meta-data/item-type.model';
import { Guid } from '../../guid';

export class ItemType {
    id!: string;
    name!: string;
    backColor!: string;

    constructor(itemType?: RestItemType) {
        if (itemType) {
            this.id = Guid.parse(itemType.TypeId).toString();
            this.name = itemType.TypeName;
            this.backColor = itemType.TypeBackColor;
        }
    }
}
