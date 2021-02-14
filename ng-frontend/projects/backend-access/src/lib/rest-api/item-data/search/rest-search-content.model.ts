import { IRestSearchAttribute } from './rest-search-attribute.model';
import { IRestSearchConnection } from './rest-search-connection.model';

// input only field for search queries
export interface IRestSearchContent {
    nameOrValue?: string;
    itemTypeId?: string;
    attributes?: IRestSearchAttribute[];
    connectionsToUpper?: IRestSearchConnection[];
    connectionsToLower?: IRestSearchConnection[];
    changedBefore?: Date;
    changedAfter?: Date;
    responsibleUser?: string;
}
