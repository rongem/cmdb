import { SearchAttribute } from './search-attribute.model';
import { SearchConnection } from './search-connection.model';

export class SearchContent {
    NameOrValue: string;
    ItemType: string;
    Attributes: SearchAttribute[];
    ConnectionsToUpper: SearchConnection[];
    ConnectionsToLower: SearchConnection[];
    ResponsibleToken: string;
}
