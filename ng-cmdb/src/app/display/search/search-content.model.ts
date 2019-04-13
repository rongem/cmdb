import { SearchAttribute } from './search-attribute.model';
import { SearchConnection } from './search-connection.model';

export class SearchContent {
    nameOrValue: string;
    itemType: string;
    attributes: SearchAttribute[];
    connectionsToUpper: SearchConnection[];
    connectionsToLower: SearchConnection[];
    responsibleToken: string;
}
