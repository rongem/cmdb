import { ConfigurationItem } from '../configuration-item.model';
import { FullConfigurationItem } from '../full/full-configuration-item.model';
import { Direction } from './neighbor-search.model';

export class NeighborItem {
    level!: number;
    path!: string;
    direction!: Direction;
    id!: string;
    item?: ConfigurationItem;
    fullItem?: FullConfigurationItem;

    constructor(item?: any) {
        if (item) {
            this.level = item.Level;
            this.path = item.Path;
            this.item = new ConfigurationItem(item.Item);
            if (item.FullItem) {
                this.fullItem = new FullConfigurationItem(item.FullItem);
            }
        }
    }
}
