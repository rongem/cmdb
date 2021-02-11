import { RestItem } from '../rest-item.model';
import { RestFullItem } from '../full/rest-full-item.model';
import { Direction } from './rest-neighbor-search.model';

export class RestNeighborItem {
    level!: number;
    path!: string;
    direction!: Direction;
    id!: string;
    item?: RestItem;
    fullItem?: RestFullItem;
}
