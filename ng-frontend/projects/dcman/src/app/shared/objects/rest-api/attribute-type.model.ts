import { Guid } from '../../guid';

export class AttributeType {
    TypeId: Guid;
    TypeName: string;
    AttributeGroup: Guid;
    ValidationExpression: string;
}
