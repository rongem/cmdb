import { Guid } from 'src/app/shared/guid';

export class SearchConnection {
    ConnectionType: Guid;
    ConfigurationItemType?: Guid;
    Count: string;
}
