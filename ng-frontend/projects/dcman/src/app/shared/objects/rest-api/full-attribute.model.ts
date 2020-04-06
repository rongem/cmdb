import { Guid } from 'backend-access';

export class FullAttribute {
    id: Guid;
    type: string;
    typeId: Guid;
    value: string;
    lastChange: Date;
    version: number;
}
