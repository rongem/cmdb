import { FullConfigurationItem } from 'backend-access';

export class NamedObject {
    id: string;
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
