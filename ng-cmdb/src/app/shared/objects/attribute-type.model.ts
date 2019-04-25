import { Guid } from 'guid-typescript';

export class AttributeType {
    typeId: Guid;
    typeName: string;

    constructor({TypeId, TypeName}) {
        this.typeId = TypeId;
        this.typeName = TypeName;
    }
}
