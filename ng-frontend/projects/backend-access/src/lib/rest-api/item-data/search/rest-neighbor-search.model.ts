import { RestSearchContent } from './rest-search-content.model';

export enum Direction {
    up = -1,
    both = 0,
    down = 1,
}

export class RestNeighborSearch {
    sourceItem!: string;
    itemTypeId!: string;
    maxLevels!: number;
    searchDirection!: Direction;
    extraSearch?: RestSearchContent;
}
