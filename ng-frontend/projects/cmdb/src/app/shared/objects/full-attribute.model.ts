import { Guid } from 'projects/cmdb/src/app/shared/guid';

export class FullAttribute {
    id: Guid;
    type: string;
    typeId: Guid;
    value: string;
    lastChange: Date;
    version: number;
}
