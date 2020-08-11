import { ItemAttribute } from "./item-attribute.model";
import { ItemLink } from "./item-link.model";
import { IConfigurationItem } from "../mongoose/configuration-item.model";
import { IUser } from '../mongoose/user.model';
import { typeField } from '../../util/fields.constants';

export class ConfigurationItem {
    id!: string;
    typeId!: string;
    type?: string;
    name!: string;
    lastChange?: Date;
    version?: number;
    attributes: ItemAttribute[] = [];
    links: ItemLink[] = [];
    responsibleUsers: IUser[] = [];

    constructor(item?: IConfigurationItem) {
        if (item) {
            this.id = item._id.toString();
            this.name = item.name;
            if (item.populated(typeField)) {
                this.typeId = item.type._id.toString();
                this.type = item.type.name;
            } else {
                this.typeId = item.type.toString();
            }
            this.lastChange = item.updatedAt;
            this.version = item.__v;
            item.attributes.forEach(a => this.attributes.push(new ItemAttribute(a)));
            item.links.forEach(l => this.links.push(new ItemLink(l)));
            this.responsibleUsers = [...item.responsibleUsers];
        }
    }
}
