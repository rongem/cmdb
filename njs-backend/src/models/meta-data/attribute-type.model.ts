import { IAttributeType } from "../mongoose/attribute-type.model";

export class AttributeType {
    id!: string;
    name!: string;
    attributeGroupId!: string;
    validationExpression!: string;

    constructor(entity?: IAttributeType) {
        if (entity) {
            this.id = entity._id.toString();
            this.name = entity.name;
            this.attributeGroupId = entity.attributeGroup.toString();
            this.validationExpression = entity.validationExpression;
        }
    }
}
