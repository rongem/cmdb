import { IItemType } from "../mongoose/item-type.model";

export class ItemType {
    id!: string;
    name!: string;
    backColor!: string;

    constructor(entity?: IItemType) {
        if (entity) {
            this.id = entity._id.toString();
            this.name = entity.name;
            this.backColor = entity.color;
        }
    }
}
