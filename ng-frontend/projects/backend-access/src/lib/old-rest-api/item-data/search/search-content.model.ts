import { RestSearchAttribute } from './search-attribute.model';
import { RestSearchConnection } from './search-connection.model';

export class RestSearchContent {
    NameOrValue: string;
    ItemType: string;
    Attributes: RestSearchAttribute[] = [];
    ConnectionsToUpper: RestSearchConnection[] = [];
    ConnectionsToLower: RestSearchConnection[] = [];
    ChangedBefore: number;
    ChangedAfter: number;
    ResponsibleToken: string;
}
