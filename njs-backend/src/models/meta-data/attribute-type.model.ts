import { IAttributeTypePopulated } from '../mongoose/attribute-type.model';
import { attributeGroupField } from '../../util/fields.constants';

export class AttributeType {
    id!: string;
    name!: string;
    attributeGroupId!: string;
    attributeGroupName?: string;
    validationExpression!: string;

    constructor(entity?: IAttributeTypePopulated) {
        if (entity) {
            this.id = entity._id.toString();
            this.name = entity.name;
            if (entity.populated(attributeGroupField)) {
                this.attributeGroupId = entity.attributeGroup._id.toString();
                this.attributeGroupName = entity.attributeGroup.name;
            } else {
                this.attributeGroupId = entity.attributeGroup.toString();
            }
            this.validationExpression = entity.validationExpression;
        }
    }
}
