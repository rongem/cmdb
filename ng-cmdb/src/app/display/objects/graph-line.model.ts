import { Guid } from 'src/app/shared/guid';

export class GraphLine {
    id: Guid;
    origin: Guid;
    originIndex: number;
    target: Guid;
    targetIndex: number;
    description: string;
    topX: number;
    topY: number;
    bottonX: number;
    bottomY: number;
}
