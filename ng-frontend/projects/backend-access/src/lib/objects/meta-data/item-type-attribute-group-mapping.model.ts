import { RestItemTypeAttributeGroupMapping } from '../../rest-api/meta-data/item-type-attribute-group-mapping.model';
import { OldRestItemTypeAttributeGroupMapping } from '../../old-rest-api/meta-data/item-type-attribute-group-mapping.model';
import { Guid } from '../../guid';

export class ItemTypeAttributeGroupMapping {
    attributeGroupId: string;
    itemTypeId: string;

    constructor(mapping?: RestItemTypeAttributeGroupMapping | OldRestItemTypeAttributeGroupMapping) {
        if (mapping) {
            if (mapping instanceof RestItemTypeAttributeGroupMapping) {
                this.attributeGroupId = mapping.attributeGroupId;
                this.itemTypeId = mapping.itemTypeId;
            } else {
                this.attributeGroupId = Guid.parse(mapping.GroupId).toString();
                this.itemTypeId = Guid.parse(mapping.ItemTypeId).toString();
            }
        }
    }
}
