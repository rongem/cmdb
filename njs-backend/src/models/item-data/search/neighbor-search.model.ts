import { SearchContent } from './search-content.model';

export enum Direction {
    upward = -1,
    both = 0,
    downward = 1,
}

export class NeighborSearch {
    sourceItem!: string;
    itemTypeId!: string;
    maxLevels!: number;
    searchDirection!: Direction;
    extraSearch?: SearchContent;
}
