import { IRestAttributeGroup } from '../../rest-api/meta-data/attribute-group.model';

export class AttributeGroup {
    id: string;
    name: string;

    constructor(attributeGroup?: IRestAttributeGroup) {
        if (attributeGroup) {
            this.id = attributeGroup.id;
            this.name = attributeGroup.name;
        }
    }
}
