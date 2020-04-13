import { RestSearchAttribute } from './search-attribute.model';
import { RestSearchConnection } from './search-connection.model';

export class SearchContent {
    NameOrValue: string;
    ItemType: string;
    Attributes: RestSearchAttribute[] = [];
    ConnectionsToUpper: RestSearchConnection[] = [];
    ConnectionsToLower: RestSearchConnection[] = [];
    ResponsibleToken: string;
}
