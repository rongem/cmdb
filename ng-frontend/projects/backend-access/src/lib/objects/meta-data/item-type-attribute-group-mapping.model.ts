import { RestItemTypeAttributeGroupMapping } from '../../rest-api/meta-data/item-type-attribute-group-mapping.model';
import { OldRestItemTypeAttributeGroupMapping } from '../../old-rest-api/meta-data/item-type-attribute-group-mapping.model';
import { Guid } from '../../guid';

export class ItemTypeAttributeGroupMapping {
    attributeGroupId: string;
    itemTypeId: string;

    constructor(mapping?: RestItemTypeAttributeGroupMapping | OldRestItemTypeAttributeGroupMapping) {
        if (mapping) {
            if ((mapping as RestItemTypeAttributeGroupMapping).attributeGroupId) {
                mapping = mapping as RestItemTypeAttributeGroupMapping;
                this.attributeGroupId = mapping.attributeGroupId;
                this.itemTypeId = mapping.itemTypeId;
            } else {
                mapping = mapping as OldRestItemTypeAttributeGroupMapping;
                this.attributeGroupId = Guid.parse(mapping.GroupId).toString();
                this.itemTypeId = Guid.parse(mapping.ItemTypeId).toString();
            }
        }
    }
}
