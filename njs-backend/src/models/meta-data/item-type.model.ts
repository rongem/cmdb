import { IItemType } from '../mongoose/item-type.model';
import { AttributeGroup } from './attribute-group.model';
import { attributeGroupsField } from '../../util/fields.constants';

export class ItemType {
    id!: string;
    name!: string;
    backColor!: string;
    attributeGroups?: AttributeGroup[];

    constructor(entity?: IItemType) {
        if (entity) {
            this.id = entity._id.toString();
            this.name = entity.name;
            this.backColor = entity.color;
            if (entity.populated(attributeGroupsField)) {
                this.attributeGroups = entity.attributeGroups.map(ag => new AttributeGroup(ag));
            }
        }
    }
}
