import { ConfigurationItem } from '../configuration-item.model';
import { FullConfigurationItem } from '../full/full-configuration-item.model';
import { IRestNeighborItem } from '../../../rest-api/item-data/search/rest-neighbor-item.model';
import { Direction } from './neighbor-search.model';

export class NeighborItem {
    level: number;
    path: string;
    direction: Direction;
    item?: ConfigurationItem;
    fullItem?: FullConfigurationItem;

    constructor(item?: IRestNeighborItem) {
        if (item) {
            this.level = item.level;
            this.direction = +item.direction;
            this.path = item.path;
            if (item.item) {
                this.item = new ConfigurationItem(item.item);
            }
            if (item.fullItem) {
                this.fullItem = new FullConfigurationItem(item.fullItem);
            }
        }
    }
}
