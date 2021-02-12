import { FullConfigurationItem } from 'backend-access';

export class NamedObject {
    id: string;
    name: string;
    item?: FullConfigurationItem;
    responsibleUsers: string[] = [];

    constructor(item?: FullConfigurationItem) {
        if (item) {
            this.id = item.id;
            this.name = item.name;
            this.item = item;
            this.responsibleUsers = item.responsibilities ?? [];
        }
    }
}
