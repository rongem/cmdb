import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

export class NeighborItem {
    Level: number;
    Path: string;
    Item: ConfigurationItem;
    FullItem?: FullConfigurationItem;
}
