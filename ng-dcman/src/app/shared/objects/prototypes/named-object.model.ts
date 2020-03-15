import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';

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
