import { IRestItem } from '../../rest-api/item-data/rest-item.model';
import { ItemAttribute } from './item-attribute.model';
import { ItemLink } from './item-link.model';

// @dynamic
export class ConfigurationItem {
    id?: string;
    typeId: string;
    type?: string;
    color?: string;
    name: string;
    lastChange?: Date;
    version?: number;
    attributes?: ItemAttribute[];
    links?: ItemLink[];
    responsibleUsers?: string[];

    constructor(item?: IRestItem) {
        if (item) {
            this.id = item.id;
            this.typeId = item.typeId;
            this.type = item.type;
            this.color = item.color;
            this.name = item.name;
            this.lastChange = item.lastChange;
            this.version = item.version;
            this.responsibleUsers = [...new Set(item.responsibleUsers)];
            if (item.attributes) {
                this.attributes = item.attributes.map(a => ({
                    typeId: a.typeId,
                    type: a.type,
                    value: a.value,
                }));
            } else {
                this.attributes = [];
            }
            if (item.links) {
                this.links = item.links.map(l => ({
                    uri: l.uri,
                    description: l.description,
                }));
            } else {
                this.links = [];
            }
        }
    }

    static copyItem(item: ConfigurationItem): ConfigurationItem {
        return {
            id: item.id,
            typeId: item.typeId,
            type: item.type,
            color: item.color,
            name: item.name,
            lastChange: item.lastChange,
            version: item.version,
            responsibleUsers: [...new Set(item.responsibleUsers)],
            attributes: item.attributes ? item.attributes.map(a => ({
                typeId: a.typeId,
                type: a.type,
                value: a.value,
            })) : [],
            links: item.links ? item.links.map(l => ({
                uri: l.uri,
                description: l.description,
            })) : [],
        };
    }
}
