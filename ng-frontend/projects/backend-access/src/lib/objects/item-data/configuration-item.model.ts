import { OldRestConfigurationItem } from '../../old-rest-api/item-data/configuration-item.model';
import { RestItem } from '../../rest-api/item-data/item.model';
import { Guid } from '../../guid';
import { ItemAttribute } from './item-attribute.model';
import { ItemLink } from './item-link.model';

export class ConfigurationItem {
    id: string;
    typeId: string;
    type?: string;
    name: string;
    lastChange?: Date;
    version?: number;
    attributes?: ItemAttribute[];
    links?: ItemLink[];
    responsibleUsers?: string[];

    constructor(item?: RestItem | OldRestConfigurationItem) {
        if (item) {
            if ((item as OldRestConfigurationItem).ItemId) {
                item = item as OldRestConfigurationItem;
                this.id = Guid.parse(item.ItemId).toString();
                this.typeId = Guid.parse(item.ItemType).toString();
                this.type = item.TypeName;
                this.name = item.ItemName;
                this.lastChange = new Date(+item.ItemLastChange / 10000);
                this.version = item.ItemVersion;
                this.responsibleUsers = item.ResponsibleUsers;
            } else {
                item = item as RestItem;
                this.id = item.id;
                this.typeId = item.typeId;
                this.type = item.type;
                this.name = item.name;
                this.lastChange = item.lastChange;
                this.version = item.version;
                this.responsibleUsers = item.responsibleUsers;
                if (item.attributes) {
                    this.attributes = item.attributes.map(a => ({
                        id: a.id,
                        itemId: a.itemId,
                        typeId: a.typeId,
                        type: a.type,
                        value: a.value,
                    }));
                } else {
                    this.attributes = [];
                }
                if (item.links) {
                    this.links = item.links.map(l => ({
                        id: l.id,
                        uri: l.uri,
                        itemId: l.itemId,
                        description: l.description,
                    }));
                } else {
                    this.links = [];
                }
            }
        }
    }
}
