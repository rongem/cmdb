import { ILink } from '../mongoose/configuration-item.model';

export class ItemLink {
    id!: string;
    itemId!: string;
    uri!: string;
    description!: string;

    constructor(link?: ILink) {
        if (link) {
            this.id = link._id.toString();
            this.itemId = link.parent()._id.toString();
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
