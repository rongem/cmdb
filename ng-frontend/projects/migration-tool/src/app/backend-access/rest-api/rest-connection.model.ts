import { Connection } from '../objects/item-data/connection.model';

export class RestConnection {
    ConnId: string;
    ConnType: string;
    ConnUpperItem: string;
    ConnLowerItem: string;
    RuleId: string;
    Description: string;
}

export class ConnectionResult {
    connections: Connection[];
    totalConnections: number;
}
