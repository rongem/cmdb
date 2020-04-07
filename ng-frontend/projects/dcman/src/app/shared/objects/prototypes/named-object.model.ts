import { Guid } from 'backend-access';
import { FullConfigurationItem } from 'backend-access';

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
