import { RestItemType } from '../../rest-api/meta-data/item-type.model';
import { OldRestItemType } from '../../old-rest-api/meta-data/item-type.model';
import { Guid } from '../../guid';
import { AttributeGroup } from './attribute-group.model';

export class ItemType {
    id: string;
    name: string;
    backColor: string;
    attributeGroups?: AttributeGroup[];

    constructor(itemType?: RestItemType | OldRestItemType) {
        if (itemType) {
            if (itemType instanceof RestItemType) {
                this.id = itemType.id;
                this.name = itemType.name;
                this.backColor = itemType.backColor;
                if (itemType.attributeGroups) {
                    this.attributeGroups = itemType.attributeGroups.map(ag => new AttributeGroup(ag));
                }
            } else {
                this.id = Guid.parse(itemType.TypeId).toString();
                this.name = itemType.TypeName;
                this.backColor = itemType.TypeBackColor;
            }
        }
    }
}
