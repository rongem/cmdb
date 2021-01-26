import { ItemAttribute } from './item-attribute.model';
import { ItemLink } from './item-link.model';
import { IConfigurationItem } from '../mongoose/configuration-item.model';
import { typeField } from '../../util/fields.constants';

export class ConfigurationItem {
    id!: string;
    typeId!: string;
    type?: string;
    color?: string;
    name!: string;
    lastChange?: Date;
    version?: number;
    attributes: ItemAttribute[] = [];
    links: ItemLink[] = [];
    responsibleUsers: string[] = [];

    constructor(item?: IConfigurationItem) {
        if (item) {
            this.id = item.id!;
            this.name = item.name;
            if (item.populated(typeField) || item.type.id) {
                this.typeId = item.type.id;
                this.type = item.type.name;
                this.type = item.type.color;
            } else {
                this.typeId = item.type.toString();
            }
            this.lastChange = new Date(item.updatedAt as string);
            this.version = item.__v;
            item.attributes.forEach(a => this.attributes.push(new ItemAttribute(a)));
            item.links.forEach(l => this.links.push(new ItemLink(l)));
            this.responsibleUsers = item.responsibleUsers.map(u => u.name).sort();
        }
    }
}
