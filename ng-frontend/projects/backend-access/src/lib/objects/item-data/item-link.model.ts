import { RestItemLink } from '../../rest-api/item-data/item-link.model';
import { Guid } from '../../guid';

export class ItemLink {
    id: string;
    itemId: string;
    uri: string;
    description: string;

    constructor(link?: RestItemLink) {
        if (link) {
            this.id = Guid.parse(link.LinkId).toString();
            this.itemId = Guid.parse(link.ItemId).toString();
            this.uri = link.LinkURI;
            this.description = link.LinkDescription;
        }
    }
}
