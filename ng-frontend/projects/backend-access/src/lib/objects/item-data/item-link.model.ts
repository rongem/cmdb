import { IRestLink } from '../../rest-api/item-data/rest-link.model';

export class ItemLink {
    uri: string;
    description: string;

    constructor(link?: IRestLink) {
        if (link) {
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
