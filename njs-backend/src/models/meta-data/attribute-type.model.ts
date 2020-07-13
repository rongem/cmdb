import { RestAttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { Guid } from '../../guid';

export class AttributeType {
    id!: string;
    name!: string;
    attributeGroupId!: string;
    validationExpression!: string;

    constructor(attributeType?: RestAttributeType) {
        if (attributeType) {
            this.id = Guid.parse(attributeType.TypeId).toString();
            this.name = attributeType.TypeName;
            this.attributeGroupId = Guid.parse(attributeType.AttributeGroup).toString();
            this.validationExpression = attributeType.ValidationExpression;
        }
    }
}
