import { RestItemTypeAttributeGroupMapping } from '../../rest-api/meta-data/item-type-attribute-group-mapping.model';

export class ItemTypeAttributeGroupMapping {
    attributeGroupId: string;
    itemTypeId: string;

    constructor(mapping?: RestItemTypeAttributeGroupMapping) {
        if (mapping) {
            this.attributeGroupId = mapping.attributeGroupId;
            this.itemTypeId = mapping.itemTypeId;
        }
    }
}
