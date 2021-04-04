import { IConfigurationItem, ILink } from '../mongoose/configuration-item.model';

export class ItemLink {
    itemId!: string;
    uri!: string;
    description!: string;

    constructor(link?: ILink) {
        if (link) {
            this.itemId = link.parent().id!;
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
