import { IItemType } from '../mongoose/item-type.model';
import { IAttributeGroup } from '../mongoose/attribute-group.model';

export class ItemTypeAttributeGroupMapping {
  attributeGroupId!: string;
  itemTypeId!: string;

  static createAllMappings = (itemTypes: IItemType[]) => {
    const mappings: ItemTypeAttributeGroupMapping[] = [];
    itemTypes.forEach(it => it.attributeGroups.forEach(ag => mappings.push({
        attributeGroupId: ag,
        itemTypeId: it.id,
    })));
    return mappings;
  }

  static createMappingsForItemType = (itemType: IItemType) => {
    const mappings: ItemTypeAttributeGroupMapping[] = [];
    itemType.attributeGroups.forEach(ag => mappings.push({
        attributeGroupId: ag.id,
        itemTypeId: itemType.id,
    }));
    return mappings;
  }

  static createMappingsForAttributeGroup = (itemTypes: IItemType[], attributeGroup: IAttributeGroup) => {
    const mappings: ItemTypeAttributeGroupMapping[] = [];
    itemTypes.forEach(it => it.attributeGroups.forEach(ag => {
        if (ag.id === attributeGroup.id) {
            mappings.push({
            attributeGroupId: ag.id,
            itemTypeId: it.id,
            });
        }
    }));
    return mappings;
  }
}
