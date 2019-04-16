import { Guid } from 'guid-typescript';

export class ItemType {
    typeId: Guid;
    typeName: string;
    typeBackColor: string;

    constructor({TypeId, TypeName, TypeBackColor}) {
        this.typeId = TypeId;
        this.typeName = TypeName;
        this.typeBackColor = TypeBackColor;
    }
}
