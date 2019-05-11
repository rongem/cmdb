import { Guid } from 'guid-typescript';

export class SearchConnection {
    ConnectionType: Guid;
    ConfigurationItemType?: Guid;
    Count: string;
}
