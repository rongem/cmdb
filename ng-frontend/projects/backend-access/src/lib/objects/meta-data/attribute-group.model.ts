import { OldRestAttributeGroup } from '../../old-rest-api/meta-data/attribute-group.model';
import { Guid } from '../../guid';
import { RestAttributeGroup } from '../../rest-api/meta-data/attribute-group.model';

export class AttributeGroup {
    id: string;
    name: string;

    constructor(attributeGroup?: RestAttributeGroup | OldRestAttributeGroup) {
        if (attributeGroup) {
            if ((attributeGroup as RestAttributeGroup).id) {
                attributeGroup = attributeGroup as RestAttributeGroup;
                this.id = attributeGroup.id;
                this.name = attributeGroup.name;
            } else {
                attributeGroup = attributeGroup as OldRestAttributeGroup;
                this.id = Guid.parse(attributeGroup.GroupId).toString();
                this.name = attributeGroup.GroupName;
            }
        }
    }
}
