import { IRestLink } from '../../rest-api/item-data/rest-link.model';

export class ItemLink {
    itemId: string;
    uri: string;
    description: string;

    constructor(link?: IRestLink) {
        if (link) {
            this.itemId = link.itemId;
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
