import { IItemType } from '../mongoose/item-type.model';
import { AttributeGroup } from './attribute-group.model';
import { IAttributeGroup } from '../mongoose/attribute-group.model';

export class ItemType {
    id!: string;
    name!: string;
    backColor!: string;
    attributeGroups?: AttributeGroup[];

    constructor(entity?: IItemType) {
        if (entity) {
            this.id = entity.id || '';
            this.name = entity.name;
            this.backColor = entity.color;
            if (entity.populated('attributeGroups')) {
                this.attributeGroups = entity.attributeGroups.map(ag => new AttributeGroup(ag as IAttributeGroup));
            } else {
                this.attributeGroups = (entity.attributeGroups as IAttributeGroup[]).map(ag => ({ id: ag._id.toString(), name: '' }));
            }
        }
    }
}
