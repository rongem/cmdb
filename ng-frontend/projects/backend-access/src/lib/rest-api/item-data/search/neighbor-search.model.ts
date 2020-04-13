import { SearchContent } from './search-content.model';

export enum Direction {
    upward = -1,
    both = 0,
    downward = 1,
}

export class RestNeighborSearch {
    SourceItem: string;
    ItemType: string;
    MaxLevels: number;
    SearchDirection: Direction;
    ExtraSearch: SearchContent;
}
