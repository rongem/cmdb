import { Guid } from 'backend-access';

export class SearchConnection {
    ConnectionType: Guid;
    ConfigurationItemType?: Guid;
    Count: string;
}
