import { RestConfigurationItem } from '../../rest-api/item-data/configuration-item.model';
import { Guid } from '../../guid';

export class ConfigurationItem {
    id: string;
    typeId: string;
    type?: string;
    name: string;
    lastChange: Date;
    version: number;
    responsibleUsers?: string[];

    constructor(item?: RestConfigurationItem) {
        if (item) {
            this.id = Guid.parse(item.ItemId).toString();
            this.typeId = Guid.parse(item.ItemType).toString();
            this.type = item.TypeName;
            this.name = item.ItemName;
            this.lastChange = new Date(item.ItemLastChange);
            this.version = item.ItemVersion;
            this.responsibleUsers = item.ResponsibleUsers;
        }
    }
}
