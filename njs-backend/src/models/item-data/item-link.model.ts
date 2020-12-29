import { IConfigurationItem, ILink } from '../mongoose/configuration-item.model';

export class ItemLink {
    id!: string;
    itemId!: string;
    uri!: string;
    description!: string;

    constructor(link?: ILink) {
        if (link) {
            this.id = link.id!;
            this.itemId = link.parent().id!;
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
