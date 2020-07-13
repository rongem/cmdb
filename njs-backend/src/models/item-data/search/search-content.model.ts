import { SearchAttribute } from './search-attribute.model';
import { SearchConnection } from './search-connection.model';

export class SearchContent {
    nameOrValue?: string;
    itemTypeId?: string;
    attributes?: SearchAttribute[] = [];
    connectionsToUpper?: SearchConnection[] = [];
    connectionsToLower?: SearchConnection[] = [];
    changedBefore?: Date;
    changedAfter?: Date;
    responsibleToken?: string;
}
