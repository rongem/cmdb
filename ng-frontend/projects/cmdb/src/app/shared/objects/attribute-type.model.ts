import { Guid } from 'projects/cmdb/src/app/shared/guid';

export class AttributeType {
    TypeId: Guid;
    TypeName: string;
    AttributeGroup: Guid;
    ValidationExpression: string;
}
