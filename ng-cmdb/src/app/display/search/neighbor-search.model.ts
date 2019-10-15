import { Guid } from 'src/app/shared/guid';
import { SearchContent } from './search-content.model';

export enum Direction {
    upward = -1,
    both = 0,
    downward = 1,
}

export class NeighborSearch {
    SourceItem: Guid;
    ItemType: Guid;
    MaxLevels: number;
    SearchDirection: Direction;
    ExtraSearch: SearchContent;
}
