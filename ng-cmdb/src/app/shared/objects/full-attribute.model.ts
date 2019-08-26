import { Guid } from 'guid-typescript';

export class FullAttribute {
    id: Guid;
    type: string;
    typeId: Guid;
    value: string;
    lastChange: Date;
    version: number;
}
