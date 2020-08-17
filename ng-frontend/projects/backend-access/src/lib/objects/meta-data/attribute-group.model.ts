import { OldRestAttributeGroup } from '../../old-rest-api/meta-data/attribute-group.model';
import { Guid } from '../../guid';
import { RestAttributeGroup } from '../../rest-api/meta-data/attribute-group.model';

export class AttributeGroup {
    id: string;
    name: string;

    constructor(attributeGroup?: RestAttributeGroup | OldRestAttributeGroup) {
        if (attributeGroup) {
            if (attributeGroup instanceof RestAttributeGroup) {
                this.id = attributeGroup.id;
                this.name = attributeGroup.name;
            } else {
                this.id = Guid.parse(attributeGroup.GroupId).toString();
                this.name = attributeGroup.GroupName;
            }
        }
    }
}
