import { OldRestConfigurationItem } from '../configuration-item.model';
import { OldRestFullConfigurationItem } from '../full/full-configuration-item.model';

export class RestNeighborItem {
    Level: number;
    Path: string;
    Item: OldRestConfigurationItem;
    FullItem?: OldRestFullConfigurationItem;
}
