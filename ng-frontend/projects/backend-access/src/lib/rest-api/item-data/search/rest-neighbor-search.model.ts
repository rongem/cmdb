import { IRestSearchContent } from './rest-search-content.model';

export enum Direction {
    up = -1,
    both = 0,
    down = 1,
}

export interface IRestNeighborSearch {
    sourceItem: string;
    itemTypeId: string;
    maxLevels: number;
    searchDirection: Direction;
    extraSearch?: IRestSearchContent;
}
