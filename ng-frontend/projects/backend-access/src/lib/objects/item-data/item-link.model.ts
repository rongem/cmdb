import { RestLink } from '../../rest-api/item-data/rest-link.model';

export class ItemLink {
    id: string;
    itemId: string;
    uri: string;
    description: string;

    constructor(link?: RestLink) {
        if (link) {
            this.id = link.id;
            this.itemId = link.itemId;
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
