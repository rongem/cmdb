import { Guid } from '../../guid';
import { FullConfigurationItem } from '../rest-api/full-configuration-item.model';

export class NamedObject {
    id: Guid;
    name: string;
    item?: FullConfigurationItem;

    constructor(item?: FullConfigurationItem) {
        if (item) {
            this.id = item.id;
            this.name = item.name;
            this.item = item;
        }
    }
}
