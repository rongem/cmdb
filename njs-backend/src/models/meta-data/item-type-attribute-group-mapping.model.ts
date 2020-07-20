import { IItemType } from "../mongoose/item-type.model";
import { IAttributeGroup } from "../mongoose/attribute-group.model";

export class ItemTypeAttributeGroupMapping {
  attributeGroupId!: string;
  itemTypeId!: string;

  static createAllMappings = (itemTypes: IItemType[]) => {
    const mappings: ItemTypeAttributeGroupMapping[] = [];
    itemTypes.forEach(it => it.attributeGroups.forEach(ag => mappings.push({
        attributeGroupId: ag._id.toString(),
        itemTypeId: it._id.toString(),
    })));
    return mappings;
  };

  static createMappingsForItemType = (itemType: IItemType) => {
    const mappings: ItemTypeAttributeGroupMapping[] = [];
    itemType.attributeGroups.forEach(ag => mappings.push({
        attributeGroupId: ag._id.toString(),
        itemTypeId: itemType._id.toString(),
    }));
    return mappings;
  };

  static createMappingsForAttributeGroup = (itemTypes: IItemType[], attributeGroup: IAttributeGroup) => {
    const mappings: ItemTypeAttributeGroupMapping[] = [];
    itemTypes.forEach(it => it.attributeGroups.forEach(ag => {
        if (ag._id.toString() === attributeGroup._id.toString()) {
            mappings.push({
            attributeGroupId: ag._id.toString(),
            itemTypeId: it._id.toString(),
            });
        }
    }));
    return mappings;
  };
}
