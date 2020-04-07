import { ConfigurationItem } from '../configuration-item.model';
import { FullConfigurationItem } from '../full/full-configuration-item.model';

export class NeighborItem {
    Level: number;
    Path: string;
    Item: ConfigurationItem;
    FullItem?: FullConfigurationItem;
}
