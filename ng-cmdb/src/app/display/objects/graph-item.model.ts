import { GraphLine } from './graph-line.model';
import { Guid } from 'src/app/shared/guid';

export class GraphItem {
    id: Guid;
    type: string;
    name: string;
    level: number;
    connections: GraphLine[];
}
