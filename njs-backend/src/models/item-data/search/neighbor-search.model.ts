import { SearchContent } from './search-content.model';

export enum Direction {
    up = -1,
    both = 0,
    down = 1,
}

export class NeighborSearch {
    sourceItem!: string;
    itemTypeId!: string;
    maxLevels!: number;
    searchDirection!: Direction;
    extraSearch?: SearchContent;
}
