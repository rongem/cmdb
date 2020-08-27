import { OldRestConfigurationItem } from '../configuration-item.model';
import { RestFullConfigurationItem } from '../full/full-configuration-item.model';

export class RestNeighborItem {
    Level: number;
    Path: string;
    Item: OldRestConfigurationItem;
    FullItem?: RestFullConfigurationItem;
}
