import { Guid } from 'backend-access';

export class AttributeType {
    TypeId: Guid;
    TypeName: string;
    AttributeGroup: Guid;
    ValidationExpression: string;
}
