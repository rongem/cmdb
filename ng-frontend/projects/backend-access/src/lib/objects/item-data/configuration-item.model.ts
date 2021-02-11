import { RestItem } from '../../rest-api/item-data/rest-item.model';
import { ItemAttribute } from './item-attribute.model';
import { ItemLink } from './item-link.model';

export class ConfigurationItem {
    id: string;
    typeId: string;
    type?: string;
    color?: string;
    name: string;
    lastChange?: Date;
    version?: number;
    attributes?: ItemAttribute[];
    links?: ItemLink[];
    responsibleUsers?: string[];

    constructor(item?: RestItem) {
        if (item) {
            item = item as RestItem;
            this.id = item.id;
            this.typeId = item.typeId;
            this.type = item.type;
            this.color = item.color;
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
