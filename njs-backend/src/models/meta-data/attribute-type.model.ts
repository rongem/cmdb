import { IAttributeGroup } from '../mongoose/attribute-group.model';
import { IAttributeType } from '../mongoose/attribute-type.model';

export class AttributeType {
    id!: string;
    name!: string;
    attributeGroupId!: string;
    attributeGroupName?: string;
    validationExpression!: string;

    constructor(entity?: IAttributeType) {
        if (entity) {
            this.id = entity.id!;
            this.name = entity.name;
            if (entity.populated('attributeGroup')) {
                this.attributeGroupId = (entity.attributeGroup as IAttributeGroup).id!;
                this.attributeGroupName = (entity.attributeGroup as IAttributeGroup).name;
            } else {
                this.attributeGroupId = entity.attributeGroup.toString();
            }
            this.validationExpression = entity.validationExpression;
        }
    }
}
