import { IItemType } from '../mongoose/item-type.model';
import { AttributeGroup } from './attribute-group.model';
import { attributeGroupsField, idField } from '../../util/fields.constants';
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
            if (entity.populated(attributeGroupsField)) {
                this.attributeGroups = entity.attributeGroups.map(ag => new AttributeGroup(ag));
            } else {
                this.attributeGroups = (entity.attributeGroups as IAttributeGroup[]).map(ag => ({ [idField]: ag._id.toString(), name: '' }));
            }
        }
    }
}
