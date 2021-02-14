import { IRestItem } from '../rest-item.model';
import { IRestFullItem } from '../full/rest-full-item.model';
import { Direction } from './rest-neighbor-search.model';

export interface IRestNeighborItem {
    level: number;
    path: string;
    direction: Direction;
    id: string;
    item?: IRestItem;
    fullItem?: IRestFullItem;
}
