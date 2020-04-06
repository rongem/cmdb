import { SearchAttribute } from './search-attribute.model';
import { SearchConnection } from './search-connection.model';
import { Guid } from 'backend-access';

export class SearchContent {
    NameOrValue: string;
    ItemType: Guid;
    Attributes: SearchAttribute[] = [];
    ConnectionsToUpper: SearchConnection[] = [];
    ConnectionsToLower: SearchConnection[] = [];
    ResponsibleToken: string;
}
