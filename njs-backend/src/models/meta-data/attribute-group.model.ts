import { IAttributeGroup } from '../mongoose/attribute-group.model';

export class AttributeGroup {
    id!: string;
    name!: string;

    constructor(entity?: IAttributeGroup) {
        if (entity) {
            this.id = entity.id!;
            this.name = entity.name;
        }
    }
}
