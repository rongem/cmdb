import { RestFullLink } from '../../../rest-api/item-data/full/full-link.model';
import { Guid } from '../../../guid';

export class FullLink {
    id: string;
    uri: string;
    description: string;

    constructor(link?: RestFullLink) {
        if (link) {
            this.id = Guid.parse(link.id).toString();
            this.uri = link.uri;
            this.description = link.description;
        }
    }
}
