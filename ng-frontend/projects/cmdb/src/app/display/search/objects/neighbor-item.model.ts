import { ConfigurationItem } from 'projects/cmdb/src/app/shared/objects/configuration-item.model';
import { FullConfigurationItem } from 'projects/cmdb/src/app/shared/objects/full-configuration-item.model';

export class NeighborItem {
    Level: number;
    Path: string;
    Item: ConfigurationItem;
    FullItem?: FullConfigurationItem;
}
