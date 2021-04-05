import { IConfigurationItem, ILink } from '../mongoose/configuration-item.model';

export class ItemLink {
    uri!: string;
    description!: string;

    constructor(link?: ILink) {
        if (link) {
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
