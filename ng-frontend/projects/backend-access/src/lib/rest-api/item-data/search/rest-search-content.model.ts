import { RestSearchAttribute } from './rest-search-attribute.model';
import { RestSearchConnection } from './rest-search-connection.model';

// input only field for search queries
export class RestSearchContent {
    nameOrValue?: string;
    itemTypeId?: string;
    attributes?: RestSearchAttribute[] = [];
    connectionsToUpper?: RestSearchConnection[] = [];
    connectionsToLower?: RestSearchConnection[] = [];
    changedBefore?: Date;
    changedAfter?: Date;
    responsibleUser?: string;
}
