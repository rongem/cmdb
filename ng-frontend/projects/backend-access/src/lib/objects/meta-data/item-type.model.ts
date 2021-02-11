import { RestItemType } from '../../rest-api/meta-data/item-type.model';
import { AttributeGroup } from './attribute-group.model';

export class ItemType {
    id: string;
    name: string;
    backColor: string;
    attributeGroups?: AttributeGroup[];

    constructor(itemType?: RestItemType) {
        if (itemType) {
            this.id = itemType.id;
            this.name = itemType.name;
            this.backColor = itemType.backColor;
            if (itemType.attributeGroups) {
                this.attributeGroups = itemType.attributeGroups.map(ag => new AttributeGroup(ag));
            }
        }
    }
}
