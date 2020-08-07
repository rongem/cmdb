import { ItemAttribute } from "./item-attribute.model";
import { ItemLink } from "./item-link.model";
import { IConfigurationItem } from "../mongoose/configuration-item.model";

export class ConfigurationItem {
    id!: string;
    typeId!: string;
    type?: string;
    name!: string;
    lastChange?: Date;
    version?: number;
    attributes: ItemAttribute[] = [];
    links: ItemLink[] = [];
    responsibleUsers: string[] = [];

    constructor(item?: IConfigurationItem) {
        if (item) {
            this.id = item._id.toString();
            this.name = item.name;
            if (item.populated('type')) {
                this.typeId = item.type._id.toString();
                this.type = item.type.name;
            } else {
                this.typeId = item.type.toString();
            }
            this.lastChange = item.lastChange;
            this.version = item.__v;
            item.attributes.forEach(a => this.attributes.push(new ItemAttribute(a)));
            item.links.forEach(l => this.links.push(new ItemLink(l)));
            this.responsibleUsers = [...item.responsibleUsers];
        }
    }
}
