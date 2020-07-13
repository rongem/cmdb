import { RestItemTypeAttributeGroupMapping } from '../../rest-api/meta-data/item-type-attribute-group-mapping.model';
import { Guid } from '../../guid';

export class ItemTypeAttributeGroupMapping {
    attributeGroupId!: string;
    itemTypeId!: string;

    constructor(mapping?: RestItemTypeAttributeGroupMapping) {
        if (mapping) {
            this.attributeGroupId = Guid.parse(mapping.GroupId).toString();
            this.itemTypeId = Guid.parse(mapping.ItemTypeId).toString();
        }
    }
}
