import { SearchAttribute } from './search-attribute.model';
import { SearchConnection } from './search-connection.model';

// input only field for search queries
export class SearchContent {
    nameOrValue?: string;
    itemTypeId?: string;
    attributes?: SearchAttribute[] = [];
    connectionsToUpper?: SearchConnection[] = [];
    connectionsToLower?: SearchConnection[] = [];
    changedBefore?: Date;
    changedAfter?: Date;
    responsibleUser?: string;
}
