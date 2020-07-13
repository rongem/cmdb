import { RestAttributeGroup } from '../../rest-api/meta-data/attribute-group.model';
import { Guid } from '../../guid';

export class AttributeGroup {
    id!: string;
    name!: string;

    constructor(attributeGroup?: RestAttributeGroup) {
        if (attributeGroup) {
            this.id = Guid.parse(attributeGroup.GroupId).toString();
            this.name = attributeGroup.GroupName;
        }
    }
}
