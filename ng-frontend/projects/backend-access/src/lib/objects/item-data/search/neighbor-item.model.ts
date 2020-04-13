import { ConfigurationItem } from '../configuration-item.model';
import { FullConfigurationItem } from '../full/full-configuration-item.model';
import { RestNeighborItem } from '../../../rest-api/item-data/search/neighbor-item.model';

export class NeighborItem {
    level: number;
    path: string;
    item: ConfigurationItem;
    fullItem?: FullConfigurationItem;

    constructor(item?: RestNeighborItem) {
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
