import { RestAttributeGroup } from '../../rest-api/meta-data/attribute-group.model';

export class AttributeGroup {
    id: string;
    name: string;

    constructor(attributeGroup?: RestAttributeGroup) {
        if (attributeGroup) {
            this.id = attributeGroup.id;
            this.name = attributeGroup.name;
        }
    }
}
