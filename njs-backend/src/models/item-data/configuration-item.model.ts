import { ItemAttribute } from './item-attribute.model';
import { ItemLink } from './item-link.model';
import { IConfigurationItem } from '../mongoose/configuration-item.model';
import { IUser } from '../mongoose/user.model';

export class ConfigurationItem {
    id!: string;
    typeId!: string;
    type?: string;
    backColor?: string;
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
            this.typeId = item.type.toString();
            this.type = item.typeName;
            this.backColor = item.typeColor;
            this.lastChange = new Date(item.updatedAt as string);
            this.version = (item as any).__v;
            item.attributes.forEach(a => this.attributes.push(new ItemAttribute(a)));
            item.links.forEach(l => this.links.push(new ItemLink(l)));
            this.responsibleUsers = item.responsibleUsers.map(u => (u as IUser).name).sort();
        }
    }
}
