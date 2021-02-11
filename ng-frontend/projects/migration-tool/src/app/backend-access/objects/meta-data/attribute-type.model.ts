import { RestAttributeType } from '../../rest-api/meta-data/attribute-type.model';
import { OldRestAttributeType } from '../../old-rest-api/meta-data/attribute-type.model';
import { Guid } from '../../guid';

export class AttributeType {
    id: string;
    name: string;
    attributeGroupId: string;
    attributeGroupName?: string;
    validationExpression: string;

    constructor(attributeType?: RestAttributeType | OldRestAttributeType) {
        if (attributeType) {
            if ((attributeType as RestAttributeType).id) {
                attributeType = attributeType as RestAttributeType;
                this.id = attributeType.id;
                this.name = attributeType.name;
                this.attributeGroupId = attributeType.attributeGroupId;
                this.attributeGroupName = attributeType.attributeGroupName;
                this.validationExpression = attributeType.validationExpression;
            } else {
                attributeType = attributeType as OldRestAttributeType;
                this.id = Guid.parse(attributeType.TypeId).toString();
                this.name = attributeType.TypeName;
                this.attributeGroupId = Guid.parse(attributeType.AttributeGroup).toString();
                this.validationExpression = attributeType.ValidationExpression;
            }
        }
    }
}
