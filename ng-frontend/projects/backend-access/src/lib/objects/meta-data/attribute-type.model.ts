import { RestAttributeType } from '../../rest-api/meta-data/attribute-type.model';

export class AttributeType {
    id: string;
    name: string;
    attributeGroupId: string;
    attributeGroupName?: string;
    validationExpression: string;

    constructor(attributeType?: RestAttributeType) {
        if (attributeType) {
            this.id = attributeType.id;
            this.name = attributeType.name;
            this.attributeGroupId = attributeType.attributeGroupId;
            this.attributeGroupName = attributeType.attributeGroupName;
            this.validationExpression = attributeType.validationExpression;
        }
    }
}
